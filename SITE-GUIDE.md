# Coldhands Site Guide

Current reference for the `coldhanded.github.io` repository.

- Local repository: `C:\Users\Cold\Projects\coldhanded.github.io`
- Live site: `https://coldhands.net/`
- GitHub repository: `coldhanded/coldhanded.github.io`
- Framework: Astro 7, TypeScript, Tailwind CSS through Vite
- Hosting: GitHub Pages
- Canonical domain and DNS: Cloudflare and `coldhands.net`
- Package manager: pnpm 11.5.0 through Corepack
- Publishing workflow: Roundtable

## Roundtable workflow

Use the VS Code tasks in `.vscode/tasks.json`.

Roundtable is the local publishing workflow for the site. It combines
the VS Code tasks, content generators, preview command, validation,
build, commit, and push scripts. The task labels use the `Roundtable:`
prefix, while the underlying script filenames remain unchanged.

### Create a project

Run:

```text
Roundtable: New project
```

This calls `new-project.cmd`, which runs `new-project.ps1`.

The generator:

- asks for a title;
- creates a lowercase slugged `.txt` file;
- writes it to `src/content/philes/volume-0/`;
- assigns the next available project `order`;
- adds the standard project frontmatter and starter sections;
- writes LF line endings with one final newline;
- opens the file in the current VS Code window.

### Create a note

Run:

```text
Roundtable: New note
```

This calls `new-note.cmd`, which runs `new-note.ps1`.

The generator:

- asks for a title;
- creates a lowercase slugged `.txt` file;
- writes it to `src/content/philes/volume-1/`;
- adds the standard note frontmatter and starter section;
- writes LF line endings with one final newline;
- opens the file in the current VS Code window.

### Preview

Run:

```text
Roundtable: Preview
```

This runs:

```powershell
corepack pnpm dev
```

Open the local address printed in the terminal. Keep the preview task
running while editing.

### Publish

Run:

```text
Roundtable: Publish
```

This calls `publish.cmd`, which runs `publish.ps1`.

The publish script:

1. requires the current branch to be `main`;
2. fetches `origin/main`;
3. stops if the remote branch has newer commits;
4. shows all changed files;
5. asks for confirmation;
6. runs `corepack pnpm build`;
7. stages all changes;
8. asks for a commit message;
9. commits and pushes to `origin/main`.

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

Do not assume a globally installed `pnpm` command is available.

## Content locations

```text
src/content/philes/volume-0/    Projects
src/content/philes/volume-1/    Notes
```

The internal `volume-*` folder names are retained from the original
theme. Public routes use friendly names.

### Project frontmatter

```yaml
---
title: "Project Title"
date: 2026-07-09
author: "cold"
order: 0
---
```

Projects are sorted by `order` in ascending order.

### Note frontmatter

```yaml
---
title: "Note Title"
date: 2026-07-09
author: "cold"
---
```

Notes are sorted by date in descending order.

### Optional frontmatter

The content schema also supports:

```yaml
lang: "en"       # "en" or "zh"
slug: "custom-slug"
redacted: false
```

Normally, do not add these unless needed.

## Titles, filenames, and routes

These values serve different purposes:

- The filename normally determines the URL slug.
- The frontmatter `title` controls the visible title, lists, browser
  title, and social metadata.
- An optional frontmatter `slug` overrides the filename-derived slug.
- A Project's `order` controls its position in project lists.

Example:

```text
File:
src/content/philes/volume-0/roundtable-publishing-system.txt

Frontmatter:
title: "Roundtable Publishing System"

Public route:
https://coldhands.net/projects/roundtable-publishing-system/
```

Renaming only the file changes the route, not the visible title.

## Writing and formatting rules

- Write Project and Note bodies as plain text.
- Use section headings such as `STATUS //` and `DEPLOYMENT //`.
- Manually wrap prose at 72 columns with Rewrap Revived.
- Use `Win+Q` to rewrap the current paragraph.
- The renderer has an 80-cell safety wrap.
- Use LF line endings.
- Keep exactly one final newline.
- Use two spaces for indented lists and aligned metadata.
- Do not use em dashes.
- Preserve the personal, direct, slightly informal writing voice.
- Markdown inline links are not supported in article body text.
- Avoid raw URLs unless displaying the URL is intentional.

