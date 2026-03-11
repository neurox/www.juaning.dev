# Juaning.dev — Senior Engineering Portfolio

<div align="center">
  <h3>⚡ Engineering Portfolio & Tech Blog</h3>
  <p>A high-performance, bilingual static site architected for speed, maintainability, and clean design.</p>
</div>

---

## 🎯 Architecture & Philosophy

This repository contains the source code for my professional portfolio, [juaning.dev](https://www.juaning.dev). Built as a static site using **Hugo**, the architecture prioritizes performance, security, and a frictionless developer experience. 

It is designed to reflect a "Quiet Confidence" visual language—focusing on engineering impact, typography, and content over unnecessary decoration.

### Core Tech Stack
- **Framework:** [Hugo](https://gohugo.io/) (Static Site Generator, utilizing `hugo-extended` for asset processing)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (Utility-first, responsive ecosystem)
- **Deployment:** GitHub Pages (served directly from the `docs/` production directory)
- **Content:** Markdown-first editorial workflow

## ✨ Key Technical Features
- **Bilingual i18n:** Full support for English (`/en/`) and Spanish (`/es/`) with synchronized sitemaps, RSS feeds, and seamless URL routing.
- **Environment Isolation:** Strict separation between local development (`localhost:1313`) and production builds, ensuring no local artifacts pollute live deployments.
- **Advanced Code Snippets:** Custom Javascript-injected "Copy Code" functionality, mathematically aligned to fluid padding boundaries for a pixel-perfect aesthetic across viewports.
- **Responsive Dark/Light Modes:** Seamless OS `prefers-color-scheme` media query support with unified Tailwind container integration.
- **SEO & OpenGraph:** Dynamically generated metadata, Twitter Cards, canonical URLs, and schema.

---

## 🏗️ Local Development

### Prerequisites
- [Hugo `extended`](https://gohugo.io/installation/) version (v0.125+ recommended for SCSS/Tailwind processing).
- Node.js & npm (for Tailwind and PostCSS).

### 1. Clone the Repository
Clone the project and navigate into the directory:

```bash
git clone https://github.com/neurox/www.juaning.dev.git
cd www.juaning.dev
```

### 2. Install Dependencies
Install Tailwind CSS, Autoprefixer, and related Node libraries:

```bash
npm install
```

### 3. Start the Development Server
Run the local Hugo server. This will watch for changes and provide live-reloading. The configuration will automatically default to the development environment.

```bash
npm run dev
# OR run Hugo directly:
hugo server -D
```
The site will be available at `http://localhost:1313/`.

---

## 🚀 Build & Deployment

This project uses an isolated configuration for production builds to ensure local URLs, Drafts, and LiveReload scripts are completely excluded from the public artifact.

### Generating the Production Build
To build the site for production:

```bash
hugo --environment production --minify
```
*Note: The production environment configuration (`config/production/config.yaml`) explicitly directs the final artifact into the `docs/` folder.*

### Deploying to GitHub Pages
Because GitHub Pages is configured to serve from the `/docs` folder on the `main` branch, deployment is as simple as committing the newly generated files:

```bash
git add docs/
git commit -m "chore: build production assets"
git push origin main
```

---

## 📂 Project Structure

- `assets/css/` — Core CSS, Tailwind directives, and responsive utilities.
- `assets/js/` — Client-side scripts (e.g., `copy-code.js`).
- `config/` — Environment-specific configuration mappings (development vs. production).
- `content/` — Markdown content files (`projects`, `writing`, and localized `.es.md` files).
- `layouts/` — Custom HTML templates, SEO partials, SVG icons, and shortcodes.
- `i18n/` — Translation dictionaries for English and Spanish strings.
- `docs/` — **(Auto-generated)** Production-ready static output served by GitHub Pages.
- `static/` — Static assets (images, fonts) copied directly to the output.
