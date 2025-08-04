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

- A fully-featured starter boilerplate for building and publishing your own CLI tools using Node.js + npm.

---

## Features

- Publish-ready scoped CLI
- `boiler-cli` global command
- `boiler-cli-bump` version bump tool
- `--dry-run` mode
- Git commit + tag + push
- Optional `npm publish`
- GitHub release note generation
- GitHub Releases automation
- Semantic release support
- Banner, help menu, and badges
- Ideal for open-source CLI products

---

## CLI Tooling

### Version Bump

```bash
boiler-cli-bump
```

Supports:

- Select bump type (patch, minor, major)
- Git log + changelog preview
- Optional GitHub push + npm publish
- GitHub release notes preview
- `--dry-run` support

---

## GitHub Release Automation

To create a release on GitHub:

```bash
export GITHUB_TOKEN=ghp_YourTokenHere
node scripts/release-to-github.js
```

---

## Semantic Release via CI

This project includes semantic-release support out of the box:

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

## Quick Start

To create a new CLI based on this boilerplate:

```bash
npm install -g @greenarmor/cli-boilerplate
```

### Set Git Identity Globally

```bash
git config --global user.name "your_github_username"
git config --global user.email "your_email@example.com"
```

### Create Your CLI

```bash
npx @greenarmor/cli-boilerplate my-cli
```

### Optional Flags

- `--with-emoji` 
  Show emoji-enhanced output during creation.

- `--full-stack`
  Add full-stack dev tools: ESLint, Prettier, Husky, Lint-Staged, Jest, ZX, Inquirer, Update Notifier, and CLI polish libraries.

```bash
npx @greenarmor/cli-boilerplate my-cli --with-emoji --full-stack
```

### Run It

```bash
cd my-cli
npm install
npm link
my-cli --help
```

---

## Built by [@greenarmor](https://github.com/greenarmor)
