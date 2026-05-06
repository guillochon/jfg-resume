# Resume Workflow (Resumx)

This repo uses [Resumx](https://resumx.dev/) as the only resume build workflow.

## Prerequisites

- Node.js + npm
- Playwright Chromium (for rendering)

## NASA ADS stats line (optional)

If you set **`ADS_KEY`** to your [NASA ADS API token](https://ui.adsabs.harvard.edu/user/settings/token), the build fetches NASA ADS metrics and renders a linked line below the contact line: **Publications: X (Y first author, Z citations, h-index H)** — X = all publications for the author query, Z = sum of ADS `citation_count` over **first-author** papers only, H = h-index computed from those first-author citation counts.

- **Local:** add a repo-root **`.env`** (gitignored) with `ADS_KEY=...`. Optional: `ADS_SEARCH_QUERY=...` (first-author query; default `author:"^Guillochon, J"`), `ADS_TOTAL_PUBLICATIONS_QUERY=...` (all-publications query; default `author:"Guillochon, J"`). The rendered line uses two links (total count → all-publications ADS search; parenthetical stats → first-author search), both sorted by citation count. Variables already set in your shell are not overwritten by `.env`.
- **GitHub Actions:** add **`ADS_KEY`** as either a **repository** secret or a secret on the **`github-pages`** environment (the build job uses that environment so environment secrets resolve). [`pages.yml`](.github/workflows/pages.yml) passes it into the build. Secrets are not available to workflows from forks.

Without a key, that line is omitted from the output.

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

