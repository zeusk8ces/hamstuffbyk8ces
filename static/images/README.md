# Image Storage Guide

This directory stores static images for the K8CES website.

## Folder Structure

- **3d-designs/** - 3D design project images and screenshots

## How to Reference Images

In your Markdown files, reference images using the absolute path from the web root:

```markdown
![Alt text](/images/3d-designs/project-screenshot.png)
```

### Example in a Post

```markdown
---
title: "My 3D Design Project"
---

This is my project.

![Design Overview](/images/3d-designs/design-overview.jpg)

Details about the project...
```

## File Naming Best Practices

- Use lowercase with hyphens: `project-v2.jpg`
- Be descriptive: `antenna-bracket-design.jpg`
- Include version if relevant: `case-v3-assembled.png`

## Supported Formats

- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)
- SVG (.svg)

## Tips

- Keep filenames short but descriptive
- Consider optimizing images for web performance
- Images are served statically for better performance
