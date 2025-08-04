
#!/usr/bin/env node

// Modular CLI Merged: Help + Generators
import path from 'path';
import { fileURLToPath } from 'url';

// Dynamic import helper
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const command = args[0];
const subcommand = args[1];

// Handle --help or -h
if (args.includes('--help') || args.includes('-h') || !command) {
  console.log(`
@greenarmor/cli-boilerplate

Usage:
  boiler-cli <command> [options]

Commands:
  --help, -h           Show this help message
  boiler-cli-bump      Run interactive version bump (patch/minor/major)
  npm run changelog    Generate/update CHANGELOG.md from conventional commits
  init-cli.js <name>   Bootstrap a new CLI project

Generate Commands:
  generate:component <name>  Create new component
  generate:page <name>       Create new page
  generate:hook <name>       Create new hook
  generate:layout <name>     Create new layout
  generate:service <name>    Create new service
  generate:style <name>      Create new style
  generate:test <name>       Create new test

Examples:
  boiler-cli generate:component MyButton
  boiler-cli-bump
  npm run changelog
`);
  process.exit(0);
}

// Modular Generate Command Router
const generateRoutes = {
  'generate:component': 'generate-component.js',
  'generate:page': 'generate-page.js',
  'generate:hook': 'generate-hook.js',
  'generate:layout': 'generate-layout.js',
  'generate:service': 'generate-service.js',
  'generate:style': 'generate-style.js',
  'generate:test': 'generate-test.js',
};

if (command.startsWith('generate:')) {
  if (!subcommand) {
    console.error('Error: Name is required for generation.');
    process.exit(1);
  }

  const scriptName = generateRoutes[command];
  if (!scriptName) {
    console.error('Unknown generate command:', command);
    process.exit(1);
  }

  try {
    const generator = await import(`../scripts/commands/${scriptName}`);
    generator.default(subcommand);
  } catch (err) {
    console.error('Failed to load generator script:', err.message);
    process.exit(1);
  }

  process.exit(0);
}

// Default fallback
console.log('Your CLI logic goes here. Use --help to see usage.');
