# Resume Workflow (Resumx)

This repo uses [Resumx](https://resumx.dev/) as the only resume build workflow.

## Prerequisites

- Node.js + npm
- Playwright Chromium (for rendering)

## Install

```powershell
npm install
npm run setup
```

## Edit and Build

- Edit [`resume.md`](resume.md)
- Build PDF + HTML:

```powershell
npm run build
```

Outputs are written to repo root:
- [`resume.pdf`](resume.pdf)
- [`index.html`](index.html)

## Live Preview

```powershell
npm run watch
```

While watching, Resumx writes `index.pdf` alongside `index.html` (shared basename). Run `npm run build` when you want the PDF saved as `resume.pdf`.

## GitHub Pages

This repo includes [`pages.yml`](.github/workflows/pages.yml) that:
- builds `index.html` and `resume.pdf`
- deploys them to GitHub Pages as `index.html` and `resume.pdf`

To enable it in GitHub:
1. Go to **Settings → Pages**
2. Under **Build and deployment**, choose **Source: GitHub Actions**
3. Push to `main` (or run the workflow manually)

