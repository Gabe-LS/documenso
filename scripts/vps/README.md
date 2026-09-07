# upload-contract.py

Upload an advertising contract PDF to Documenso as a draft (or send it
immediately), with signature fields and recipients pre-configured.

## Prerequisites

- Python 3.11+ (for `tomllib`)
- macOS (for Keychain access)
- Install dependencies:

```bash
pip install requests pypdf
```

## One-time setup

### 1. Store the API key in Keychain

The script reads the Documenso API key from the macOS Keychain, so it
never appears in commands, scripts, or shell history.

```bash
security add-generic-password -s documenso-api-key -a gabrielelosurdo -w
```

You will be prompted to enter the key. To update it later:

```bash
security delete-generic-password -s documenso-api-key -a gabrielelosurdo
security add-generic-password -s documenso-api-key -a gabrielelosurdo -w
```

### 2. Create the config file

Copy the example below into `upload-contract.toml` (same directory as the
script). This file is gitignored.

```toml
# Documenso instance URL.
url = "https://sign.example.com"

# CC recipient added to every contract.
[cc]
email = "cc@example.com"
name = "CC Person"

# Auto-detect contract language from PDF text on the first page.
# Each key is a language code; its value is a list of strings to search
# for (case-insensitive, first match wins). If nothing matches, the
# default language is used.
[language]
default = "it"

[language.detect]
it = ["CONTRATTO PUBBLICITARIO"]
en = ["ADVERTISING CONTRACT"]

# Validation rules applied before upload.
# The script aborts if any check fails. Use --skip-validation to bypass.
[validation]
pages = 2                            # Expected page count
page_width_mm = 210.0                # Expected A4 width (tolerance: 1 mm)
page_height_mm = 297.0               # Expected A4 height (tolerance: 1 mm)
required_text = ["Italia Publishers"] # Text that must appear on page 1

# Signature box labels per language. The count of occurrences in the full
# PDF text must match the number of signature fields for that language.
[validation.signature_labels]
it = "TIMBRO E FIRMA"
en = "STAMP AND SIGNATURE"
```

## Usage

### Basic (interactive prompts for signer)

```bash
python3 upload-contract.py document.pdf
```

The script will prompt for the signer's email and name, auto-detect the
language from the PDF content, and create a draft in Documenso.

### Fully non-interactive

```bash
python3 upload-contract.py document.pdf \
    --signer-email john@acme.com \
    --signer-name "John Smith"
```

### Force a specific language

Language is auto-detected by default. Use `--it` or `--en` to override:

```bash
python3 upload-contract.py document.pdf --it
python3 upload-contract.py document.pdf --en
```

- **Italian layout**: 2 signature fields
- **English layout**: 3 signature fields

### Send after upload

```bash
python3 upload-contract.py document.pdf \
    --signer-email john@acme.com \
    --signer-name "John Smith" \
    --send
```

The script will ask for confirmation before sending:

```
Send to john@acme.com now? [y/N]
```

If declined, the document is kept as a draft.

### Override CC recipient

The CC recipient defaults to the values in `upload-contract.toml`. To
override for a single run:

```bash
python3 upload-contract.py document.pdf \
    --cc-email other@example.com \
    --cc-name "Other Person"
```

### Override Documenso URL

```bash
python3 upload-contract.py document.pdf --url https://other-instance.com
```

### Skip PDF validation

```bash
python3 upload-contract.py document.pdf --skip-validation
```

## PDF validation

Before uploading, the script validates the PDF against rules defined in
`upload-contract.toml`. All checks must pass or the script aborts with a
clear error. Use `--skip-validation` to bypass.

| Check              | What it verifies                                          |
|--------------------|-----------------------------------------------------------|
| Page count         | PDF has exactly the expected number of pages (default: 2) |
| Page size          | All pages are A4 (210 x 297 mm, 1 mm tolerance)          |
| Required text      | Page 1 contains expected text (e.g. "Italia Publishers")  |
| Signature labels   | The number of signature area labels in the PDF matches the number of fields for the detected language (IT: 2x "TIMBRO E FIRMA", EN: 3x "STAMP AND SIGNATURE") |

Example error for a wrong PDF:

```
Error: PDF validation failed:
  expected 2 pages, got 1
  page 1 is 215.9 x 279.4 mm, expected 210 x 297 mm
  missing required text on page 1: "Italia Publishers"
  found 0 "TIMBRO E FIRMA" labels, expected 2 signature areas
Use --skip-validation to bypass.
```

## All options

| Option              | Description                          | Default             |
|---------------------|--------------------------------------|---------------------|
| `pdf` (positional)  | Path to the PDF file                 | required            |
| `--url`             | Documenso instance URL               | from config         |
| `--en`              | Force English layout (3 sig. fields) | auto-detected       |
| `--it`              | Force Italian layout (2 sig. fields) | auto-detected       |
| `--send`            | Send after confirmation prompt        | draft only          |
| `--skip-validation` | Skip PDF validation checks           | validation on       |
| `--signer-email`    | Signer email address                 | prompted if omitted |
| `--signer-name`     | Signer display name                  | prompted if omitted |
| `--cc-email`        | CC recipient email                   | from config         |
| `--cc-name`         | CC recipient name                    | from config         |

## What the script does

1. Reads the PDF and detects the language (Italian or English)
2. Validates the PDF against the configured rules
3. Creates a new envelope (draft) in Documenso via the API
4. Uploads the PDF as the document to sign
5. Adds the signer and (optionally) a CC recipient
6. Places signature fields at preset positions based on the language layout
7. If `--send` is passed, distributes the document for signing via email
