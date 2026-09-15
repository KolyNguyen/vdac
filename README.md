# VDac — Astro Accounting Website

Vietnamese-first, bilingual website for VDac Accounting Solutions.

## Run locally

```bash
npm install
npm run dev
```

## File-based CMS

Editors manage site content in `src/content/`:

- `services/` — service cards
- `news/` — news and events
- `documents/` — downloadable-resource listings

Each Markdown frontmatter field contains `vi` and `en` values. Add a new file to publish a new item; delete it to remove it. Pages are routed from `src/pages/` and can be extended by adding Astro page files.

## Content dashboard

Run `npm run dev`, then open `http://localhost:4321/keystatic` to manage Services, News, and Documents in the VDac Content Studio. It runs in local file mode, so saved changes are written straight to `src/content/`.

The branded admin overview is at `http://localhost:4321/admin`. It provides collection metrics, recent content, and quick links into the editor.

For a deployed, multi-editor dashboard, configure Keystatic's GitHub storage mode and its GitHub App environment variables before publishing the site.
