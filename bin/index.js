#!/usr/bin/env node

const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
@greenarmor/cli-boilerplate 🛠

Usage:
  boiler-cli <command> [options]

Commands:
  --help, -h           Show this help message
  boiler-cli-bump      Run interactive version bump (patch/minor/major)
  npm run changelog    Generate/update CHANGELOG.md from conventional commits
  init-cli.js <name>   Bootstrap a new CLI project

Examples:
  boiler-cli --help
  boiler-cli-bump
  npm run changelog
`);
  process.exit(0);
}

console.log('🔧 Your CLI logic goes here. Use --help to see usage.');
