# @greenarmor/cli-boilerplate

[![GitHub Pages](https://img.shields.io/badge/docs-online-success?logo=github&style=flat-square)](https://greenarmor.github.io/cli-boilerplate)

> A fully-featured starter boilerplate for building and publishing your own CLI tools using Node.js + npm.

Use the prebuilt `cli` inside an existing web application, or rebrand this boilerplate to create your own CLI with extra automation tools. Rebranding aims to boost automation for web app development and is perfect for DevOps workflows.

---

## Features

- Publish-ready scoped CLI
- `cli` global command
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

## CLI Tooling

### Version Bump

```bash
cli-bump
```

Supports:

- Select bump type (patch, minor, major)
- Git log + changelog preview
- Optional GitHub push + npm publish
- GitHub release notes preview
- `--dry-run` support

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

### Framework-Aware Templates

Generators automatically select templates based on your project's framework. The CLI inspects your `package.json` for dependencies like React, Vue, or Angular and loads files from `templates/<framework>`. Override detection with the `--framework` flag:

```bash
cli generate:component Button --framework vue
```

If no framework is detected, the generators fall back to `templates/default`.

### Configuration

Generators read their output paths from `cli.config.json` in your project root. Omit the file to use defaults. Example:

```json
{
  "components": { "dir": "src/components/__NAME__", "file": "__NAME__.jsx" },
  "hooks": { "dir": "src/hooks", "file": "use__NAME__.js" }
}
```

### Plugins

Extend the CLI with plugins. Add module paths or package names to the `cli.plugins` array in your `package.json`. Each plugin should export an object with optional `generateRoutes` and `rootCommands` properties.

Example:

```json
{
  "cli": {
    "plugins": ["./plugins/my-plugin.js"]
  }
}
```


### Shell Auto-Completion

Enable tab-completion for commands, flags and patch files:

```bash
cli completion            # install completion for bash/zsh
cli completion uninstall  # remove completion
cli completion manual     # output simple bash completion script
```

After installation, restart your shell and type `cli ` followed by <kbd>Tab</kbd> to see suggestions.

### Testing

Run the Jest test suite to verify generators and templates:

```bash
npm test
```

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

## Built by [@greenarmor](https://github.com/greenarmor)
