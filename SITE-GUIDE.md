# Coldhands Site Guide

Operational reference for the `coldhanded.github.io` repository.

```text
Local:  C:\Users\Cold\Projects\coldhanded.github.io
Live:   https://coldhands.net/
GitHub: coldhanded/coldhanded.github.io
```

The site uses Astro, TypeScript, Tailwind through Vite, GitHub Pages,
and Cloudflare DNS. Tool and dependency versions are pinned in
`package.json` and `pnpm-lock.yaml`.

## Roundtable workflow

Use the tasks in `.vscode/tasks.json`.

```text
Roundtable: New project
Roundtable: New note
Roundtable: Preview
Roundtable: Publish
```

The content tasks call the matching `.cmd` and `.ps1` files in the
repository root. They create slugged `.txt` files with standard
frontmatter, LF line endings, and one final newline.

Projects are written to `volume-0` and receive the next available
`order`. Notes are written to `volume-1`.

Preview runs:

```powershell
corepack pnpm dev
```

Publish calls `publish.cmd`, which runs `publish.ps1`. The script:

1. requires the `main` branch;
2. fetches `origin/main` and stops if the remote is ahead;
3. shows all changes and asks for confirmation;
4. runs `corepack pnpm build`;
5. stages all changes;
6. asks for a commit message;
7. commits and pushes to `origin/main`.

The build command runs:

```text
astro check
biome check .
astro build
```

The script never force-pushes.

For manual package commands in PowerShell, use:

```powershell
corepack pnpm <command>
```

Do not assume a global `pnpm` command is available.

## Content

```text
src/content/philes/volume-0/    Projects
src/content/philes/volume-1/    Notes
```

The internal `volume-*` names come from the original theme. Public
routes use `/projects/` and `/notes/`.

Collection loading and validation:

```text
src/content.config.ts
src/modules/philes/loader.ts
src/modules/philes/schema.ts
```

### Project frontmatter

```yaml
---
title: "Project Title"
date: 2026-07-09
author: "cold"
order: 0
---
```

Projects sort by `order` in ascending order. Orders must be unique,
non-negative integers.

### Note frontmatter

```yaml
---
title: "Note Title"
date: 2026-07-09
author: "cold"
---
```

Notes sort by date in descending order.

Optional fields:

```yaml
lang: "en"       # "en" or "zh"
slug: "custom-slug"
redacted: false
```

The filename normally determines the URL slug. Frontmatter `title`
controls the visible title and metadata. Optional `slug` overrides the
filename-derived slug.

### Writing rules

- Write Project and Note bodies as plain text.
- Use headings such as `STATUS //` and `DEPLOYMENT //`.
- Manually wrap prose at 72 columns with Rewrap Revived.
- Use `Win+Q` to rewrap the current paragraph.
- The renderer has an 80-cell safety wrap.
- Use LF line endings and exactly one final newline.
- Use two spaces for indented lists and aligned metadata.
- Do not use em dashes.
- Keep the voice personal, direct, and slightly informal.
- Inline Markdown links are not supported in article bodies.
- Avoid raw URLs unless displaying the URL is intentional.

Standalone images use:

```text
![Useful alt text](/images/example.png)
```

The image line must stand alone. Its alt text is also the caption.

Editor rules live in:

```text
.editorconfig
.gitattributes
.vscode/settings.json
```

## Homepage

Homepage content and ordering are configured in:

```text
src/config/site.ts
```

It controls TL;DR copy, section labels, About and contact links, and the
ASCII logo.

The Project list is generated from Volume 0 frontmatter. Do not
hard-code individual Project links into the homepage.

```text
src/components/home/HomeScreen.astro
src/pages/index.astro
```

## About page

The About page is separate from the content collection.

```text
src/pages/about.astro
src/components/about/AboutScreen.astro
src/modules/about/render.ts
src/modules/textmode/glitch/about.ts
src/styles/modules/about.css
public/images/aboutme.webp
```

- `about.astro` supplies metadata and the textmode layout.
- `AboutScreen.astro` combines the frame and image layers.
- `render.ts` owns the heading, copy, frame, footer, and return link.
- `glitch/about.ts` owns intermittent glitch behavior.
- `about.css` owns image placement, clipping, blends, and reduced
  motion.

The outer frame and image outline are textmode characters generated in
`render.ts`. Do not replace them with CSS borders.

The image sits beneath the rendered outline. Its geometry in
`about.css` is deliberately calibrated for equal padding. Do not
change it while editing copy or glitch behavior.

About image contract:

```text
Path:   public/images/aboutme.webp
Format: WebP
Shape:  square
Target: 500 x 500 pixels
Fit:    cover, centered
```

Replace the file at the same path when changing the photo. Do not alter
the source aspect ratio to correct page alignment.

Duplicate glitch layers and the scanline are decorative. They must
remain disabled for `prefers-reduced-motion: reduce`.

The homepage link is in `src/config/site.ts`. The sitemap entry is in
`src/modules/seo/xml.ts`.

