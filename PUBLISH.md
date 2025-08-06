# 🚀 Publishing Guide for @greenarmor/cli-boilerplate

This guide walks you through bumping versions, pushing tags, and automating releases using the `cli-bump` tool.

---

## 🧪 Simulation: `cli-bump`

When you run:

```bash
cli-bump
```

You’ll see:

### 1. Prompt to select version bump

```
? Select the version bump type: (Use arrow keys)
❯ patch   (e.g., 1.0.0 → 1.0.1)
  minor   (e.g., 1.0.1 → 1.1.0)
  major   (e.g., 1.1.0 → 2.0.0)
```

### 2. Recent Git commit log

```
📋 Git Log Preview:

abcd123 chore: cleanup logs
a9f87cb feat: add new --version flag
e7a2d90 fix: typo in CLI help output
...
```

### 3. CHANGELOG.md preview

```
📄 CHANGELOG Preview:

# Changelog

## [1.1.0] - 2024-05-09
### Added
- support for --version
- config.json fallback
```

### 4. Confirmation

```
? Proceed with minor bump and push? (Y/n)
```

### 5. Result

```
v1.1.0
[main b74f891] chore(release): bump version to 1.1.0
 1 file changed, 1 insertion(+), 1 deletion(+)
 Pushed to origin/main
 Tag v1.1.0 pushed

✅ Version bump complete and pushed.
```

---

## ✅ What Happens After

- `package.json` is updated
- Git commit + tag is created
- Push to GitHub triggers:
  - `semantic-release`
  - Auto changelog
  - GitHub release
  - npm publish

---

## 📦 Manual Bump (if needed)

```bash
npm version patch -m "chore(release): bump version to %s"
git push && git push --tags
```

---

## 🔐 Don't Forget

Add the following secrets to your GitHub repo:

- `NPM_TOKEN` → from npmjs.com (Automation token)
- `GITHUB_TOKEN` → auto-injected by GitHub Actions

---

Happy CLI shipping! ✨
