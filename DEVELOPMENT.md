# Documenso fork — local development

This fork (github.com/Gabe-LS/documenso) powers **sign.densitymedia.com**.

All commands below assume Node 22 (`/opt/homebrew/opt/node@22/bin` must be on
`PATH` — Node 26 ships with macOS Homebrew but sharp has no prebuilt binaries
for it yet).

## Quick start

```bash
# Node 22 (not 26 — sharp has no prebuilt binaries for it yet)
export PATH="/opt/homebrew/opt/node@22/bin:$PATH"

# npm 12 blocks install scripts by default; approve them first
npm install --ignore-scripts
npm install-scripts approve --all
npm ci

# If sharp still fails to build, use --force to skip it (not needed for
# email work):
# npm install --force

# Generate Prisma types (needed by the email preview's SSR pipeline)
npx prisma generate --schema packages/prisma/schema.prisma

# Compile translations
npm run translate:compile
```

## Email preview

A standalone React Router app renders every email template with hot reload:

```bash
cd packages/email
npm run dev          # → http://localhost:3002
```

Navigate to `http://localhost:3002/<template-slug>` (e.g.
`/document-cc-notification`) to preview individual templates.

## Typechecking

There is no per-package `typecheck` script. Run `tsc` directly against each
package's tsconfig:

```bash
npx tsc --noEmit -p packages/email/tsconfig.json
npx tsc --noEmit -p packages/lib/tsconfig.json
```

Prisma types must be generated first (`npx prisma generate --schema
packages/prisma/schema.prisma`), otherwise imports from
`@documenso/prisma/generated/types` will fail.

Note: `packages/lib` may show errors in `server-only/` code related to
Prisma schema differences — these don't affect email work.
`packages/email` should always typecheck clean.

For the full monorepo build (slower, includes Prisma generation):

```bash
npm run build
```

## Translations (lingui)

The single catalog lives at `packages/lib/translations/{locale}/web.po`.

```bash
npm run translate:extract   # extract msgids from source
npm run translate:compile   # compile .po → .ts for runtime
npm run translate            # both in sequence
```

### The msgid rule

Lingui uses the **English source text** inside `<Trans>` / `` msg`…` `` as the
msgid. Changing even a single character in the English copy changes the msgid,
and every `.po` file silently falls back to English for that string unless you
update the `msgid` line in all locales. Always run `npm run translate:extract`
after editing any English text wrapped in `<Trans>` or `` msg`…` ``.

### Italian catalog rules (`it/web.po`)

- Informal "tu" (never "Lei" or "voi").
- Infinitive action verbs on buttons/CTAs.
- Never em dashes; use straight apostrophes.
- "email" is feminine ("un'email", "l'email").
- Never "Si prega di" — rephrase with direct instructions.
- Avoid gendered past participles agreeing with the recipient.

## Email design system

All shared styling lives in **one file**:
`packages/email/template-components/email-primitives.tsx`. Read its doc
comments before touching any email template — they document the full design
system. Never style ad hoc in a template; extend the primitives.

### Two-color text palette (non-negotiable)

| Role | Token | Hex | Used for |
|------|-------|-----|----------|
| Ink | `text-foreground` | `#0f172a` | Headings, body copy, CTA button labels, list items — the content the email exists to deliver |
| Muted | `text-muted-foreground` | `#475569` | Callouts, pills, fine print, footer, secondary/negative button labels — chrome around the content |

`text-primary-foreground` is only for the label inside a solid-bg primary
button. There is no `text-destructive`, `text-warning`, or link color — status
is conveyed by imagery and wording only.

The muted color is an email-scoped override applied in
`packages/email/render.tsx` (`EMAIL_MUTED_FOREGROUND_OVERRIDE`), not the shared
shadcn token.

### Link rule

Links always take the surrounding text's color + `underline`. They are NEVER a
separate color event. The underline alone marks the link.

### Email subjects

Subjects use `trimEmailTitle()` from `packages/lib/utils/email-subject.ts`:
role-based phrasing with the document title, 128-char cap, `.pdf`/`.docx`/`.doc`
extensions stripped.

## Fork-specific behavior

