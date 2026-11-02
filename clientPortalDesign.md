# Moments by Temima — Client Portal Design Document

> **Status:** Draft / scoping. Nothing here is built yet. Temima's requirements
> are in (2026-11-02); remaining **Open questions** are at the bottom.
> Decisions marked **(proposed)** await sign-off.

## Overview

Temima needs a simple, private way to deliver finished photos to her clients:
she adds a shoot's photos, sends the client a link, and the client views and
downloads them. Each client must only ever see their own photos. That is the
whole job: a **file-delivery portal**, not a client-management system.

This is the first part of the site with a backend and private data, so it
deliberately revises the "no backend / no accounts" non-goals in
[`designDoc.md`](./designDoc.md). The public marketing site stays static; the
portal is a small surface added beside it.

## Requirements (from Temima, 2026-11-02)

In her words: *"a portal where I can share files with my clients and they can
view them and download them. And where potential clients can leave a message.
Nothing more than that is necessary."*

| Topic | Answer |
|---|---|
| Purpose | Clients view and download their photos. Temima needs a way to add the files. |
| Access | Anyone with the link may view, as long as nobody can see other clients' photos. |
| Sender | Links are sent from `momentsbytemima@gmail.com`. |
| Volume | ~50 photos per shoot; shoots per month vary. |
| Retention | Depends on cost (see [Costs](#costs)). |
| Messages | Potential clients can leave a message. **Already exists:** the Contact section's form (FormSubmit). See open question 2. |
| Timing | Temima asked whether a portal is worth it while she's still building the business. See [Build now or wait](#build-now-or-wait). |

## Goals

- Temima creates a delivery for a client, uploads the photos, and gets a link to
  send, in a few minutes, from her computer.
- The client opens the link and views and downloads the photos, one at a time or
  all at once, on desktop and phone, with no account or password.
- No one can see a client's photos without that delivery's link; links can't be
  guessed, and nothing can be listed or browsed.
- Temima can add or remove photos and delete or disable a delivery at any time.
- Cheap and low-maintenance: no image-processing server, and large files never
  pass through our server.

## Non-goals (v1)

- Client accounts, passwords, PINs, or a client dashboard across shoots.
- Proofing (favorites, selections, comments), watermarks, print sales, payments.
- Automated email sending from our server (Temima sends from her own Gmail).
- Video. Uploading from a phone. Multiple admin users.
- Changes to the contact form beyond confirming where it delivers.

## Workflows

### Temima (admin)

1. Signs in at the portal admin page.
2. **New delivery** → enters the client's name and email and a title
   (e.g. "Cohen Family — Oct 2026"). That is all "registering a client" means.
3. Drags in her exported photos; sees per-file progress and retries failures.
4. Previews the gallery exactly as the client will see it.
5. Clicks **Email to client**: opens a Gmail draft in `momentsbytemima@gmail.com`
   pre-filled with the client's address, a short message and the link. She
   reviews it and presses Send. (**Copy link** is also available.)
6. Later: add or remove photos, **Disable** the link, or **Delete** the
   delivery (removes the photos from storage).

### Client

1. Gets Temima's email and clicks the link.
2. Sees a gallery styled like the main site; opens any photo full-size.
3. Downloads one photo or **Download all**.
4. Can come back to the same link and forward it to family.

## Key decisions

### Access: one private link per delivery (decided)

Each delivery has one long random link. Anyone with it can view that delivery
only. This matches Temima's answer and how photo-delivery services work. Links
are effectively unguessable (128-bit secrets), can be disabled at any time, and
reveal nothing about other deliveries. No client accounts or PINs.

### Sending: Temima sends from her own Gmail (proposed)

Rather than our server sending email *as* `momentsbytemima@gmail.com` (which
would mean storing a Gmail app password on our server and dealing with spam
filtering), the portal opens a pre-filled Gmail draft and Temima presses Send.
The email genuinely comes from her account, lands in the client's inbox like
any personal email, appears in her Sent folder, and replies come straight back
to her. No SMTP setup, no credentials of hers on our server.

### Storage: Cloudflare R2, on Temima's own account

Private bucket on Cloudflare R2 rather than DigitalOcean Spaces. Temima owns the
Cloudflare account and pays for it directly; we get member access to set it up
and run it (see the [setup checklist](#setup-checklist-phase-1)). At Temima's
volume R2 is cheaper (first 10 GB free, then $0.015/GB-month) and has **no
download fees**, so costs don't rise when clients download full-resolution
photos. Spaces would also work but has a $5/month minimum. Either is
S3-compatible, so switching later is a config change.

## Costs

**Assumptions:** ~50 photos per shoot at 10–20 MB each (full-resolution JPEG)
plus small preview copies ≈ **0.5–1 GB per shoot**. Shoots per month vary, so
the range below covers 2–8 shoots/month.

| Kept for | Light (2 shoots/mo) | Busy (8 shoots/mo) |
|---|---|---|
| Storage after 1 year | ~12 GB | ~100 GB |
| **R2 cost**, year 1 | ~$0.03/mo by year end | ~$1.30/mo by year end |
| **R2 cost**, year 3 (keep everything) | ~$0.40/mo | ~$4.20/mo |
| DigitalOcean Spaces (for comparison) | $5/mo flat | $5/mo, then +$0.02/GB past 250 GB (~year 3) |

- Downloads: free on R2; on Spaces 1 TB/month is included (far more than needed).
- Hosting: runs on the existing DSS server, **no added cost**.
- Email: sent from Temima's Gmail, **no cost**.

**Conclusion:** storage is a few dollars a month at most, even keeping every
shoot for years. Temima doesn't need to delete photos to control cost; a
retention period is only worth adding as a privacy or tidiness choice. The real
cost of the portal is building and maintaining it, not running it.

## Build now or wait

Since running costs are negligible, the decision is about build effort and how
much a branded portal helps the business right now. Options:

| Option | Cost to Temima | Experience | Effort |
|---|---|---|---|
| **Google Drive** shared folders from `momentsbytemima@gmail.com` | Free up to 15 GB (shared with her Gmail, ~15–30 shoots); 100 GB is ~$2/mo | Works today; Drive's interface, not branded | None |
| Hosted gallery service (Pixieset etc.) | Free plan is 3 GB (~3–6 shoots); paid plans ~$8–10+/mo | Polished, built for photographers | Account setup |
| **This portal (lean v1)** | Storage only: $0–5/mo | Branded, on her own site, exactly her requirements | Build + test (phases below) |

Recommendation for discussion: if the portal is being built anyway, the lean v1
below is small and cheap to run. If build cost to Temima is a concern while the
business grows, Google Drive "anyone with the link" folders meet her stated
requirements today at no cost, and the portal can come later without losing
anything.

## Architecture (proposed)

Fits the existing DSS host (DigitalOcean droplet), which already runs Postgres,
the Laravel `db-service`, the Bun `auth-service`, and host nginx with an
`auth_request` gateway.

```
                 ┌──────────────────────── DSS host ─────────────────────────┐
 Temima ──HTTPS──► nginx ──auth_request──► auth-service (admin login)         │
 Client ──HTTPS──►   │                                                        │
                     ├──► portal-service (Bun) ──► db-service ──► Postgres     │
                     └──► momentsbytemima site (static + portal pages)        │
                 └──────────────────────────┬──────────────────────────────────┘
                                            │ presigned URLs only
 Browsers ───── direct upload / download ───►  Cloudflare R2 (private bucket)
```

- **Uploads go browser → R2 directly** with short-lived presigned URLs issued by
  the portal service. Large files never pass through the droplet.
- **Previews are made in Temima's browser** (~2048 px web copy + ~600 px
  thumbnail) and uploaded with the original. No server-side image processing.
- **Downloads** use short-lived presigned URLs, issued only after the delivery
  link is checked.
- **Download all** builds the zip in the client's browser as it streams (e.g.
  the `client-zip` library); fallback is a list of individual downloads. At
  ~50 photos (0.5–1 GB) this is comfortable on modern phones.
- **portal-service:** a small Bun service (same stack and test tooling as
  `auth-service`). Handles delivery logic, link checks, and presigning.
- **Data:** tables in the shared Postgres via `db-service`, following the
  existing per-app pattern (`JewkiebotController`, `R6StatsController`).
- **Admin auth:** an `auth-service` account for Temima with an admin role; nginx
  `auth_request` protects the admin pages and API.
- **Frontend:** admin pages and the client gallery (`/d/<link>`) live in the same
  React + Vite app, sharing the site's look and container.

## Data model (draft)

```
deliveries
  id
  client_name, client_email
  title
  token_hash          -- SHA-256 of the link secret; the secret itself is never stored
  disabled_at         -- nullable
  first_opened_at, last_opened_at
  created_at

files
  id, delivery_id → deliveries
  original_key, preview_key, thumb_key   -- R2 object keys
  filename, content_type, size_bytes, sha256, width, height
  position, created_at
```

Clients are fields on the delivery rather than a separate table: with no client
accounts, a table adds nothing in v1. Object keys are random
(`deliveries/<uuid>/<uuid>.jpg`), never based on names.

## API sketch (portal-service)

Admin (behind `auth_request`, admin role required):

| Method | Path | Purpose |
|---|---|---|
| GET/POST | `/api/admin/deliveries` | list / create deliveries (create returns the link once) |
| PATCH | `/api/admin/deliveries/:id` | edit title/client, disable/enable |
| DELETE | `/api/admin/deliveries/:id` | delete delivery and its objects |
| POST | `/api/admin/deliveries/:id/uploads` | presigned upload URLs for a batch of files |
| POST | `/api/admin/deliveries/:id/files` | confirm uploads (size + checksum checked against R2) |
| DELETE | `/api/admin/files/:id` | remove one photo |
| POST | `/api/admin/deliveries/:id/link` | issue a new link (invalidates the old one) |

Client (public, link-gated, rate-limited):

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/d/session` | exchange the link secret for an HttpOnly cookie scoped to that delivery |
| GET | `/api/d/files` | photo list + presigned preview/thumbnail URLs |
| GET | `/api/d/files/:id/download` | presigned URL for the original |

## Security requirements

- Link secrets: ≥128 bits from a CSPRNG, URL-safe; only a SHA-256 hash stored.
  Since the secret isn't stored, a lost link is replaced by issuing a new one.
- The secret goes in the URL **fragment** (`/d/#<secret>`), which browsers
  never send to servers, so it can't land in nginx access logs, our own request
  logs, or Referer headers. The gallery page reads it, exchanges it via
  `POST /api/d/session` for an HttpOnly, Secure, SameSite=Lax cookie scoped to
  that delivery, then removes it from the address bar.
  `Referrer-Policy: no-referrer` on portal pages.
- Every request re-checks that the delivery exists and is enabled, and that the
  requested file belongs to *that* delivery (no access by guessing file ids).
- Presigned URLs: downloads ≤ 10 min, uploads ≤ 15 min and bound to the exact
  key and content type.
- Bucket is private: anonymous reads and listing denied; CORS limited to our
  origins.
- Rate limiting on link checks (per IP).
- Admin endpoints require the admin role via the gateway; the service also
  rejects requests missing the gateway's `X-User-*` headers.
- Uploads restricted to image types and a maximum size per file.
- Portal pages send `X-Robots-Tag: noindex`.

## Logging & monitoring (internal)

> Internal only; not part of Temima's plan document.

Everything the backend does is logged, following the jewkiebot pattern: a
`Notifier` (info / warn / error / fatal) with two transports, so every event
goes to **both** the server logs and Discord.

- **Server logs:** `ConsoleTransport` → stdout → `docker logs`, collected with
  the existing `scripts/pull-logs.sh`. One structured line per event. Also a
  per-request `[HTTP]` access line (method, route, status, duration, request
  id), which is skipped for Discord exactly as in jewkiebot. Docker log
  rotation (`json-file`, `max-size` / `max-file`) is set on the portal-service
  so logs can't fill the disk.
- **Discord:** `WebhookTransport` → `discord-bot`'s `POST /notify`, using a new
  API key mapped in `consumers.dev.json` / `consumers.prod.json` to new
  `logs` and `notifications` channels (separate channels for dev and prod).
  Unlike jewkiebot, which sends everything to `notifications`, the portal routes
  by level:
  - **`logs`:** every event, info and above.
  - **`notifications`:** things that need a person, i.e. warn, error, and fatal.
- **Uncaught errors:** `console.*` is wrapped (`wrapConsoleForNotifier`), and
  unhandled exceptions and rejections log as `fatal` before exit, so nothing
  fails silently.

### What gets logged

| Area | Event | Level |
|---|---|---|
| Admin | Sign-in success / failure (from auth-service, already logged there) | info / warn |
| Admin | Delivery created, edited, disabled, enabled, deleted | info |
| Admin | New link issued (old one invalidated) | info |
| Admin | Upload batch: started, finished (count, total MB), files failed or rejected | info / warn |
| Admin | Photo removed | info |
| Client | Delivery opened (first open flagged) | info |
| Client | Photo downloaded; Download all started | info |
| Client | Invalid, disabled, or old link used | warn |
| Client | Rate limit hit (possible link guessing) | warn |
| System | Service start / shutdown; health check failures | info / error |
| System | db-service, R2, or discord-bot unreachable | error |
| System | Upload checksum or size mismatch | error |
| System | Unhandled exception | fatal |
| System | Retention/cleanup job results (if a retention policy is adopted) | info |

### Rules

- **Never logged anywhere:** link secrets, session cookies, presigned URLs,
  auth tokens, or request bodies. A redaction step in the Notifier strips known
  keys and anything that looks like a token or signed URL, as a backstop.
- **Personal data:** deliveries are identified by id and title. Client emails
  are masked (`t•••@gmail.com`); IP addresses are hashed.
- **Volume:** batch events are summarised (one "60 photos uploaded" line, not
  60 lines). The Discord transport buffers and flushes like jewkiebot's
  `DiscordTransport`, and splits messages over Discord's 2000-character limit.
- **Failure isolation:** a Discord or discord-bot outage never blocks or fails
  a user request; events still reach the server logs.

## Testing plan

Everything below runs locally/in CI against stand-ins; nothing touches real
storage.

1. **Local stack:** MinIO (S3-compatible) standing in for R2; Postgres +
   db-service + auth-service via the existing compose setup.
2. **Unit (bun test):** link generation/hashing/comparison, disabled/deleted
   logic, presign parameters (key, expiry, content type), Gmail draft URL
   building (encoding of names, titles, links).
3. **API integration (bun test + supertest, like auth-service):**
   - Isolation: delivery A's link or cookie can never list, preview, or download
     delivery B's photos, including by guessing file ids.
   - Disabled, deleted, reissued-old, and malformed links are rejected without
     revealing whether the delivery exists.
   - Admin endpoints reject anonymous and non-admin users.
   - Uploads register only if size/checksum match the stored object.
   - Rate limits trigger as specified.
4. **Storage checks (MinIO):** anonymous read and listing denied; expired
   presigned URLs denied; an upload URL can't write a different key.
5. **End-to-end (Playwright):** admin signs in → creates delivery → uploads →
   copies link → client opens it → views gallery → downloads one photo and
   "all" → downloaded bytes match the originals (SHA-256). Run in Chromium,
   WebKit (Safari engine), and a phone viewport.
6. **Volume and failure:** a 60 × 20 MB delivery; upload interrupted and
   retried; duplicate filenames; non-image and oversized files rejected.
7. **Real devices before launch:** iPhone Safari and Android Chrome for viewing
   and "Download all" (the most fragile feature on iOS); the Gmail draft link
   on desktop.
8. **Operational:** restore Postgres from backup into a scratch DB once;
   deleting a delivery removes all its objects from the bucket.
9. **Logging:**
   - Every event in the logging table is emitted with the right level and
     channel (unit tests with a capturing transport, like jewkiebot's
     `notifier.test.ts`).
   - Redaction: run the full E2E flow with a capturing transport and assert no
     link secret, cookie, presigned URL, or unmasked email appears in any log
     line. The same check runs against the nginx access log in the dev stack.
   - With discord-bot down or slow, requests still succeed and events still
     reach stdout.
   - A 60-photo upload produces summarised events, not one per photo.

## Rollout plan

1. **Phase 0 — Decide:** build now vs. wait; sign off on sending and storage.
2. **Phase 1 — Backend:** complete the [setup checklist](#setup-checklist-phase-1)
   (Temima's Cloudflare account, R2 bucket + CORS, Discord channels), then
   db-service tables and portal-service with logging from the start, plus unit
   and integration tests.
3. **Phase 2 — Admin UI:** sign-in, deliveries list, uploader, Gmail draft.
4. **Phase 3 — Client gallery:** viewing, downloads, Download all; E2E suite.
5. **Phase 4 — Pilot on `dev.momentsbytemima.com`:** Temima sends a real
   delivery to herself and one friendly client.
6. **Phase 5 — Launch:** prod deploy; update `designDoc.md`.

## Setup checklist (Phase 1)

Manual steps outside the code. Do these when Phase 1 starts, not before.

### Cloudflare R2 (Temima's account)

Temima owns the account and pays Cloudflare directly; we only get access.

1. **Temima** creates a free Cloudflare account with `momentsbytemima@gmail.com`.
2. **Temima** turns on R2 (Cloudflare asks for a card even though usage within
   the free tier costs nothing).
3. **Temima** invites Yaakov as a member of her account so she never has to
   handle keys. Fallback if member access isn't available on her plan: she
   creates the API token in step 5 herself while on a call with us.
4. **Us:** create `momentsbytemima-portal` (prod) and `momentsbytemima-portal-dev`
   buckets, both private, with CORS allowing only the site and dev site origins.
5. **Us:** create an R2 API token limited to those two buckets (object read +
   write), and put its key id, secret, and account id in the portal-service
   env files on the server, never in git.
6. Set a spending notification in her account as a safety net.

### Discord logging (portal's own channels)

The portal logs to its own channels, separate from every other DSS app.

1. In the Discord server the bot is in, create four channels:
   `momentsbytemima-logs`, `momentsbytemima-notifications`,
   `momentsbytemima-dev-logs`, `momentsbytemima-dev-notifications`.
2. Make sure the bot's role can **view** and **send messages** in all four
   (check each channel's permissions).
3. Turn on Discord **Developer Mode** (User Settings → Advanced), then
   right-click each channel → **Copy Channel ID**.
4. Generate two random API keys, one for prod and one for dev
   (e.g. `openssl rand -hex 16`).
5. Add an entry to `consumers.prod.json` and `consumers.dev.json` in the dss
   repo, in the same shape as jewkiebot's:
   ```json
   "<api key>": {
       "name": "Moments by Temima Portal Prod",
       "channels": {"logs": "<logs channel id>", "notifications": "<notifications channel id>"}
   }
   ```
   discord-bot re-reads this file on every request, so no restart is needed.
6. Put the key and discord-bot's URL in the portal-service env files
   (`API_NOTIFY_URL`, `API_NOTIFY_TOKEN`, `API_NOTIFY_PROJECT`), copying the
   URL format from jewkiebot's env file.
7. Check it: the portal sends a test message to each channel on start-up.

## Open questions

### For Temima (asked 2026-11-02, awaiting reply)

Sent with the plain-language plan, which proposes starting now and building as
we go.

1. **Approval** of the plan.
2. **Contact form:** the site's form currently sends messages to
   `temimaedgar@gmail.com`. Should that be `momentsbytemima@gmail.com`?
   (Also check FormSubmit's first-message confirmation was done.)
3. **Phone number** in the Contact section?
4. **Retention:** keep photos until she deletes them, or remove them
   automatically after a set time?

### For us (dev)

5. Confirm the `auth-service` + nginx `auth_request` gateway can protect routes
   on `momentsbytemima.com` / `dev.momentsbytemima.com` (cookie domain, CORS).
6. Confirm db-service for the two tables (vs. portal-local SQLite).
7. Where portal-service runs in compose, and its dev/prod env files.
8. How the shared notifier reaches each app (decided: one shared copy, see the
   decisions log). App images are built by cloning each app's own repo, so code
   in `dss/shared` isn't importable as-is. Options: a small separate repo that
   apps install as a dependency (`bun add github:…`), or each Dockerfile
   copying `dss/shared` into the image (which breaks running an app's tests
   from its own repo). Leaning toward the separate repo. Moving jewkiebot onto
   it is part of the work.

## Decisions log

| Date | Decision |
|---|---|
| 2026-11-02 | Scope is file delivery only; keep it simple; testing must be rigorous. |
| 2026-11-02 | Access is one private link per delivery, anyone with the link can view (Temima). No client accounts or PINs. |
| 2026-11-02 | Links go out from `momentsbytemima@gmail.com` (Temima). Proposed: via a pre-filled Gmail draft she sends herself. |
| 2026-11-02 | Clients download full-resolution originals only, so they can use them however they like. No smaller download size. |
| 2026-11-02 | Everything the backend does is logged to server logs and Discord, following the jewkiebot Notifier pattern (internal only). |
| 2026-11-02 | Link secrets go in the URL fragment so they never reach any server log. |
| 2026-11-02 | Each app logs to its own channels: the portal gets its own Discord channels in the same DSS Discord server. |
| 2026-11-02 | Temima owns the Cloudflare account and pays for R2 directly; we get member access. |
| 2026-11-02 | The notifier (`notifier.js` / `apiTransport.js`) moves out of jewkiebot into shared code used by both jewkiebot and the portal, instead of being copied. |
