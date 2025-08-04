# @greenarmor/cli-boilerplate
[![GitHub Pages](https://img.shields.io/badge/docs-online-success?logo=github&style=flat-square)](https://greenarmor.github.io/cli-boilerplate/)  


A fully-featured starter boilerplate for building and publishing your own CLI tools using Node.js + npm.

---

## Features

Publish-ready scoped CLI  
`boiler-cli` global command  
`boiler-cli-bump` version bump tool  
`--dry-run` mode  
Git commit + tag + push  
Optional `npm publish`  
GitHub release note generation  
GitHub Releases automation  
Semantic release support  
Banner, help menu, and badges  
Ideal for open-source CLI products

---

## Getting Started

```bash
git clone https://github.com/greenarmor/cli-boilerplate.git your-cli
cd your-cli
npm install
```

### Rename Your CLI Tool

Edit in `bin/index.js`:
```js
#!/usr/bin/env node
console.log("Hello from YOUR CLI!");
```

Update `package.json`:
```json
"name": "@your-org/your-cli",
"bin": {
  "your-cli": "bin/index.js",
  "your-cli-bump": "scripts/bump-cli.js"
}
```

Then install globally:

```bash
npm link
your-cli --help
```

---

## CLI Tooling

### Version Bump

```bash
your-cli-bump
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
- GitHub releases
- npm publishing
- Requires `NPM_TOKEN` and `GITHUB_TOKEN` in GitHub Actions secrets

---

## License

MIT — Customize and distribute freely under your own CLI brand.

---

## Built by [@greenarmor](https://github.com/greenarmor)


## Quick Start

To create a new CLI based on this boilerplate:

```bash
npx @greenarmor/cli-boilerplate create my-cli
```

### Optional Flags

- `--with-emoji`  
  Show emoji-enhanced output during creation.

- `--full-stack`  
  Add full-stack dev tools: ESLint, Prettier, Husky, Lint-Staged, Jest, ZX, Inquirer, Update Notifier, and CLI polish libraries.

```bash
npx @greenarmor/cli-boilerplate my-cli --with-emoji --full-stack
```

Then:

```bash
cd my-cli
npm install
npm link
my-cli --help
```
```bash
npx @greenarmor/cli-boilerplate create my-cli
```

To enable emoji output in terminal messages:

```bash
npx @greenarmor/cli-boilerplate create my-cli --with-emoji
```

Then:

```bash
cd my-cli
npm install
npm link
my-cli --help
```
