# Build Process

## How This Zine Is Built

1. **Design** → Created in [Penpot](https://app.penpot.app) using the file at `src/penpot/`
2. **Data** → Tool lists live in `src/data/tools.json` (single source of truth)
3. **Web** → Landing page at `web/index.html` fetches from `tools.json` dynamically
4. **PDF Export** → From Penpot, exported as PDF to `dist/*.pdf`
5. **QR Code** → Generated externally, points to GitHub Pages URL

## To Update the Zine

1. Edit `src/data/tools.json` with new tool additions/changes
2. Update the web page — it auto-refreshes from JSON
3. Re-open the Penpot file and update the visual text manually (syncs with JSON)
4. Re-export the PDF
5. Commit all changes
6. Tag a new release with semantic versioning

## Release Checklist

- [ ] Update version number in filenames
- [ ] Update CHANGELOG.md
- [ ] Run link checker (ensure all links still valid)
- [ ] Re-export PDF from Penpot
- [ ] Tag new GitHub release
- [ ] Update QR code URL only if base domain changes (usually static)
