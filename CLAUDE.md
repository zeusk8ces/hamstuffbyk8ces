# K8CES Hugo Site — CLAUDE.md

Project context for AI-assisted development. Read this before touching any files.

---

## What this is

Personal amateur radio website for Jesus, callsign K8CES. Built with Hugo and a
custom theme called "dispatch". Deployed to Vercel. The primary content type is
**field reports** — POTA activation logs written in Markdown with rich frontmatter.

## Commands

```bash
hugo server -D          # dev server with drafts, localhost:1313
hugo --minify           # production build → public/
hugo new field-reports/YYYY-MM-DD-park-name.md   # scaffold a new field report
```

Hugo version is pinned in `.hugo-version`. Don't change it without testing the build.

---

## Directory structure

```
k8ces-hugo/
├── hugo.toml                         # site config, menu, params, taxonomies
├── vercel.json                       # Vercel deploy (framework: hugo)
├── .hugo-version                     # pinned Hugo version for Vercel
│
├── content/
│   ├── _index.md                     # homepage body text (hero bio paragraph)
│   ├── about.md                      # about page
│   ├── field-reports/
│   │   ├── _index.md                 # section title/description
│   │   └── YYYY-MM-DD-slug.md        # one file per activation
│   ├── 3d-designs/
│   │   └── _index.md
│   └── photos/
│       └── _index.md
│
└── themes/dispatch/
    ├── theme.toml
    ├── static/css/dispatch.css       # ALL styles — single file, no build step
    └── layouts/
        ├── index.html                # homepage
        ├── _default/
        │   ├── baseof.html           # HTML shell, sidebar JS lives here
        │   ├── single.html           # about, 3d-designs, photos, etc.
        │   └── list.html             # taxonomy pages, fallback list
        ├── field-reports/
        │   ├── single.html           # individual activation report
        │   └── list.html             # /field-reports/ index with cumulative stats
        └── partials/
            ├── head.html             # <head> tag contents
            ├── header.html           # sidebar + topbar (both live here)
            ├── footer.html
            ├── field-report-meta.html  # rail sidebar for field report singles
            └── pagination.html
```

---

## Adding a field report

Create `content/field-reports/YYYY-MM-DD-slug.md`. Full frontmatter schema:

```yaml
---
title: "Descriptive title of the activation"
date: 2026-05-15T10:30:00-05:00
draft: false
description: "One-sentence summary for <meta> and .Summary fallback."

# POTA
park_id: "K-4566"          # POTA park number — used to link to pota.app
park_name: "Proud Lake Recreation Area"
state: "MI"

# Gear
radio: "Elecraft KX2"
antenna: "Linked Dipole (40/20m)"
keyer: "KX2 internal paddle"
power: "10W"

# Operation
band: ["40m", "20m"]       # array — renders as comma-separated in the rail
mode: "CW"
freq_primary: "7.040"      # MHz
freq_secondary: "14.040"   # optional

# Results
total_qsos: 14
s2s_qsos: 2
s2s_callsigns: ["W8XYZ/P", "N4ABC/P"]   # optional — renders as a list in rail
qualified: true
duration_minutes: 68

# Conditions
conditions: "40m solid, 20m rough early"
propagation: "K-index 2"   # optional
weather: "Overcast, 58°F"  # optional

# Media
youtube_url: ""            # if present, renders a YouTube card in the rail
# photos: []               # future use

tags: ["POTA", "CW", "KX2", "QRP", "Michigan", "40m"]
---

Prose goes here. Standard Markdown.

## Section headings render in burgundy with a cream-border rule below.

> Blockquotes render in Brush Script MT / OD green — use sparingly for
> memorable moments or key contacts.
```

All frontmatter fields except `title` and `date` are optional. The stats bar on
the single page renders whatever is present; missing fields are omitted cleanly.

The field reports list page auto-calculates cumulative QSO and S2S totals across
all non-draft reports. No manual updates needed.

---

## Design system

**Theme:** "Dispatch" — warm editorial. Cream/tan base, burgundy headings,
OD green navigation, turquoise for external links and YouTube.

**CSS variables** (all in `dispatch.css` `:root`):
```
--cream / --cream-mid / --cream-border   base backgrounds
--tan / --tan-dark                       accent fills, tags
--burgundy / --burgundy-dk               headings, topbar rule, rail-rule
--od-green / --od-green-lt               nav links, Brush Script accents
--turquoise / --turquoise-dk             YouTube card, external links, read-more
--ink / --ink-mid / --ink-light          body text hierarchy
```

**Typography:**
- `'Playfair Display', 'Cream Cake', Georgia, serif` — display headings, callsign, post titles
  - Playfair Display loads from Google Fonts as a stand-in for Cream Cake
  - To use Cream Cake: add `@font-face` in `dispatch.css` pointing to self-hosted files
- `'Brush Script MT', cursive` — subheadings, section labels, sign-off ("72, Zeus")
- `Verdana, Geneva, sans-serif` — all body copy, nav, meta, tags

**Layout:** Two-column content grid (`1fr 320px`) with a rail sidebar.
Single-file CSS — no Sass, no PostCSS, no build step required.

---

## Site params (hugo.toml)

```toml
[params]
  callsign = "K8CES"
  name     = "Jesus"
  handle   = "Zeus"
  tagline  = "Amateur Radio Operator · Parks on the Air · CW"
  location = "Michigan"
  youtube  = "https://www.youtube.com/@ZeusK8CES"
  qrz      = "https://www.qrz.com/db/K8CES"
```

Access in templates as `{{ .Site.Params.callsign }}` etc.

## Menu (hugo.toml)

Nav is driven by `[menu.main]` entries in `hugo.toml`. To add a page to the nav:

```toml
[[menu.main]]
  name   = "New Page"
  url    = "/new-page/"
  weight = 6            # controls order; lower = further left
```

The YouTube link is hardcoded in `header.html` and `footer.html` as a special
case (turquoise styling, external link) — it does not come from `[menu.main]`.

---

## Deployment

Push to GitHub → Vercel picks it up automatically via GitHub integration.
`vercel.json` sets `framework: hugo` — Vercel installs the Hugo version from
`.hugo-version` and runs `hugo --minify`. Output goes to `public/`.

No environment variables required for a static build.

---

## Conventions

- Field report filenames: `YYYY-MM-DD-descriptive-slug.md`
- Draft posts: set `draft: true` in frontmatter. `hugo server -D` shows them
  locally; production build excludes them.
- Images: place in `static/images/` and reference as `/images/filename.jpg`.
  The photo strip on the homepage uses `<img>` tags inside `.photo-slot` divs.
- Do not edit files inside `public/` — it's the build output and gets
  overwritten on every build.
- All styles live in one file: `themes/dispatch/static/css/dispatch.css`.
  There is no CSS build pipeline. Edit that file directly.
- Hugo template errors surface clearly in `hugo server` output. Check the
  terminal before assuming a page is broken.
