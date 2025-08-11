---
layout: default
title: CLI Boilerplate
---

<style>
@keyframes typing {
  from { width: 0 }
  to { width: 100% }
}
@keyframes blink {
  50% { border-color: transparent }
}
.hero {
  font-family: monospace;
  font-size: 1.5rem;
  white-space: nowrap;
  overflow: hidden;
  border-right: 3px solid white;
  width: 0;
  animation:
    typing 3s steps(40, end) forwards,
    blink 1s step-end infinite;
  margin: 2rem 0;
  color: lime;
  background: black;
  padding: 1rem;
  border-radius: 6px;
  display: inline-block;
}

/* Dark mode toggle */
html.dark {
  filter: invert(1) hue-rotate(180deg);
}
.toggle-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
}
</style>

<div class="toggle-container">
  <label>
    <input type="checkbox" id="darkToggle" />
    🌙 Dark Mode
  </label>
</div>

<script>
  const toggle = document.getElementById('darkToggle');
  toggle.addEventListener('change', () => {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', toggle.checked);
  });
  if (localStorage.getItem('darkMode') === 'true') {
    toggle.checked = true;
    document.documentElement.classList.add('dark');
  }
</script>

<div class="hero">npx @greenarmor/cli-boilerplate</div>
# @greenarmor/cli-boilerplate

[![GitHub Pages](https://img.shields.io/badge/docs-online-success?logo=github&style=flat-square)](https://greenarmor.github.io/cli-boilerplate)

A fully-featured starter boilerplate for building and publishing your own CLI tools using Node.js + npm.

---

## Features

- Publish-ready scoped CLI
- `cli` global command and modular generators
- **AI chat command for natural-language scaffolding (dev-only)**
- `cli-bump` version bump tool
- `--dry-run` mode
- Git commit + tag + push
- Optional `npm publish`
- GitHub release note generation
- GitHub Releases automation
- Semantic release support
- Modular code generators for components, pages, hooks, layouts, services, contexts, styles, and tests
- Framework detection with per-framework templates and a `--framework` override
- Extensible through a plugin system
- Optional TypeScript templates via `--ts`
- Jest test suite for generators
- Banner, help menu, and badges
- Ideal for open-source CLI products
- DevOps-friendly automation for releases and scaffolding

---

## Quick Start

Choose the workflow that fits your needs.

### Use `cli` in an existing project

```bash
npm install -g @greenarmor/cli-boilerplate
cd path/to/your-existing-project
cli generate:component Button
```

The generators detect your framework and drop files into your project automatically.

### Rebrand and extend your own CLI

1. Set Git identity (optional but recommended):

```bash
git config --global user.name "your_github_username"
git config --global user.email "your_email@example.com"
```

2. Scaffold a new CLI:

```bash
npx @greenarmor/cli-boilerplate my-cli
```

3. (Optional) Include extras during creation:

- `--with-emoji` – show emoji-enhanced output
- `--full-stack` – add ESLint, Prettier, Husky, Lint-Staged, Jest, ZX, Inquirer, Update Notifier, and more CLI polish libraries

```bash
npx @greenarmor/cli-boilerplate my-cli --with-emoji --full-stack
```

4. Link and try your branded CLI:

```bash
cd my-cli
npm install
npm link
my-cli --help
```

---

## CLI Tooling

### AI Chat (dev only)

Chat with the CLI using natural language to run allowed generator commands.

```bash
npm run chat
# or
cli chat
```

Requires `OPENAI_API_KEY` in your local `.env` and is disabled when `NODE_ENV=production`.

### Generators

```bash
cli generate:component Button
cli generate:hook useAuth
cli generate:context Auth
```

Other supported generators:

- `page`
- `layout`
- `service`
- `style`
- `test`
- `context`

Use the `--ts` flag to scaffold TypeScript files.

### Version Bump

```bash
cli-bump
```

Supports patch/minor/major, changelog preview, optional push + publish, and `--dry-run`.

---

## GitHub Release Automation

```bash
export GITHUB_TOKEN=ghp_YourTokenHere
node scripts/release-to-github.js
```

---

## Semantic Release via CI

- Automated changelog
- GitHub Releases
- npm publishing

**Requirements:**

- `NPM_TOKEN` in GitHub Actions secrets
- `GITHUB_TOKEN` in GitHub Actions secrets

---

## License

**MIT** — Customize and distribute freely under your own CLI brand.

---

## Built by [@greenarmor](https://github.com/greenarmor)

