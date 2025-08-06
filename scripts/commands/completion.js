import fs from 'fs';
import path from 'path';
import tabtab from 'tabtab';

const flagSuggestions = ['--help', '-h', '--framework', '-f'];

export function complete(env, commands) {
  if (env.last && env.last.startsWith('-')) {
    tabtab.log(flagSuggestions);
    return;
  }

  if (env.words === 1) {
    tabtab.log([
      ...commands.map((c) => ({ name: c })),
      ...flagSuggestions
    ]);
    return;
  }

  if (env.prev === 'patch') {
    tabtab.log(['apply', 'list', 'clean']);
    return;
  }

  if (env.prev === 'apply' && env.line.includes('patch')) {
    const patchesDir = path.resolve(process.cwd(), 'patches');
    if (fs.existsSync(patchesDir)) {
      const files = fs.readdirSync(patchesDir).filter(f => f.endsWith('.patch'));
      tabtab.log(files);
    }
    return;
  }
}

export async function install() {
  try {
    // Fallback to bash when SHELL is not defined (non-interactive environments)
    if (!process.env.SHELL) {
      process.env.SHELL = '/bin/bash';
    }

    // Use absolute path to current binary so completion works without global install
    const completer = path.resolve(process.argv[1] || 'cli');
    await tabtab.install({ name: 'cli', completer });
    console.log('Auto-completion installed. Restart your shell.');
  } catch (err) {
    console.error('Error installing auto-completion:', err.message);
  }
}

export async function uninstall() {
  try {
    if (!process.env.SHELL) {
      process.env.SHELL = '/bin/bash';
    }
    await tabtab.uninstall({ name: 'cli' });
    console.log('Auto-completion uninstalled.');
  } catch (err) {
    console.error('Error uninstalling auto-completion:', err.message);
  }
}

export function parseEnv(env = process.env) {
  return tabtab.parseEnv(env);
}

// Output a simple bash completion script for manual setup
export function manual(commands) {
  const script = `# bash completion for cli\n` +
  `_cli_completion() {\n` +
  `  local cur prev\n` +
  `  COMPREPLY=()\n` +
  `  cur="\${COMP_WORDS[COMP_CWORD]}"\n` +
  `  prev="\${COMP_WORDS[COMP_CWORD-1]}"\n` +
  `  if [[ \${COMP_CWORD} -eq 1 ]]; then\n` +
  `    COMPREPLY=( $(compgen -W "${commands.join(' ')}" -- "$cur") )\n` +
  `    return 0\n` +
  `  fi\n` +
  `  if [[ $prev == 'patch' ]]; then\n` +
  `    COMPREPLY=( $(compgen -W 'apply list clean' -- "$cur") )\n` +
  `    return 0\n` +
  `  fi\n` +
  `}\n` +
  `complete -F _cli_completion cli\n`;

  console.log(script);
}
