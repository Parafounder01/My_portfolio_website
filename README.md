# Anantha Kumar M R — Terminal CLI Portfolio

Static HTML/CSS/JS portfolio. No framework, no build step, no dependencies.

## Live

- Live site: https://parafounder01.github.io/My_portfolio_website/
- Local preview: http://localhost:8080/

## Run / preview

```powershell
# any static server from this folder, e.g:
python -m http.server 8080
# then open http://localhost:8080/
```

There is no `npm install` / `npm run build`. The production output is the folder
itself (`index.html` + `styles.css` + `script.js` + `images/` + `resume/`).

## Where content is edited

- `index.html` — all copy: hero, about, skills, experience, projects, education, contact.
- `styles.css` — design tokens in `:root`, layout, hero composition, responsive rules.
- `script.js` — nav toggle, active section, project filter, terminal command registry
  (`COMMANDS`), copy-email, scroll reveal. Contact constants (`EMAIL`, `PHONE`,
  `GITHUB`, `CV_PATH`) are at the top of the file.
- Terminal commands are defined once in `COMMANDS` in `script.js`.

## Assets

- Supplied portrait source filename: `background.png` (1672×941, in repo root).
- Live portrait path: `images/anantha-background.png` (unchanged byte copy of the source).
- Referenced from HTML as relative URL `images/anantha-background.png`, so the site
  works under a domain root or a subdirectory.
- CV path: `resume/anantha-kumar-cv.pdf` (downloaded as `Anantha_Kumar_CV.pdf`).
  **Status: not yet supplied — `resume/` is empty.** The site `fetch(HEAD)`-checks
  the PDF at load; all `[ DOWNLOAD CV ]` / CV links auto-hide when it is missing,
  and the terminal `resume` command returns
  "Resume file is not available here. Please contact me by email."
  To enable CV links, copy the real PDF to `resume/anantha-kumar-cv.pdf`.

## Hero crop / overlay tuning (`styles.css`)

- Breakpoint: `@media (max-width:1100px)` — stacked layout below 1100px,
  full-bleed background composition at 1100px and wider.
- Desktop: `.hero-media img { object-position: var(--photo-position-desktop) }`
  (`center top`); content column `.hero-copy { max-width: 520px; width: 44% }`.
- Mobile: `.hero-media { aspect-ratio: 16/9 }` (tablet), `4/3` below 768px;
  `object-position: var(--photo-position-mobile)` (`100% 0%`); left readability
  gradient disabled, bottom fade retained.
- Overlays: `.hero-cover` = single uniform `rgb(0 0 0 / var(--photo-cover-opacity))`
  with `--photo-cover-opacity: 0.40` (appears exactly once); `.hero-shade` is the
  localized left gradient; `.hero-fade` is the short bottom fade into `--color-bg`.

## Deployment

Upload the folder contents to any static host (GitHub Pages, Netlify, nginx, …).
Keep relative paths as-is so subdirectory hosting works. No environment variables
or server code required.

## Remaining inputs

- CV PDF (`resume/anantha-kumar-cv.pdf`) — missing.
- Public hosting target/URL — not configured; local preview only.
- Visual browser verification at mobile + desktop — not performed in this
  environment (no browser tooling); recommended before publishing.
