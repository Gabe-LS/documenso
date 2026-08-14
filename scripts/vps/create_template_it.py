#!/usr/bin/env python3
"""
Create a Documenso template from the Scheda Cliente PDF.

Uploads the PDF, adds a signer placeholder, and places all fields
(text, date, checkboxes, signature) at the correct positions.

Usage:
    python3 create_template.py "Density - Scheda cliente 2026.pdf"

Requires:
    pip install requests
"""

import json
import sys
import requests

DOCUMENSO_URL = "http://127.0.0.1:3500"
API_KEY = ""  # Set before running, or pass via env

TEMPLATE_TITLE = "Scheda Cliente 2026"

# Coordinates extracted from PDF content stream (horizontal lines and checkbox rects).
# Origin: top-left, values in percentages of page dimensions (A4: 595.276 x 841.89 pt).
# Text fields sit just above the baseline, so y is offset upward by the field height.

# (label, type, page, x%, y%, w%, h%, fieldMeta)
# Positions from PDF content stream lines. Height 1.6% for text fields.
# Linear -0.3% correction from first to last field (first baseline ideal, last was too low).
# Checkbox size/position matched to user's manual reference placement.
TH = 1.6  # text field height
FS = 9    # font size for text/date fields

# Required: Data, Ragione sociale, Partita IVA, PEC, Codice SDI,
#           all Sede legale fields, Nome/Cognome/E-mail amm., payment method, IBAN.
R = True
O = False  # optional

