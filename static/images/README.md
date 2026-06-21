# Image Storage Guide

This directory stores all images for the K8CES website in a centralized location.

## Folder Structure

- **field-reports/** - Images for field report posts
- **photos/** - General photos and gallery images  
- **3d-designs/** - 3D design project images

## How to Reference Images

In your Markdown files (posts, pages), reference images using the absolute path from the web root:

```markdown
![Alt text](/images/field-reports/my-image.jpg)
![Alt text](/images/photos/my-photo.png)
![Alt text](/images/3d-designs/project-screenshot.png)
```

### Example in a Post

```markdown
---
title: "My Field Report"
---

This is my field report.

![Setup at K/LC-17](/images/field-reports/setup-lc17.jpg)

The antenna worked great!
```

## Batch Importing Images

To batch import images:

1. **Copy images to appropriate folders:**
   ```bash
   # Copy multiple images to field-reports folder
   cp /path/to/images/*.jpg static/images/field-reports/

   # Or from this repository
   cp ~/Downloads/field-photos/*.{jpg,png} static/images/field-reports/
   ```

2. **From the repository root:**
   ```bash
   # Copy and organize multiple images
   cp ~/Pictures/my-event-*.jpg static/images/field-reports/
   ```

3. **Windows Explorer / File Manager:**
   - Navigate to `static/images/[category]/`
   - Drag and drop your images directly into the folder

## File Naming Best Practices

- Use lowercase with hyphens: `park-activation-2024.jpg`
- Be descriptive: `k-lc-17-setup.jpg` not `img001.jpg`
- Include date if relevant: `2024-06-21-pota-activation.jpg`

## Supported Formats

- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)
- SVG (.svg)

## Tips

- Keep filenames short but descriptive (helps with SEO)
- Use appropriate folder to keep things organized
- Images are served statically for better performance
- Consider optimizing images before uploading for faster load times
