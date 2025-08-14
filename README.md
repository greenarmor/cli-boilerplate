# @greenarmor/cli-boilerplate

[![GitHub Pages](https://img.shields.io/badge/docs-online-success?logo=github&style=flat-square)](https://greenarmor.github.io/cli-boilerplate)

> A fully-featured starter boilerplate for building and publishing your own CLI tools using Node.js + npm.

Use the prebuilt `cli` inside an existing web application, or rebrand this boilerplate to create your own CLI with extra automation tools. Rebranding aims to boost automation for web app development and is perfect for DevOps workflows.

---

## Features

- Publish-ready scoped CLI
- `cli` global command and modular generators
- **AI chat command for natural-language scaffolding (dev-only)**
- `cli bump` version bump tool
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

2. Scaffold a new CLI, ready to receive more automation tools:

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

Requires `OPENAI_API_KEY` in your environment. Put the key in a `.env` or export it globally:

- **macOS/Linux:** `echo 'export OPENAI_API_KEY="sk-..."' >> ~/.bashrc && source ~/.bashrc`
- **Windows:** `setx OPENAI_API_KEY "sk-..."`

`NODE_ENV=production` disables chat mode.

### Generators

```bash
cli generate:component Button
cli generate:hook useAuth
cli generate:context Auth
```

Other supported generators:

- `page` – scaffold a new page component
- `layout` – create a layout template
- `service` – generate a service module
- `style` – add a stylesheet file
- `test` – create a test file
- `context` – create a context module

Run `cli --help` to see available generator commands.

Use the `--ts` flag to scaffold TypeScript files instead of JavaScript:

```bash
cli generate:component Button --ts
```

### Security Scanning

Run `cli scan:init` to generate a `.cli-scannersrc` file with sample scanner
definitions.

The `cli scan` command runs pluggable security tools. Register scanners under
`cli.scanners` in `package.json` or provide defaults in `.cli-scannersrc`.

**Install required scanners first (ZAP is not bundled):**

- **npm** – uses `npm audit` to inspect dependencies. Requires Node.js and npm
  (v7+) in your `PATH`.
- **OWASP ZAP** – dynamic application testing via `zap-baseline.py` or
  `zap.sh`. [Download ZAP](https://www.zaproxy.org/download/) or install with a
  package manager (`brew install zaproxy`) or Docker.

### `cli scan` usage

Run a registered scanner against a project directory or URL:

```bash
# run npm audit on the current project
cli scan --scanner npm --target .

# run OWASP ZAP against a URL, save an HTML report, and only show high issues
cli scan --scanner zap --target https://example.com \
  --report zap-report.html --severity high
```

Use `--report <file>` to write findings to a JSON or HTML report. The
`--severity <level>` flag filters results below the threshold (`info`, `low`,
`moderate`, `high`, `critical`).

Configure defaults or pass arguments per scanner in your project:

```jsonc
{
  "cli": {
    "scanners": {
      "npm": "./scripts/scanners/npm.js",
      "zap": "./scripts/scanners/zap.js"
    }
  },
  "scan": {
    "severity": "moderate",
    "zap": { "args": ["-r", "zap-report.html"] }
  }
}
```

#### CI/CD integration & security best practices

Include `cli scan` in CI pipelines to fail builds on severe vulnerabilities:

```bash
cli scan --scanner npm --severity high
```

Always scan only systems you own or have explicit permission to test.

### Version Bump

```bash
cli bump [--github-release] [-u] [-r <count>]
```

Supports:

- Select bump type (patch, minor, major)
- Git log + changelog preview
- Optional GitHub push + npm publish
- GitHub release notes preview (`-u` for Unreleased heading)
- Optional GitHub release (`--github-release`, requires `GITHUB_TOKEN`)
- `--dry-run` support

---

## GitHub Release Automation

To create a release on GitHub as part of the bump workflow:

```bash
export GITHUB_TOKEN=ghp_YourTokenHere
cli bump --github-release
```

This flag runs `scripts/release-to-github.js` after pushing commits and tags. You can also run the script directly if needed:

```bash
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

## Security & Environment

- This CLI is a **development tool**. Install as a devDependency and do **not** import it in app runtime.
- Add secrets locally in `.env` (never commit). Copy from `.env.example`.
- AI chat / RAG / MCP commands are disabled when `NODE_ENV=production`.
- CI uses GitHub **Secrets** (Settings → Secrets and variables → Actions).

### Deployment Safety Checklist

- [ ] `.env` ignored by git
- [ ] `OPENAI_API_KEY` only in local `.env` or CI secrets
- [ ] `NODE_ENV=production` for production workflows
- [ ] Dev-only commands (`chat`, `mcp:*`, `rag:*`) blocked in prod
- [ ] CLI installed as devDependency in app repos
- [ ] `.npmignore` / `export-ignore` exclude docs/examples/tests from npm
- [ ] CI avoids printing secrets; no echoing keys
- [ ] Allowed commands enforced for AI chat
- [ ] Writes constrained to `./src` for generators

---

## License

**MIT** — Customize and distribute freely under your own CLI brand.
