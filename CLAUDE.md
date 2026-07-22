# Documenso fork — project rules

Read `DEVELOPMENT.md` at the repo root for setup, commands, and deploy flow.

## Email system (non-negotiable)

1. All email styling lives in `packages/email/template-components/email-primitives.tsx`.
   Read its doc comments first — they ARE the design system. Never style ad hoc
   in a template; extend the primitives.

2. Two text colors only: ink `#0f172a` (`text-foreground`) and muted `#475569`
   (`text-muted-foreground`). No destructive/warning/link colors. Links take
   surrounding text color + `underline`.

3. Changing English text inside `<Trans>` / `` msg`…` `` changes the lingui
   msgid — translations silently fall back to English unless the msgid is
   updated in `packages/lib/translations/*/web.po`. Always run
   `npm run translate:extract` after editing English copy.

4. Italian catalog (`it/web.po`): informal "tu", infinitive action verbs,
   never em dashes, straight apostrophes, "email" is feminine, no "Si prega
   di", avoid gendered recipient-agreeing participles.

5. Static assets exist in TWO places — `packages/email/static/` (preview app)
   and `apps/remix/public/static/` (production). Both must stay in sync.
   When replacing an image, update both and bump the cache-buster query
   string in the template (e.g. `?v=2` → `?v=3`).

## CC recipients

CC recipients receive all document lifecycle emails: sent for signing,
cancelled, deleted, completed. Key fork changes:
- `send-document.ts`: CC recipients bypass the `sendStatus === SENT` skip
- `send-signing-email.handler.ts`: CC branch uses team name (not personal
  name) when sent from an organisation
- `send-document-cancelled-emails.handler.ts`: no CC exclusion filter
- `delete-document.ts`: no CC exclusion filter

## Deployment

Two build options (see `DEVELOPMENT.md` for details):
- **Local buildx** (preferred): `docker buildx build --platform linux/amd64 -t ghcr.io/gabe-ls/documenso:latest --push -f docker/Dockerfile .`
  Requires Docker Desktop with 16+ GB RAM and `docker login ghcr.io`.
- **GitHub Actions**: automatic on push to `main`, ~7 min.

Deploy: `ssh root@209.38.244.136 "cd /root/services/documenso && docker compose pull app && docker compose up -d"`

VPS rules:
- Only touch `/root/services/documenso/`
- Never build, run npm, or anything heavy (4 GB RAM, ~27 containers)
- Never `docker compose down -v` or delete `postgres-data/`
- Nightly pg_dump at 03:38

## Node version

Use Node 22 (`/opt/homebrew/opt/node@22/bin`), not Node 26 — sharp has no
prebuilt binaries for v26.

## Git

Conventional commits required (commitlint enforced by husky). Subject must
be lowercase after the type prefix.