# (label, type, page, x%, y%, w%, h%, fieldMeta)
FIELDS = [
    # --- Data ---
    ("Data", "DATE", 1, 23.56, 17.65, 24.06, TH, {"type": "date", "label": "Data", "fontSize": FS, "required": R}),

    # --- INFORMAZIONI GENERALI ---
    ("Ragione sociale", "TEXT", 1, 23.56, 23.02, 64.54, TH, {"type": "text", "label": "Ragione sociale", "fontSize": FS, "required": R}),
    ("Partita IVA", "TEXT", 1, 23.56, 25.28, 24.06, TH, {"type": "text", "label": "Partita IVA", "fontSize": FS, "required": R}),
    ("Codice fiscale", "TEXT", 1, 61.65, 25.27, 26.44, TH, {"type": "text", "label": "Codice fiscale", "fontSize": FS, "required": O}),
    ("PEC", "TEXT", 1, 23.56, 27.54, 33.54, TH, {"type": "text", "label": "PEC", "fontSize": FS, "required": O}),
    ("Codice SDI", "TEXT", 1, 78.07, 27.53, 10.03, TH, {"type": "text", "label": "Codice SDI", "fontSize": FS, "required": O}),

    # --- SEDE LEGALE (all required) ---
    ("Indirizzo (legale)", "TEXT", 1, 23.56, 32.90, 45.49, TH, {"type": "text", "label": "Indirizzo", "fontSize": FS, "required": R}),
    ("Civico (legale)", "TEXT", 1, 80.70, 32.89, 7.39, TH, {"type": "text", "label": "Civico", "fontSize": FS, "required": R}),
    ("CAP (legale)", "TEXT", 1, 23.56, 35.16, 24.06, TH, {"type": "text", "label": "CAP", "fontSize": FS, "required": R}),
    ("Città (legale)", "TEXT", 1, 61.65, 35.15, 26.44, TH, {"type": "text", "label": "Città", "fontSize": FS, "required": R}),
    ("Provincia (legale)", "TEXT", 1, 23.56, 37.41, 24.06, TH, {"type": "text", "label": "Provincia", "fontSize": FS, "required": R}),
    ("Telefono (legale)", "TEXT", 1, 61.65, 37.40, 26.44, TH, {"type": "text", "label": "Telefono", "fontSize": FS, "required": R}),
    ("E-mail (legale)", "TEXT", 1, 23.56, 39.66, 64.54, TH, {"type": "text", "label": "E-mail", "fontSize": FS, "required": R}),

    # --- SEDE OPERATIVA (all optional) ---
    ("Indirizzo (operativa)", "TEXT", 1, 23.56, 45.03, 45.49, TH, {"type": "text", "label": "Indirizzo", "fontSize": FS, "required": O}),
    ("Civico (operativa)", "TEXT", 1, 80.70, 45.03, 7.39, TH, {"type": "text", "label": "Civico", "fontSize": FS, "required": O}),
    ("CAP (operativa)", "TEXT", 1, 23.56, 47.29, 24.06, TH, {"type": "text", "label": "CAP", "fontSize": FS, "required": O}),
    ("Città (operativa)", "TEXT", 1, 61.65, 47.28, 26.44, TH, {"type": "text", "label": "Città", "fontSize": FS, "required": O}),
    ("Provincia (operativa)", "TEXT", 1, 23.56, 49.54, 24.06, TH, {"type": "text", "label": "Provincia", "fontSize": FS, "required": O}),
    ("Telefono (operativa)", "TEXT", 1, 61.65, 49.54, 26.44, TH, {"type": "text", "label": "Telefono", "fontSize": FS, "required": O}),
    ("E-mail (operativa)", "TEXT", 1, 23.56, 51.80, 64.54, TH, {"type": "text", "label": "E-mail", "fontSize": FS, "required": O}),

    # --- CONTATTO AMMINISTRATIVO ---
    ("Nome", "TEXT", 1, 23.56, 57.17, 24.06, TH, {"type": "text", "label": "Nome", "fontSize": FS, "required": R}),
    ("Cognome", "TEXT", 1, 61.65, 57.16, 26.44, TH, {"type": "text", "label": "Cognome", "fontSize": FS, "required": R}),
    ("Telefono (amm.)", "TEXT", 1, 23.56, 59.42, 64.54, TH, {"type": "text", "label": "Telefono", "fontSize": FS, "required": O}),
    ("E-mail (amm.)", "TEXT", 1, 23.56, 61.68, 64.54, TH, {"type": "text", "label": "E-mail", "fontSize": FS, "required": R}),

    # --- MODALITÀ DI PAGAMENTO (single checkbox, 4 values, 2 columns, select exactly 1) ---
    ("Modalità di pagamento", "CHECKBOX", 1, 10.255, 66.133, 77.5, 6.042, {
        "type": "checkbox",
        "label": "",
        "fontSize": 10,
        "required": R,
        "columns": 2,
        "validationRule": "Select exactly",
        "validationLength": 1,
        "values": [
            {"id": 0, "checked": False, "value": ""},
            {"id": 1, "checked": False, "value": ""},
            {"id": 2, "checked": False, "value": ""},
            {"id": 3, "checked": False, "value": ""},
        ],
    }),

    # --- COORDINATE BANCARIE ---
    ("Banca", "TEXT", 1, 23.56, 74.69, 24.06, TH, {"type": "text", "label": "Banca", "fontSize": 8, "required": O}),
    ("Filiale", "TEXT", 1, 61.65, 74.69, 26.44, TH, {"type": "text", "label": "Filiale", "fontSize": 8, "required": O}),
    ("IBAN", "TEXT", 1, 23.56, 76.95, 24.06, TH, {"type": "text", "label": "IBAN", "fontSize": 8, "required": R}),
    ("C/C", "TEXT", 1, 61.65, 76.94, 26.44, TH, {"type": "text", "label": "C/C", "fontSize": 8, "required": O}),
    ("ABI", "TEXT", 1, 23.56, 79.20, 24.06, TH, {"type": "text", "label": "ABI", "fontSize": 8, "required": O}),
    ("CAB", "TEXT", 1, 61.65, 79.19, 26.44, TH, {"type": "text", "label": "CAB", "fontSize": 8, "required": O}),
    ("CIN", "TEXT", 1, 23.56, 81.46, 24.06, TH, {"type": "text", "label": "CIN", "fontSize": 8, "required": O}),
    ("BIC/SWIFT", "TEXT", 1, 61.65, 81.45, 26.44, TH, {"type": "text", "label": "BIC/SWIFT", "fontSize": 8, "required": O}),

    # --- TIMBRO E FIRMA ---
    ("Timbro e firma", "SIGNATURE", 1, 23.56, 85.81, 64.54, 4.0, {"type": "signature", "label": "Timbro e firma", "fontSize": 22, "required": R}),
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
        print("Usage: python3 create_template.py <file.pdf>")
        sys.exit(1)

    if not API_KEY:
        print("Set API_KEY in the script first.")
        sys.exit(1)

    pdf_path = sys.argv[1]
    filename = pdf_path.rsplit("/", 1)[-1]

    # 1. Create template
    with open(pdf_path, "rb") as f:
        result = api(
            "post",
            "/template/create",
            files=[
                ("payload", (None, json.dumps({
                    "title": TEMPLATE_TITLE,
                    "type": "PRIVATE",
                    "meta": {
                        "language": "it",
                        "dateFormat": "dd/MM/yyyy",
                        "timezone": "Europe/Rome",
                        "distributionMethod": "EMAIL",
                    },
                }))),
                ("file", (filename, f, "application/pdf")),
            ],
        )
    template_id = result["id"]
    print(f"Template created: {template_id}")

    # 2. Add signer recipient (placeholder)
    result = api(
        "post",
        "/template/recipient/create",
        json={
            "templateId": template_id,
            "recipient": {
                "email": "cliente@example.com",
                "name": "Cliente",
                "role": "SIGNER",
            },
        },
    )
    recipient_id = result["id"]
    print(f"Recipient added: {recipient_id}")

    # 3. Place all fields
    field_payloads = []
    for label, field_type, page, x, y, w, h, meta in FIELDS:
        field_payloads.append({
            "type": field_type,
            "recipientId": recipient_id,
            "pageNumber": page,
            "pageX": x,
            "pageY": y,
            "width": w,
            "height": h,
            "fieldMeta": meta,
        })

    api(
        "post",
        "/template/field/create-many",
        json={
            "templateId": template_id,
            "fields": field_payloads,
        },
    )
    print(f"Fields placed: {len(field_payloads)}")

    # 4. Get envelope ID for the URL and upgrade to v2 editor
    result = api("get", f"/template/{template_id}")
    envelope_id = result["envelopeId"]
    print(f"Envelope: {envelope_id}")
    print(f"\nTemplate ready! Edit at: {DOCUMENSO_URL}/t/density/templates/{envelope_id}")


if __name__ == "__main__":
    main()
