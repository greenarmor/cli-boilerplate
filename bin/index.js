#!/usr/bin/env node

// Modular CLI Merged: Help + Generators + Patch Manager
import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';
import handlePatchCommand from '../scripts/commands/patch-handler.js'; // ← added
import detectFramework from '../scripts/utils/detect-framework.js';
import loadPlugins from '../scripts/utils/plugin-loader.js';
import { complete, install as installCompletion, uninstall as uninstallCompletion, manual as manualCompletion, parseEnv as parseCompletionEnv } from '../scripts/commands/completion.js';

// Dynamic import helper
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Generate Command Map ──────────────────────────────────────────────────────
const generateRoutes = {
  'generate:component': 'generate-component.js',
  'generate:page': 'generate-page.js',
  'generate:hook': 'generate-hook.js',
  'generate:layout': 'generate-layout.js',
  'generate:service': 'generate-service.js',
  'generate:style': 'generate-style.js',
  'generate:test': 'generate-test.js',
  'generate:context': 'generate-context.js',
};

// Load plugins and merge provided commands
const pluginData = await loadPlugins();
Object.assign(generateRoutes, pluginData.generateRoutes);

// ── Auto-Completion Handling ───────────────────────────────────────────────────
const completionEnv = parseCompletionEnv();
const rootCommands = [
  ...new Set([
    ...Object.keys(generateRoutes),
    'patch',
    'changelog',
    'completion',
    'chat',
    'mcp:serve',
    'rag:index',
    'rag:query',
    ...(pluginData.rootCommands || []),
  ]),
];
if (completionEnv.complete) {
  complete(completionEnv, rootCommands);
  process.exit(0);
}

const args = process.argv.slice(2);

const command = args[0];
const subcommand = args[1];

// Guard dev-only commands when in production
const isProd = process.env.NODE_ENV === 'production';
const DEV_ONLY = new Set(['chat', 'mcp:serve', 'rag:index', 'rag:query']);

if (DEV_ONLY.has(command) && isProd) {
  console.error('This command is disabled in production. Run locally or in a dev/CI context.');
  process.exit(1);
}

// Optional --framework flag override
let frameworkOverride;
const fwIndex = args.findIndex((a) => a === '--framework' || a === '-f');
if (fwIndex !== -1) {
  frameworkOverride = args[fwIndex + 1];
  args.splice(fwIndex, 2);
}

// Optional --ts flag to generate TypeScript files
const tsIndex = args.indexOf('--ts');
const useTs = tsIndex !== -1;
if (useTs) args.splice(tsIndex, 1);

// Completion install/uninstall
if (command === 'completion') {
  if (subcommand === 'uninstall') {
    await uninstallCompletion();
  } else if (subcommand === 'manual') {
    manualCompletion(rootCommands);
  } else {
    await installCompletion();
  }
  process.exit(0);
}

// Handle --help or -h
if (args.includes('--help') || args.includes('-h') || !command) {
  console.log(`
@greenarmor/cli-boilerplate

Usage:
  cli <command> [options]

Commands:
  --help, -h                 Show this help message
  cli completion manual     Output bash completion script
  cli-bump                   Run interactive version bump (patch/minor/major)
  cli changelog              Generate/update CHANGELOG.md from conventional commits
  init-cli.js <name>         Bootstrap a new CLI project

Generate Commands:
  generate:component <name>  Create new component
  generate:page <name>       Create new page
  generate:hook <name>       Create new hook
  generate:layout <name>     Create new layout
  generate:service <name>    Create new service
  generate:style <name>      Create new style
  generate:test <name>       Create new test
  generate:context <name>    Create new context

Patch Commands:
  patch list                 List available patches in /patches
  patch apply <file.patch>   Apply a patch from /patches
  patch clean                Delete all patches in /patches (keeps README.md)

Examples:
  cli generate:component MyButton
  cli generate:component MyButton --ts
  cli patch list
  cli patch apply readme-fix.patch
  cli-bump
  cli changelog
`);
  process.exit(0);
}

// Dev-only AI chat command (lazy-loaded)
if (command === 'chat') {
  const { default: chat } = await import('../features/ai-chat/index.js');
  await chat();
  process.exit(0);
}

// ── Modular Generate Command Router ───────────────────────────────────────────
if (command && command.startsWith('generate:')) {
  if (!subcommand) {
    console.error('Error: Name is required for generation.');
    process.exit(1);
  }

  const scriptName = generateRoutes[command];
  if (!scriptName) {
    console.error('Unknown generate command:', command);
    process.exit(1);
  }

  // Detect framework or use override
  let framework = frameworkOverride || detectFramework();
  if (!framework) {
    console.warn('Unable to detect framework. Falling back to "react".');
    framework = 'react';
  }

  try {
    const generator = await import(`../scripts/commands/${scriptName}`);
    generator.default(subcommand, framework, useTs);
  } catch (err) {
    console.error('Failed to load generator script:', err.message);
    process.exit(1);
  }

  process.exit(0);
}

// ── Patch Command Router ─────────────────────────────────────────────────────
if (command === 'patch') {
  const patchCmd = args[1];     // apply | clean | list
  const patchFile = args[2];    // filename.patch (if needed)

  if (!patchCmd) {
    console.error('Usage: cli patch <apply|list|clean> [file.patch]');
    process.exit(1);
  }

  handlePatchCommand(patchCmd, patchFile);
  process.exit(0);
}

// ── Changelog Command ────────────────────────────────────────────────────────
if (command === 'changelog') {
  const scriptPath = path.resolve(__dirname, '../scripts/generate-changelog.js');
  const result = spawnSync('node', [scriptPath], { stdio: 'inherit' });
  process.exit(result.status ?? 0);
}

// Default fallback
console.error(`Unknown command: ${command}. Use --help to see usage.`);
process.exit(1);
