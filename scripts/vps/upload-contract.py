#!/usr/bin/env python3
"""
Upload an advertising contract PDF to Documenso.

Creates a draft envelope with signature fields and recipients by calling
the Documenso API directly. Does NOT send unless --send is passed.

The API key is read from the macOS Keychain (service: documenso-api-key,
account: api). Store it once with:

    security add-generic-password -s documenso-api-key -a api -w

Defaults (url, cc) are read from upload-contract.toml next to this
script. CLI arguments override.

Usage:
    upload-contract.py document.pdf --signer-email john@acme.com --signer-name "John Smith"
    upload-contract.py document.pdf --it --send

Requires:
    pip install requests pypdf
"""

import argparse
import json
import os
import subprocess
import sys
import tomllib

import requests
from pypdf import PdfReader

FIELDS_IT = [
    (1, 8.6774, 89.7862, 35.6294, 2.8838),
    (2, 52.7956, 48.6631, 35.6294, 2.8838),
]

FIELDS_EN = [
    (1, 8.6774, 89.7862, 35.6294, 2.8838),
    (2, 52.7956, 48.6631, 35.6294, 2.8838),
    (2, 52.7956, 60.4242, 35.6294, 2.8838),
]

KEYCHAIN_SERVICE = "documenso-api-key"
KEYCHAIN_ACCOUNT = "api"


def error(msg):
    print(f"Error: {msg}", file=sys.stderr)
    sys.exit(1)


def get_api_key_from_keychain():
    try:
        result = subprocess.run(
            ["security", "find-generic-password", "-s", KEYCHAIN_SERVICE, "-a", KEYCHAIN_ACCOUNT, "-w"],
            capture_output=True, text=True, check=True,
        )
        return result.stdout.strip()
    except subprocess.CalledProcessError:
        print(f"Error: API key not found in Keychain (service={KEYCHAIN_SERVICE}, account={KEYCHAIN_ACCOUNT}).")
        print("Store it with:  security add-generic-password -s documenso-api-key -a api -w")
        sys.exit(1)


def load_config():
    conf_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "upload-contract.toml")
    if os.path.exists(conf_path):
        try:
            with open(conf_path, "rb") as f:
                return tomllib.load(f)
        except tomllib.TOMLDecodeError as e:
            error(f"invalid config file {conf_path}: {e}")
    return {}


def detect_language(reader, config):
    lang_config = config.get("language", {})
    detect_rules = lang_config.get("detect", {})
    if not detect_rules:
        return lang_config.get("default", "en")

    if not reader.pages:
        return lang_config.get("default", "it")

    text = (reader.pages[0].extract_text() or "").upper()
    for lang, keywords in detect_rules.items():
        for keyword in keywords:
            if keyword.upper() in text:
                return lang

    return lang_config.get("default", "it")


def validate_pdf(reader, pages, lang, config):
    validation = config.get("validation", {})
    if not validation:
        return

    errors = []

    expected_pages = validation.get("pages")
    if expected_pages is not None and len(pages) != expected_pages:
        errors.append(f"expected {expected_pages} pages, got {len(pages)}")

    tolerance = 1.0
    expected_w = validation.get("page_width_mm")
    expected_h = validation.get("page_height_mm")
    if expected_w and expected_h:
        for i, (w, h) in enumerate(pages):
            if abs(w - expected_w) > tolerance or abs(h - expected_h) > tolerance:
                errors.append(f"page {i+1} is {w:.1f} x {h:.1f} mm, expected {expected_w:.0f} x {expected_h:.0f} mm")

    required_text = validation.get("required_text", [])
    if required_text and reader.pages:
        page1_text = (reader.pages[0].extract_text() or "").upper()
        for text in required_text:
            if text.upper() not in page1_text:
                errors.append(f"missing required text on page 1: \"{text}\"")

    sig_labels = validation.get("signature_labels", {})
    label = sig_labels.get(lang)
    if label:
        full_text = "".join((p.extract_text() or "") for p in reader.pages).upper()
        found = full_text.count(label.upper())
        expected = len(FIELDS_IT if lang == "it" else FIELDS_EN)
        if found != expected:
            errors.append(f"found {found} \"{label}\" labels, expected {expected} signature areas")

    if errors:
        error("PDF validation failed:\n  " + "\n  ".join(errors) + "\nUse --skip-validation to bypass.")


def api(base_url, api_key, method, path, **kwargs):
    url = f"{base_url}/api/v2{path}"
    headers = {"Authorization": api_key}
    try:
        resp = getattr(requests, method)(url, headers=headers, timeout=30, **kwargs)
    except requests.ConnectionError:
        error(f"could not connect to {base_url} — check the URL and your network")
    except requests.Timeout:
        error(f"request to {path} timed out")
    if not resp.ok:
        error(f"API {resp.status_code} on {path}: {resp.text[:300]}")
    return resp.json()