These deviate from upstream — take care during rebases:

- **CC notifications**: CC recipients receive all document lifecycle emails
  (sent for signing, cancelled, deleted, completed). The fix bypasses
  upstream's `sendStatus === SENT` skip in `send-document.ts` (CC recipients
  are created with `SENT` by default) and removes the CC exclusion from
  `send-document-cancelled-emails.handler.ts` and `delete-document.ts`.
  The CC template uses the team name (not personal name) when sent from an
  organisation (`send-signing-email.handler.ts`).
- **No fabricated copy**: Invite emails no longer fabricate default secondary
  messages. Cancellation emails don't fabricate a default reason.
- **Removed elements**: No `EmailIconLabel` (completed/pending/signed status
  badges), no redundant body text in several templates, no `EmailPill` in
  direct-template emails.
- **Custom document icon**: `packages/email/static/document.png` and
  `apps/remix/public/static/document.png` (both must be updated together —
  the Remix copy is what production serves). Cache-busted with `?v=2` in
  `template-document-image.tsx`.
- **Static asset duplication**: Email static assets exist in two places:
  `packages/email/static/` (preview app) and `apps/remix/public/static/`
  (production). Both must stay in sync.

## Deployment

Production images live at `ghcr.io/gabe-ls/documenso:latest`, built by
GitHub Actions on every push to `main` (`.github/workflows/build.yml`).

Code-change builds take ~6-9 min including the push; runs where the image
layers are fully cached finish in ~1 min. Benchmarked 2026-07-24: a local
`docker buildx` amd64 build on this arm64 Mac took the same ~6.5 min with a
warm cache *before* the push, so there is no local build path — GHA is
always at least as fast and keeps the laptop free.

Watch the build:

```bash
gh run watch --repo Gabe-LS/documenso --exit-status
```

### Deploy to VPS

After the workflow pushes the image:

```bash
ssh root@209.38.244.136 "cd /root/services/documenso && docker compose pull app && docker compose up -d"
```

Verify health:

```bash
ssh root@209.38.244.136 "docker exec documenso wget -qO- http://localhost:3000/api/health"
```

### Test send

Fires real emails (signer: gabrielelosurdo@gmail.com, CC:
gabrielelosurdo@yahoo.com):

```bash
ssh root@209.38.244.136 "cd /root/services/documenso && python3 send_document.py test_contract.pdf"
```

### VPS rules

- Only ever touch `/root/services/documenso/` on the VPS.
- Never run builds, `npm`, or anything heavy on the VPS (4 GB RAM, ~27
  containers).
- Never run `docker compose down -v` or delete `postgres-data/`.
- Nightly `pg_dump` backups run at 03:38.

### Upstream updates

Run `./UPDATE.sh` at the repo root. It rebases onto `upstream/main` and
force-pushes with lease. Expect conflicts in `packages/email` and
`it/web.po`. New upstream versions run DB migrations on first boot — confirm
that morning's backup exists first.

## Weekly agreements report

An n8n workflow generates a PDF report of Documenso agreements every Monday
and Thursday at 08:00 and delivers it via Slack (#commerciale) and email.

- **Workflow source**: `~/Documents/Developer/n8n Workflows/Documenso Report/`
- **n8n workflow ID**: `documenso-report-001`
- **PDF engine**: WeasyPrint microservice (`http://weasyprint:9100` on the
  Docker `apps` network)

### What it reports

PENDING ("Out for signature" or "Expired"), REJECTED, and recent COMPLETED
(green, for context). Excludes DRAFT and CANCELLED. Max 18 rows (one page).

### When it skips

- Zero actionable (PENDING + REJECTED) agreements
- All actionable agreements older than 45 days

### Trigger manually

```bash
ssh root@209.38.244.136 "docker exec -u node -e N8N_RUNNERS_BROKER_PORT=5681 n8n n8n execute --id=documenso-report-001"
```

### VPS scripts

- `agreements_report.py` — standalone report generator (API-based, WeasyPrint)
- `send_document.py` — test document sender
- `create_fake_agreements.py` — creates test agreements (uses only the 3
  approved test addresses)
