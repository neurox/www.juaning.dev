# Juaning.dev — Senior Engineering Portfolio

[cite_start]This repository contains the source code for **juaning.dev**, a professional portfolio engineered for credibility, clarity, and technical judgment[cite: 15, 16]. [cite_start]The site is built as a fast, secure static site using Hugo to prioritize performance and maintainability[cite: 111, 127].

## 🛠 Tech Stack
* **Framework:** [Hugo](https://gohugo.io/) (Static Site Generator).
* **Build Version:** `hugo v0.125.2` (Verified stable build).
* [cite_start]**Design System:** Professional, Minimal, and Discreet—avoiding "simplistic" or "empty" aesthetics[cite: 2, 17].
* [cite_start]**Architecture:** Structured narrative designed for senior positioning and quick scanning by technical leaders[cite: 29].

---

## 🏗 Installation & Setup

To ensure consistent builds, please use the Hugo version specified above.

### 1. Clone the Repository
Since this project uses Git submodules for the theme, clone the repository:

```bash
git clone https://github.com/neurox/www.juaning.dev.git
```

### 2. Submodule Management
If you have already cloned the project without the theme or need to update it:

Initialize and update the theme:

```bash
git submodule init
```
Update the theme to the latest remote version:

```bash
git submodule update
```

### 3. Local Development
Start the Hugo server to preview changes locally:

```bash
hugo server
```
The site will be live at http://localhost:1313.

### 4. Build
Generate the static site, the output will be in the `docs` folder.

```bash
hugo
```

### 🎨 Design System (Blueprint v2)
The site follows a "Quiet Confidence" visual language with a focus on engineering impact over decoration:

Colors: Deep Navy background (#0B0F1A), Soft White text (#E5E7EB), and Blue accents (#3B82F6).

Typography: Inter (Sans-serif) using a 48-56px H1 for the hero and 16-18px for body text.

Grid: 8px base unit with a generous 96px section separation for perceived quality.

Constraints: Max content width of 1100-1200px with a preferred reading width of 60-65ch for case studies.

### Content Structure

Hero: Role positioning as Senior Full-Stack Engineer specialized in Drupal & Backend Architecture.

Expertise: Focused on Backend (Multi-tenancy, RBAC), Platform Engineering (Drupal Modernization), and Cloud/DevOps (AWS, Docker).

Selected Work: Single-column editorial case studies highlighting Problem, Solution, and Impact.

How I Work: Engineering principles such as "Architecture before code" and "Maintainability over shortcuts".

### 📂 Project Structure

content/projects/: Markdown files for case studies following the editorial format.

content/writing/: Technical notes regarding RBAC, queue-driven architectures, and migrations.

assets/css/: Implementation of design tokens including colors, spacing, and typography.
