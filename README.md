# UTD BS Computer Science Degree Map (2025–2026)

An interactive web app that turns the UT Dallas BS Computer Science degree map into a planning tool. Students can track completed coursework, visualize prerequisite chains, and explore technical elective options in one place.

**[Live demo](https://x-powerz.github.io/utd-cs-degree-map/)** · **[Report an issue](https://github.com/X-powerZ/utd-cs-degree-map/issues)**

## Overview

The official degree map shows which courses belong in each semester, but it is static. This project recreates that layout as an interactive planner: click any course to see what it requires and what it unlocks, mark classes as done, and get a clear signal for what you are ready to take next.

Progress (completed courses, technical elective selections) is stored locally in the browser—no account or backend required.

## Features

- **Semester-by-semester layout** — Eight columns aligned with the 2025–2026 BS CS course map
- **Prerequisite highlighting** — Select a course to highlight upstream prerequisites (yellow) and downstream unlocks (red)
- **Readiness indicator** — Orange asterisk on courses whose trackable prerequisites are satisfied
- **Completion tracking** — Check off finished courses; state persists via `localStorage`
- **Technical electives** — Browse approved CS 4xxx electives with catalog prerequisites; assign choices to open elective slots on the map
- **Grade requirements** — C or better by default; courses marked with `*` require D- or better
- **Core curriculum reference** — Sidebar table for gen-ed categories (history, government, arts, etc.)

## How to use

1. Open the [live demo](https://x-powerz.github.io/utd-cs-degree-map/) or run locally (below).
2. Check boxes on courses you have already completed.
3. Look for the orange **\*** on courses you are eligible to take.
4. Click a course to inspect its prerequisite chain and unlocked follow-ups.
5. Pick technical electives from the sidebar list to fill open slots on the map.

Use **Reset progress** in the header to clear saved data.

## Tech stack

| Layer | Choice |
|-------|--------|
| Markup | HTML5 |
| Styling | CSS3 (flexbox, custom properties) |
| Logic | Vanilla JavaScript (ES modules) |
| Data | JSON (`courses.json`, `technical-electives.json`) |
| Dev server | [live-server](https://www.npmjs.com/package/live-server) |
| Hosting | GitHub Pages (GitHub Actions) |

No React, build step, or database—intentionally lightweight for fast load and simple deployment.

## Run locally

```bash
git clone https://github.com/X-powerZ/utd-cs-degree-map.git
cd utd-cs-degree-map
npm install
npm start
```

Then open **http://127.0.0.1:8080** in your browser.

## Project structure

```
src/
├── index.html
├── styles/
│   └── main.css
├── scripts/
│   ├── app.js           # UI, map rendering, interactions
│   ├── courseData.js    # Data loading
│   └── utils.js         # Prerequisite graph, eligibility, storage
└── data/
    ├── courses.json              # Degree map courses & layout
    └── technical-electives.json  # Approved technical electives
```

## Data & disclaimer

Course sequencing and prerequisites are based on the **UT Dallas BS Computer Science 2025–2026** degree map and related catalog information. This app is a student project and is **not** an official UT Dallas tool. Always confirm requirements with the [undergraduate catalog](https://catalog.utdallas.edu/) and your academic advisor before registering.

## License

MIT — see [LICENSE](LICENSE) if present, or use under MIT terms.