Standalone images are supported with a line such as:

```text
![Useful alt text](/images/example.png)
```

The image line must stand on its own. The alt text is also used as the
caption.

Formatting rules are reinforced by:

```text
.editorconfig
.gitattributes
.vscode/settings.json
```

## Homepage

Primary homepage configuration:

```text
src/config/site.ts
```

Edit this file for:

- TL;DR text;
- homepage section names;
- GitHub, email, and Signal links;
- the ASCII logo;
- homepage section ordering.

Current homepage sections are:

```text
TL;DR
.TXT
PROJ
COMMS
```

The `PROJ` list is generated automatically from Volume 0 frontmatter
order. Do not hard-code individual project links into the homepage.

Homepage rendering logic:

```text
src/components/home/HomeScreen.astro
```

Homepage route:

```text
src/pages/index.astro
```

## Projects, Notes, and route mapping

Volume configuration:

```text
src/config/volumes.ts
```

Current mapping:

```text
Volume 0 -> /projects/
Volume 1 -> /notes/
```

This file also controls:

- Projects and Notes titles and subtitles;
- list labels;
- sorting;
- entry prefixes;
- index-page ending labels.

Content route derivation:

```text
src/modules/philes/routing.ts
```

Content loading and sorting:

```text
src/modules/philes/repository.ts
src/modules/volumes/repository.ts
```

Friendly route pages:

```text
src/pages/[section]/index.astro
src/pages/[section]/[slug]/index.astro
```

Legacy redirect pages:

```text
src/pages/volume/[volume]/index.astro
src/pages/volume/[volume]/[slug]/index.astro
```

Legacy routes redirect as follows:

```text
/volume/0/          -> /projects/
/volume/0/<slug>/   -> /projects/<slug>/
/volume/1/          -> /notes/
/volume/1/<slug>/   -> /notes/<slug>/
```

Do not remove the redirect pages unless the old URLs are intentionally
being retired.

## Article rendering

Content collection definition:

```text
src/content.config.ts
```

Loader and frontmatter parsing:

```text
src/modules/philes/loader.ts
src/modules/philes/schema.ts
```

Article shell and body rendering:

```text
src/components/phile/PhileShell.astro
src/modules/philes/render.ts
src/modules/textmode/ansi/render.ts
```

The renderer is intentionally not a general Markdown renderer. It
handles plain text, the site's ANSI-style colour markers, and standalone
images.

Project QR codes:

```text
src/components/phile/ProjectQrCode.astro
src/pages/[section]/[slug]/index.astro
```

QR codes are:

- generated statically from each Project's canonical URL;
- shown only for Volume 0 Projects;
- white on the page background;
- hidden at widths of 760 px and below.

## Layout, metadata, and design

Base HTML, canonical URLs, browser titles, Open Graph metadata, RSS
discovery, and global assets:

```text
src/layouts/base/BaseLayout.astro
```

Textmode page wrapper:

```text
src/layouts/textmode/TextmodeLayout.astro
```

Canonical site URL and Vite/Tailwind setup:

```text
astro.config.mjs
```

The canonical site value must remain:

```text
https://coldhands.net/
```

Main design configuration:

```text
src/config/appearance.ts    Colours, font URL, and sizing
src/config/effects.ts       Particles and homepage glitch effect
src/config/textmode.ts      Column widths and responsive breakpoint
src/config/index.ts         Config exports
```

Global stylesheet entry point:

```text
src/styles/global.css
```

Important style modules:

```text
src/styles/modules/home.css
src/styles/modules/phile.css
src/styles/modules/life.css
src/styles/modules/particles.css
src/styles/modules/responsive.css
```

The main mobile breakpoint is 760 px. Mobile behaviour is already
intentional, so avoid broad responsive changes without checking desktop
and mobile separately.

## Favicon and fonts

Current favicon:

```text
public/favicon.svg
```

Source fonts:

```text
fonts/gohu.woff
fonts/wqy-zenhei-sharp-0.9.45.ttf
```

