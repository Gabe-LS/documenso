#!/usr/bin/env python3
"""
Send a PDF for signing via Documenso API.

Uploads the PDF, places signature fields at fixed positions,
adds a signer and CC recipients, and distributes for signing.

Usage:
    python3 send_document.py document.pdf

Requires:
    pip install requests pypdf
"""

import json
import sys
import requests
from pypdf import PdfReader

DOCUMENSO_URL = "http://127.0.0.1:3500"
API_KEY = ""  # Set on VPS before running

SIGNER_EMAIL = "gabrielelosurdo@gmail.com"
SIGNER_NAME = "Gabriele Lo Surdo"
CC_EMAIL = "gabrielelosurdo@yahoo.com"
CC_NAME = "Gabriele Lo Surdo"

# Signature field positions as percentages (from top-left origin).
# Each entry: (page_number, x_pct, y_pct, w_pct, h_pct)
SIGNATURE_FIELDS_PCT = [
    (1, 8.6774, 89.7862, 35.6294, 2.8838),
    (2, 52.7956, 48.6631, 35.6294, 2.8838),
]


def api(method, path, **kwargs):
    url = f"{DOCUMENSO_URL}/api/v2{path}"
    headers = {"Authorization": API_KEY}
    resp = getattr(requests, method)(url, headers=headers, **kwargs)
    if not resp.ok:
        print(f"API error {resp.status_code} on {path}:")
        print(resp.text[:500])
        sys.exit(1)
    return resp.json()


def main():
    if len(sys.argv) < 2:
        print("Usage: python3 send_document.py <file.pdf>")
        sys.exit(1)

    pdf_path = sys.argv[1]
    filename = pdf_path.rsplit("/", 1)[-1]

    reader = PdfReader(pdf_path)
    pages = []
    for p in reader.pages:
        box = p.mediabox
        w_pt = float(box.width)
        h_pt = float(box.height)
        pages.append((w_pt * 25.4 / 72, h_pt * 25.4 / 72))

    print(f"PDF: {filename}, {len(pages)} page(s)")
    for i, (w, h) in enumerate(pages):
        print(f"  Page {i+1}: {w:.1f} x {h:.1f} mm")

    # 1. Create envelope
    result = api(
        "post",
        "/envelope/create",
        files={"payload": (None, json.dumps({"title": filename, "type": "DOCUMENT"}))},
    )
    envelope_id = result["id"]
    print(f"Envelope created: {envelope_id}")

    # 2. Upload PDF
    with open(pdf_path, "rb") as f:
        result = api(
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
    result = api(
        "post",
        "/envelope/recipient/create-many",
        json={
            "envelopeId": envelope_id,
            "data": [
                {"email": SIGNER_EMAIL, "name": SIGNER_NAME, "role": "SIGNER"},
                {"email": CC_EMAIL, "name": CC_NAME, "role": "CC"},
            ],
        },
    )
    signer_id = result["data"][0]["id"]
    print(f"Recipients added (signer ID: {signer_id})")

    # 4. Add signature fields
    fields = []
    for page_num, x_pct, y_pct, w_pct, h_pct in SIGNATURE_FIELDS_PCT:
        if page_num > len(pages):
            print(f"  Skipping field on page {page_num} (PDF has {len(pages)} pages)")
            continue
        print(f"  Page {page_num}: ({x_pct:.1f}%, {y_pct:.1f}%) {w_pct:.1f}% x {h_pct:.1f}%")
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
        "post",
        "/envelope/field/create-many",
        json={"envelopeId": envelope_id, "data": fields},
    )
    print(f"Signature fields placed: {len(fields)}")

    # 5. Distribute
    api(
        "post",
        "/envelope/distribute",
        json={
            "envelopeId": envelope_id,
            "meta": {
                "distributionMethod": "EMAIL",
                "language": "it",
                "dateFormat": "dd/MM/yyyy",
                "timezone": "Europe/Rome",
            },
        },
    )
    print("Document sent for signing!")


if __name__ == "__main__":
    main()
