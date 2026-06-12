# AGENTS.md

## Commands

- **Dev server**: `pnpm run dev` (runs `hugo server`)
- **Production build**: `hugo --environment production --minify` (outputs to `docs/`)
- **Install**: `pnpm install` (`.npmrc` sets `node-linker=hoisted` for Tailwind/PostCSS compat)
- **No tests, no lint, no typecheck** — the `package.json` `test` script is a stub

## Architecture

**Hugo static site** with a **completely custom theme** (no third-party Hugo theme). All templates in `layouts/` are hand-written.

### Key structural facts

- **Bilingual** (en/es): content uses `.es.md` suffix for Spanish versions; `i18n/en.yaml` + `i18n/es.yaml` are the only active translation files (the other 9 in `i18n/` are unused)
- **Tailwind v3** processed via Hugo Pipes (PostCSS pipeline). Config in `tailwind.config.js` with custom HUD colors (cyan `#0ea5e9`, purple `#8a2be2`) and dark mode via `class` strategy
- **Dark-first**: `<html class="dark">` hardcoded in `baseof.html`
- **Custom font fallbacks** with `size-adjust`/`ascent-override` in `assets/css/tailwind.css` to eliminate CLS
- **Markdown**: Goldmark with `unsafe: true` (raw HTML allowed); Chroma syntax highlighting with `noClasses: false`
- **Taxonomies disabled**: `disableKinds: [taxonomy, term]` in config
- **No Hugo modules** except `github.com/deining/hugo-mod-font-awesome-scss`
- **Google Analytics**: `G-ZSRN0E5HWF`; **Disqus**: `juaning`

### Content

- Posts: `content/post/YYYY/YYYY-MM-DD-slug.md` (organized by year)
- Portfolio: `content/portfolio/` (markdown per case study)
- Add Spanish translation: create `<slug>.es.md` alongside the English original
- Both `_index.md` and `_index.es.md` exist for section landing pages

### Deployment

- GitHub Pages serves from `docs/` on `main` branch
- `config/production/config.yaml` overrides `publishDir: docs`
- `docs/page` is gitignored (GitHub Pages can't serve paginated paths)
- Deploy: production build → `git add docs/` → commit → push

### Quirks

- `postinstall` script in `package.json` creates a tiny PostCSS CLI shim (workaround for a Node resolution edge case)
- No `.github/` CI workflows exist — deployment is manual
- Contact form uses reCAPTCHA (configured via partials, not in config)
- Lighthouse audit results live in `/lighthouse/` (gitignored)
