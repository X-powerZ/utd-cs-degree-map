# UTD BS Computer Science Degree Map (2025–2026)

Interactive degree planner for the **UT Dallas** BS Computer Science course map. Explore prerequisites, mark completed courses, pick technical electives, and see what you’re eligible to take next.

**Live demo:** _(add your GitHub Pages URL after publishing — see below)_

## Features

- Eight-semester column layout based on the official 2025–2026 map
- Click a course to highlight prerequisite chains (yellow) and unlocks (red)
- Orange **\*** on courses whose prerequisites you’ve met
- Mark courses complete; progress saved in the browser (`localStorage`)
- Technical elective picker with catalog prereqs; fills open slots on the map
- Core curriculum notes and grade requirements (C or better default; \* = D- or better)

## Tech stack

HTML, CSS, vanilla JavaScript (ES modules), JSON data. No framework. `live-server` for local dev.

## Run locally

```bash
git clone https://github.com/YOUR_USERNAME/cs-degree-map.git
cd cs-degree-map
npm install
npm start
```

Open **http://127.0.0.1:8080** in your browser.

## Publish on GitHub Pages (free public URL)

This repo includes [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml). After you push to GitHub:

1. Repo **Settings** → **Pages**
2. **Build and deployment** → Source: **GitHub Actions**
3. Push to `main`; the workflow deploys the `src/` folder
4. Your site will be at `https://YOUR_USERNAME.github.io/cs-degree-map/`

## Project structure

```
src/
  index.html
  styles/main.css
  scripts/          # app logic
  data/             # courses.json, technical-electives.json
```

## License

MIT
