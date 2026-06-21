# Adding Photos

Two places take photos, and they work a little differently.

---

## 1. The Photos page (`/photos/`)

A simple tile gallery of all your field/gear shots.

**To add a photo:** drop the image file into `content/photos/`.

That's it. The photo appears automatically as a tile, and the name plate
under it comes from the **filename**. So name the file how you want the
caption to read:

- `QMX Twins.jpg`  →  caption reads "QMX Twins"
- `Sleepy Hollow.jpg`  →  caption reads "Sleepy Hollow"

`.jpg`, `.JPG`, `.jpeg`, and `.png` all work. The site auto-shrinks big
photos, so you don't need to resize them first.

---

## 2. Photos on a 3D-design page (e.g. `/3d-designs/zippy-case/`)

Each design page has a **Gallery** at the bottom. The photos for it live in
a shared folder and are linked from the design's text file.

**Step 1 — put the image in the shared folder:**
`assets/images/3d-designs/`

**Step 2 — link it in the design's file** by adding the filename to the
`gallery:` list at the top of that design's `.md` file
(in `content/3d-designs/`).

Example — `content/3d-designs/zippy-case.md`:

```yaml
---
title: "Zippy Case"
description: "A protective case for your Zippy paddle."
date: 2026-01-27
gallery:
  - "Zippy case.jpg"
  - "Zippy case open.jpg"
---
```

Each `- "..."` line is one photo. Use the **exact filename** (including
capital letters and the extension) as it appears in
`assets/images/3d-designs/`. As with the Photos page, the name plate under
each photo comes from the filename.

To add another photo later, drop it in the folder and add one more
`- "filename.jpg"` line. To remove a photo from a design, just delete its
line — no need to delete the file (it can stay in the shared folder for use
by another design).

---

## Seeing your changes before publishing

Run the dev server and open <http://localhost:1313>:

```bash
hugo server -D
```

> **Heads up:** if you *add a new image* or a *new design page* while the
> dev server is already running, stop it (Ctrl+C) and start it again. Hugo
> reloads text edits fine, but is unreliable about brand-new files.

When it looks right, commit and push — the live site rebuilds on its own.
