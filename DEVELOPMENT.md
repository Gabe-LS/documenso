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

- **CC notification**: CC recipients get a send-time "Inviato alla firma"
  notice via `packages/email/templates/document-cc-notification.tsx`, with
  branching in `send-signing-email.handler.ts` and fan-out in
  `send-document.ts`.
- **No fabricated invite copy**: Invite emails no longer fabricate default
  secondary messages.

## Deployment

Production images are built by GitHub Actions (`.github/workflows/build.yml`)
on push to `main`. The image lands at `ghcr.io/gabe-ls/documenso:latest`.

**Never build production images locally** (this Mac is arm64, production is
amd64).

### Deploy flow

1. Push to `main` and wait for the Actions build:

```bash
gh run watch --repo Gabe-LS/documenso --exit-status
```

2. Pull and restart on the VPS:

```bash
ssh root@209.38.244.136 "cd /root/services/documenso && docker compose pull app && docker compose up -d"
```

3. Verify health:

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
