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

Build your own CLI tools with confidence.

## Quickstart

```bash
npx @greenarmor/cli-boilerplate
```

## Features

- Scoped CLI tool with global command
- Version bump helper with changelog
- Optional GitHub + npm publish
- Release note generator
- Semantic release-ready
- Banner and help menu support

## Publish

```bash
your-cli-bump
```

## Learn More

- [View on GitHub](https://github.com/greenarmor/cli-boilerplate)
- [npm Package](https://www.npmjs.com/package/@greenarmor/cli-boilerplate)

---
Made with ❤️ by Greenarmor
