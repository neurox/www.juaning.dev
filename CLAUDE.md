# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Install dependencies**: `pnpm install`
- **Dev server**: `pnpm run dev` (runs `hugo server`)
- **Production build**: `pnpm run build` (runs `hugo --gc --minify`)
- **Build with production config** (outputs to `docs/`): `hugo --environment production --minify`
- **Add new post**: `hugo new post/YYYY/YYYY-MM-DD-slug.md` (posts are organized by year)
- **Add translated post**: Create `<slug>.es.md` alongside the English version
- **Lighthouse audit results**: Check `/lighthouse/` directory

## Architecture

**Hugo static site** with a **completely custom theme** (no third-party Hugo theme). All templates and layouts live in `/layouts/` and are built from scratch.

### Key directories

- `layouts/` — All HTML templates:
  - `_default/baseof.html` — Base template with shared `<head>`, header, footer structure
  - `_default/single.html` — Single content page (posts, about, portfolio)
  - `_default/list.html` — Section listing pages (blog index, portfolio index)
  - `_default/rss.xml` — Custom RSS feed template
  - `partials/` — Reusable components (header, footer, head, social icons, SEO metadata, pagination, comments, theme-switcher, language-switcher)
  - `shortcodes/img.html` — Custom image shortcode
  - `page/contact.html` — Contact page template
  - `index.html` — Homepage template (overrides `_default/`)
- `assets/` — Processed by Hugo Pipes:
  - `css/` — Tailwind entrypoint (`tailwind.css`), Hugo-themed styles (`main.css`), dark/light variable sheets, syntax highlighting
  - `js/copy-code.js` — Client-side copy-to-clipboard for code blocks
- `content/` — Markdown content. Bilingual via `.es.md` suffix for Spanish versions
- `i18n/` — Translation dictionaries for 11 languages (en.yaml + es.yaml are the active ones)
- `config/` — Environment config (production overrides `publishDir: docs`)
- `static/` — Unprocessed assets (fonts, images, favicons, CV PDF)
- `data/social.yaml` — Social icon URL templates

### Content structure

Content uses Hugo's standard section-based organization:
- `content/post/YYYY/YYYY-MM-DD-slug.md` — Blog posts organized by year
- `content/portfolio/` — Portfolio case studies (drupal, umbraco, wordpress)
- `content/about.md` — About page
- `content/contact.md` — Contact page

Each content page has a corresponding `.es.md` version for Spanish.

### Key configuration

- `config.yaml` — Base config: bilingual setup (en/es), menu structure, social links, Google Analytics (`G-ZSRN0E5HWF`), Disqus (`juaning`), markup settings (Goldmark with unsafe renderer, Chroma syntax highlighting with `noClasses: false`)
- `tailwind.config.js` — Custom design tokens: HUD-themed colors (cyan `#0ea5e9`, purple `#8a2be2`), fonts (Inter, Geist, JetBrains Mono), dark mode via `class` strategy
- `postcss.config.js` — Tailwind + Autoprefixer pipeline
- `.gitignore` — Ignores `.DS_Store`, `*-bak`, `docs/page`

### Deployment

GitHub Pages serves from the `docs/` directory on the `main` branch. Production build outputs to `docs/` via `config/production/config.yaml`.

### Theming & design

- Dark-first: `<html class="dark">` in baseof.html, dark mode via `class` strategy
- Light/dark CSS variables in `assets/css/variables.css` and `assets/css/{light,dark}.css`
- Custom font fallbacks with `size-adjust`/`ascent-override` to eliminate CLS (in `assets/css/tailwind.css`)
- HUD-inspired visual style: glass cards, cyan accents, dark backgrounds
- No tests, no linting/formatting config in the repo
