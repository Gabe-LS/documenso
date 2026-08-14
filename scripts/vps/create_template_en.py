#!/usr/bin/env python3
"""
Create a Documenso template from the Customer Data Sheet PDF (English).

Usage:
    python3 create_template_en.py customer_data_sheet_2026.pdf

Requires:
    pip install requests
"""

import json
import sys
import requests

DOCUMENSO_URL = "http://127.0.0.1:3500"
API_KEY = ""

TEMPLATE_TITLE = "Customer Data Sheet 2026"

TH = 1.6  # text field height
FS = 9    # font size for text/date fields

R = True
O = False

# Positions from PDF content stream. Same base coordinates as Italian version.
# Applied: -0.06% Y shift (half-pixel up), +0.25% left-column width expansion.
# Right-column fields widened by +0.25%.
FIELDS = [
    # --- Date ---
    ("Date", "DATE", 1, 23.56, 17.65, 24.06, TH, {"type": "date", "label": "Date", "fontSize": FS, "required": R}),

    # --- GENERAL INFORMATION ---
    ("Company name", "TEXT", 1, 23.56, 23.02, 64.54, TH, {"type": "text", "label": "Company name", "fontSize": FS, "required": R}),
    ("VAT ID", "TEXT", 1, 23.56, 25.28, 24.06, TH, {"type": "text", "label": "VAT ID", "fontSize": FS, "required": O}),
    ("Tax number", "TEXT", 1, 61.65, 25.27, 26.44, TH, {"type": "text", "label": "Tax number", "fontSize": FS, "required": O}),
    ("E-mail (general)", "TEXT", 1, 23.56, 27.54, 64.54, TH, {"type": "text", "label": "E-mail", "fontSize": FS, "required": R}),

    # --- REGISTERED OFFICE (all required) ---
    ("Street (registered)", "TEXT", 1, 23.56, 32.90, 45.49, TH, {"type": "text", "label": "Street", "fontSize": FS, "required": R}),
    ("Number (registered)", "TEXT", 1, 80.70, 32.89, 7.39, TH, {"type": "text", "label": "Number", "fontSize": FS, "required": R}),
    ("Postcode (registered)", "TEXT", 1, 23.56, 35.16, 24.06, TH, {"type": "text", "label": "Postcode", "fontSize": FS, "required": R}),
    ("Town/City (registered)", "TEXT", 1, 61.65, 35.15, 26.44, TH, {"type": "text", "label": "Town/City", "fontSize": FS, "required": R}),
    ("Country (registered)", "TEXT", 1, 23.56, 37.41, 24.06, TH, {"type": "text", "label": "Country", "fontSize": FS, "required": R}),
    ("Telephone (registered)", "TEXT", 1, 61.65, 37.40, 26.44, TH, {"type": "text", "label": "Telephone", "fontSize": FS, "required": R}),
    ("E-mail (registered)", "TEXT", 1, 23.56, 39.66, 64.54, TH, {"type": "text", "label": "E-mail", "fontSize": FS, "required": R}),

    # --- PLACE OF BUSINESS (all optional) ---
    ("Street (business)", "TEXT", 1, 23.56, 45.03, 45.49, TH, {"type": "text", "label": "Street", "fontSize": FS, "required": O}),
    ("Number (business)", "TEXT", 1, 80.70, 45.03, 7.39, TH, {"type": "text", "label": "Number", "fontSize": FS, "required": O}),
    ("Postcode (business)", "TEXT", 1, 23.56, 47.29, 24.06, TH, {"type": "text", "label": "Postcode", "fontSize": FS, "required": O}),
    ("Town/City (business)", "TEXT", 1, 61.65, 47.28, 26.44, TH, {"type": "text", "label": "Town/City", "fontSize": FS, "required": O}),
    ("Country (business)", "TEXT", 1, 23.56, 49.54, 24.06, TH, {"type": "text", "label": "Country", "fontSize": FS, "required": O}),
    ("Telephone (business)", "TEXT", 1, 61.65, 49.54, 26.44, TH, {"type": "text", "label": "Telephone", "fontSize": FS, "required": O}),
    ("E-mail (business)", "TEXT", 1, 23.56, 51.80, 64.54, TH, {"type": "text", "label": "E-mail", "fontSize": FS, "required": O}),

    # --- ADMINISTRATIVE CONTACT ---
    ("Name", "TEXT", 1, 23.56, 57.17, 24.06, TH, {"type": "text", "label": "Name", "fontSize": FS, "required": R}),
    ("Family name", "TEXT", 1, 61.65, 57.16, 26.44, TH, {"type": "text", "label": "Family name", "fontSize": FS, "required": R}),
    ("Telephone (admin)", "TEXT", 1, 23.56, 59.42, 64.54, TH, {"type": "text", "label": "Telephone", "fontSize": FS, "required": O}),
    ("E-mail (admin)", "TEXT", 1, 23.56, 61.68, 64.54, TH, {"type": "text", "label": "E-mail", "fontSize": FS, "required": R}),

    # --- PAYMENT TERMS (single checkbox, position from user edit) ---
    ("Payment terms", "CHECKBOX", 1, 10.380, 66.133, 21.750, 3.657, {
        "type": "checkbox",
        "label": "",
        "fontSize": 10,
        "required": R,
        "validationRule": "Select exactly",
        "validationLength": 1,
        "values": [
            {"id": 0, "checked": False, "value": ""},
        ],
    }),

    # --- STAMP AND SIGNATURE ---
    ("Stamp and signature", "SIGNATURE", 1, 28.57, 71.44, 59.52, 4.0, {"type": "signature", "label": "Stamp and signature", "fontSize": 22, "required": R}),

    # --- ADDITIONAL INFORMATION ---
    ("Additional information", "TEXT", 1, 11.95, 81.53, 76.15, 10.47, {"type": "text", "label": "Additional information", "fontSize": FS, "required": O}),
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
        print("Usage: python3 create_template_en.py <file.pdf>")
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
                        "language": "en",
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
                "email": "customer@example.com",
                "name": "Customer",
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

    # 4. Get envelope ID
    result = api("get", f"/template/{template_id}")
    envelope_id = result["envelopeId"]
    print(f"Envelope: {envelope_id}")
    print(f"\nTemplate ready! Edit at: {DOCUMENSO_URL}/t/density/templates/{envelope_id}")


if __name__ == "__main__":
    main()