Generated browser font:

```text
public/fonts/gohu-subset.woff
```

Font build scripts:

```text
scripts/subset-fonts.mjs
scripts/build-cjk-atlas.mjs
```

To regenerate font assets:

```powershell
corepack pnpm assets:fonts
```

Edit the source font inputs or generation scripts, not the generated
subset or CJK atlas files.

## RSS, sitemap, and 404 page

```text
src/pages/rss.xml.ts
src/pages/sitemap.xml.ts
src/pages/404.astro
```

RSS and sitemap entries are generated from the same content repository
used by the site pages.

## Build and code-quality configuration

```text
package.json          Scripts and dependencies
pnpm-lock.yaml        Locked dependency versions
pnpm-workspace.yaml   pnpm workspace configuration
biome.json            Formatter and linter configuration
tsconfig.json         TypeScript configuration
.editorconfig         Line endings and content indentation
.gitattributes        Git text normalization
.vscode/settings.json Editor and Rewrap settings
.vscode/tasks.json    New, preview, and publish tasks
```

Biome checks source files listed in `biome.json`. The `.txt` content
files are governed by EditorConfig, Rewrap, the content loader, and the
80-cell renderer safety wrap.

## Deployment

GitHub Pages deployment workflow:

```text
.github/workflows/deploy.yml
```

A push to `main` triggers the Astro build and GitHub Pages deployment.

Cloudflare handles the domain and DNS outside this repository. Do not
change Cloudflare Email Routing or add mail-provider DNS records as part
of normal site work.

## Generated files and folders

Do not manually edit:

```text
.astro/
dist/
node_modules/
.vite/
public/assets/cjk/
public/fonts/gohu-subset.woff
pnpm-lock.yaml
```

Notes:

- `.astro/`, `dist/`, `node_modules/`, and `.vite/` are generated.
- `public/assets/cjk/` is generated by the CJK atlas script.
- `public/fonts/gohu-subset.woff` is generated from `fonts/gohu.woff`.
- `pnpm-lock.yaml` should be changed only by pnpm.

Files under `dist/volume/` are generated legacy redirect output. The
source redirect pages live under `src/pages/volume/`.

## Common change map

| Task | File or folder |
|---|---|
| Add a Project | `Roundtable: New project` |
| Add a Note | `Roundtable: New note` |
| Edit Project content | `src/content/philes/volume-0/` |
| Edit Note content | `src/content/philes/volume-1/` |
| Change homepage copy or sections | `src/config/site.ts` |
| Change Projects or Notes labels/sorting | `src/config/volumes.ts` |
| Change route derivation | `src/modules/philes/routing.ts` |
| Change article rendering | `src/modules/philes/render.ts` |
| Change colours or font sizing | `src/config/appearance.ts` |
| Change particles or glitch behaviour | `src/config/effects.ts` |
| Change text widths | `src/config/textmode.ts` |
| Change article CSS | `src/styles/modules/phile.css` |
| Change mobile CSS | `src/styles/modules/responsive.css` |
| Change favicon | `public/favicon.svg` |
| Change Project QR code | `src/components/phile/ProjectQrCode.astro` |
| Change browser/social metadata | `src/layouts/base/BaseLayout.astro` |
| Change deployment | `.github/workflows/deploy.yml` |

## Quick troubleshooting

### `pnpm` is not recognized

Use:

```powershell
corepack pnpm <command>
```

### A Project has the wrong visible name

Change its frontmatter `title`.

### A Project has the wrong URL

Change its filename or optional frontmatter `slug`.

### A Project appears in the wrong position

Check its frontmatter `order`. Project orders should be unique,
non-negative integers.

### A Note appears in the wrong position

Check its frontmatter `date`.

### A new Project is missing from the homepage

Confirm that:

- it is a `.txt` file under `volume-0`;
- its frontmatter is valid;
- its `order` is valid and unique;
- the preview terminal shows no content or build error.

The homepage list is automatic. Do not add the link manually.

### Publishing stops before committing

Read the terminal message. The script intentionally stops when:

- the current branch is not `main`;
- the remote branch is ahead;
- the build or checks fail;
- the commit message is empty.