## Projects, Notes, and articles

Volume configuration:

```text
src/config/volumes.ts
```

It controls public paths, index headings, sorting, entry prefixes, EOF
lines, and index quotes.

```text
Volume 0 -> /projects/
Volume 1 -> /notes/
```

Routing and repositories:

```text
src/modules/philes/routing.ts
src/modules/philes/repository.ts
src/modules/volumes/repository.ts
```

Public route pages:

```text
src/pages/[section]/index.astro
src/pages/[section]/[slug]/index.astro
```

Legacy redirects:

```text
src/pages/volume/[volume]/index.astro
src/pages/volume/[volume]/[slug]/index.astro
```

Keep the legacy redirect pages unless the old `/volume/` URLs are
intentionally retired.

Index rendering:

```text
src/components/volume/VolumeScreen.astro
src/modules/volumes/render.ts
```

Article rendering:

```text
src/components/phile/PhileShell.astro
src/modules/philes/render.ts
src/modules/textmode/ansi/render.ts
```

The article renderer handles plain text, ANSI-style markers, and
standalone images. It is not a general Markdown renderer.

Project QR codes:

```text
src/components/phile/ProjectQrCode.astro
src/pages/[section]/[slug]/index.astro
```

They are generated from canonical Project URLs, shown only for Volume
0, and hidden at widths of 760 px and below.

## Layout and design

```text
src/layouts/base/BaseLayout.astro
src/layouts/textmode/TextmodeLayout.astro
astro.config.mjs
```

`BaseLayout.astro` handles browser titles, canonical URLs, Open Graph
metadata, RSS discovery, and global assets.

The canonical site value in `astro.config.mjs` must remain:

```text
https://coldhands.net/
```

Design configuration:

```text
src/config/appearance.ts    Colours, font, and sizing
src/config/effects.ts       Particles and glitch timing
src/config/textmode.ts      Text widths and mobile breakpoint
src/config/index.ts         Config exports
```

Global stylesheet entry point:

```text
src/styles/global.css
```

Important style modules:

```text
src/styles/modules/home.css
src/styles/modules/about.css
src/styles/modules/phile.css
src/styles/modules/life.css
src/styles/modules/particles.css
src/styles/modules/responsive.css
```

The main mobile breakpoint is 760 px. Check desktop and mobile
separately before changing shared sizing or responsive rules.

## Metadata and assets

RSS, sitemap, robots, and 404:

```text
src/pages/rss.xml.ts
src/pages/sitemap.xml.ts
src/pages/robots.txt.ts
src/pages/404.astro
src/modules/seo/http.ts
src/modules/seo/xml.ts
```

Content entries come from the same repositories used by site pages.
Static routes such as `/about/` are listed in
`src/modules/seo/xml.ts`.

Favicon and source fonts:

```text
public/favicon.svg
fonts/gohu.woff
fonts/wqy-zenhei-sharp-0.9.45.ttf
```

Generated font assets:

```text
public/fonts/gohu-subset.woff
public/assets/cjk/
```

Regenerate them with:

```powershell
corepack pnpm assets:fonts
```

Edit source fonts or generation scripts, not generated font assets.

## Build and deployment

Important configuration:

```text
package.json
pnpm-lock.yaml
pnpm-workspace.yaml
biome.json
tsconfig.json
.editorconfig
.gitattributes
.vscode/settings.json
.vscode/tasks.json
.github/workflows/deploy.yml
```

A push to `main` triggers the Astro build and GitHub Pages deployment.
Cloudflare handles the domain and DNS outside this repository.

Do not manually edit:

```text
.astro/
dist/
node_modules/
.vite/
public/assets/cjk/
public/fonts/gohu-subset.woff
```

`pnpm-lock.yaml` should change only through pnpm.

## Change map

- Add a Project: `Roundtable: New project`
- Add a Note: `Roundtable: New note`
- Edit Projects: `src/content/philes/volume-0/`
- Edit Notes: `src/content/philes/volume-1/`
- Homepage content: `src/config/site.ts`
- About copy or frame: `src/modules/about/render.ts`
- About image markup: `src/components/about/AboutScreen.astro`
- About image alignment: `src/styles/modules/about.css`
- About glitch: `src/modules/textmode/glitch/about.ts`
- Projects and Notes configuration: `src/config/volumes.ts`
- Route derivation: `src/modules/philes/routing.ts`
- Article rendering: `src/modules/philes/render.ts`
- Colours and sizing: `src/config/appearance.ts`
- Shared effects: `src/config/effects.ts`
- Text widths: `src/config/textmode.ts`
- Mobile CSS: `src/styles/modules/responsive.css`
- Favicon: `public/favicon.svg`
- Project QR codes: `src/components/phile/ProjectQrCode.astro`
- Browser and social metadata: `src/layouts/base/BaseLayout.astro`
- RSS and sitemap XML: `src/modules/seo/xml.ts`
- Deployment: `.github/workflows/deploy.yml`