def main():
    config = load_config()

    parser = argparse.ArgumentParser(
        description="Upload advertising contract to Documenso.",
        epilog="API key is read from macOS Keychain (service: documenso-api-key). "
               "Defaults for url, cc, and language detection are read from "
               "upload-contract.toml next to this script.",
    )
    parser.add_argument("pdf", help="Path to the PDF file")
    cc = config.get("cc", {})

    parser.add_argument("--url", default=config.get("url"), help="Documenso instance URL (default: from config)")
    lang_group = parser.add_mutually_exclusive_group()
    lang_group.add_argument("--en", action="store_const", const="en", dest="lang", help="Force English layout (3 signature fields)")
    lang_group.add_argument("--it", action="store_const", const="it", dest="lang", help="Force Italian layout (2 signature fields)")
    parser.add_argument("--send", action="store_true", help="Send immediately instead of saving as draft")
    parser.add_argument("--skip-validation", action="store_true", help="Skip PDF validation checks")
    parser.add_argument("--signer-email", default=None, help="Signer email (prompted if omitted)")
    parser.add_argument("--signer-name", default=None, help="Signer display name (prompted if omitted)")
    parser.add_argument("--cc-email", default=cc.get("email"), help="CC recipient email (default: from config)")
    parser.add_argument("--cc-name", default=cc.get("name"), help="CC recipient name (default: from config)")
    args = parser.parse_args()

    if not args.url:
        parser.error("--url is required (or set url= in upload-contract.toml)")

    pdf_path = args.pdf
    if not os.path.isfile(pdf_path):
        error(f"file not found: {pdf_path}")

    if not args.signer_email:
        args.signer_email = input("Signer email: ").strip()
        if not args.signer_email:
            parser.error("Signer email is required")
    if not args.signer_name:
        args.signer_name = input("Signer name: ").strip()
        if not args.signer_name:
            parser.error("Signer name is required")

    base_url = args.url.rstrip("/")
    filename = pdf_path.rsplit("/", 1)[-1]

    try:
        reader = PdfReader(pdf_path)
    except Exception as e:
        error(f"could not read PDF: {e}")
    pages = []
    for p in reader.pages:
        box = p.mediabox
        w_pt = float(box.width)
        h_pt = float(box.height)
        pages.append((w_pt * 25.4 / 72, h_pt * 25.4 / 72))

    if args.lang:
        lang = args.lang
        print(f"PDF: {filename}, {len(pages)} page(s), lang={lang} (forced)")
    else:
        lang = detect_language(reader, config)
        print(f"PDF: {filename}, {len(pages)} page(s), lang={lang} (detected)")

    fields_pct = FIELDS_IT if lang == "it" else FIELDS_EN
    for i, (w, h) in enumerate(pages):
        print(f"  Page {i+1}: {w:.1f} x {h:.1f} mm")

    if not args.skip_validation:
        validate_pdf(reader, pages, lang, config)

    # 1. Create envelope
    result = api(
        base_url, api_key,
        "post",
        "/envelope/create",
        files={"payload": (None, json.dumps({"title": filename, "type": "DOCUMENT"}))},
    )
    envelope_id = result["id"]
    print(f"Envelope created: {envelope_id}")

    # 2. Upload PDF
    with open(pdf_path, "rb") as f:
        result = api(
            base_url, api_key,
            "post",
            "/envelope/item/create-many",
            files=[
                ("payload", (None, json.dumps({"envelopeId": envelope_id}))),
                ("files", (filename, f, "application/pdf")),
            ],
        )
    envelope_item_id = result["data"][0]["id"]
    print(f"PDF uploaded: {envelope_item_id}")

    # 3. Add recipients
    recipients_data = [
        {"email": args.signer_email, "name": args.signer_name, "role": "SIGNER"},
    ]
    if args.cc_email:
        recipients_data.append({
            "email": args.cc_email,
            "name": args.cc_name or args.cc_email,
            "role": "CC",
        })

    result = api(
        base_url, api_key,
        "post",
        "/envelope/recipient/create-many",
        json={"envelopeId": envelope_id, "data": recipients_data},
    )
    signer_id = result["data"][0]["id"]
    print(f"Signer: {args.signer_name} <{args.signer_email}> (ID: {signer_id})")
    if args.cc_email:
        print(f"CC: {args.cc_name or args.cc_email} <{args.cc_email}>")

    # 4. Add signature fields
    fields = []
    for page_num, x_pct, y_pct, w_pct, h_pct in fields_pct:
        if page_num > len(pages):
            print(f"  Skipping field on page {page_num} (PDF has {len(pages)} pages)")
            continue
        print(f"  Field page {page_num}: ({x_pct:.1f}%, {y_pct:.1f}%) {w_pct:.1f}% x {h_pct:.1f}%")
        fields.append(
            {
                "type": "SIGNATURE",
                "recipientId": signer_id,
                "envelopeItemId": envelope_item_id,
                "page": page_num,
                "positionX": x_pct,
                "positionY": y_pct,
                "width": w_pct,
                "height": h_pct,
            }
        )

    api(
        base_url, api_key,
        "post",
        "/envelope/field/create-many",
        json={"envelopeId": envelope_id, "data": fields},
    )
    print(f"Signature fields placed: {len(fields)}")

    # 5. Distribute (only with --send + confirmation)
    if args.send:
        confirm = input(f"\nSend to {args.signer_email} now? [y/N] ").strip().lower()
        if confirm != "y":
            print("Aborted. Draft saved — review and send from the UI.")
            return
        api(
            base_url, api_key,
            "post",
            "/envelope/distribute",
            json={
                "envelopeId": envelope_id,
                "meta": {
                    "distributionMethod": "EMAIL",
                    "language": lang,
                    "dateFormat": "dd/MM/yyyy",
                    "timezone": "Europe/Rome",
                },
            },
        )
        print("Document sent for signing!")
    else:
        print(f"\nDraft ready. Review and send from the UI.")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nAborted.", file=sys.stderr)
        sys.exit(130)
    except EOFError:
        print("\nAborted (no interactive input available).", file=sys.stderr)
        sys.exit(1)
