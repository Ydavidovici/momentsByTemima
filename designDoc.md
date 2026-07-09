# Moments by Temima — Design Document

## Overview

Moments by Temima is an **informational, client-facing website**. It is a purely
frontend project — there is **no backend, no database, and no server-side logic**.
The site presents information about the business and showcases work; it does not
process data or authenticate users.

## Design Philosophy

Customer's direction, verbatim: **"Light, airy, and happy."**

This translates into the following concrete design decisions:

- **Palette** — warm off-white / cream backgrounds, soft pastel accents (blush,
  sky, sage), high light-value tones. Nothing dark, heavy, or high-contrast.
- **Space** — generous whitespace and breathing room; airy, uncluttered layouts.
- **Typography** — an elegant, friendly serif for headings paired with a clean,
  legible sans-serif for body text.
- **Mood** — warm, welcoming, feminine, and cheerful without being fussy or
  maximalist. Sleek and soft rather than fancy/ornate.
- **Imagery** — photography-forward; images do the heavy lifting, framed by lots
  of light space.

## Technical Approach & Rationale

_Owner's notes on why this stack:_

- **React (JSX)** — chosen primarily for the JSX authoring ergonomics (owner
  preference). We are not using React for its client-state/data-fetching power
  here; we want the component model and JSX templating.
- **Static, purely frontend** — for an informational site this is more than
  enough. No backend is required to serve testimonials, a gallery, a mission
  statement, or an about page.
- **Scalable toward future "dynamicness"** — although static today, the
  architecture is intentionally kept easy to extend. Because content is
  organized into components and pages, we can later swap hardcoded content for a
  headless CMS / JSON feed, add a contact or booking form (via a form service or
  a small backend), or introduce data fetching — **without re-platforming**.
- **Tooling: Vite + Bun** — Bun is the package manager / runtime (owner
  preference over npm/node); Vite provides a fast dev server and a simple static
  build output (`dist/`) that can be hosted on any static host (Netlify, Vercel,
  GitHub Pages, S3, etc.).
- **Routing: react-router-dom** — client-side routing for the multiple
  informational pages, keeping the app a single deployable static bundle.

## Pages (initial scope)

- **Home / Landing** — hero + brief intro, entry point to the rest of the site.
- **About Me** — who Temima is; personal introduction.
- **Gallery** — showcase of work/images.
- **Client Testimonials** — social proof from past clients.
- **Mission Statement** — the "why" behind Moments by Temima.

## Future Considerations (not in initial scope)

- Gallery driven by a headless CMS or a JSON manifest instead of hardcoded data.
- Contact / inquiry / booking form (would introduce a lightweight backend or a
  third-party form service such as Formspree).
- Blog or "recent work" feed.
- Analytics and basic SEO/meta polish.

## Non-Goals

- No user accounts, authentication, or admin area.
- No server-rendered backend or database in the initial build.
