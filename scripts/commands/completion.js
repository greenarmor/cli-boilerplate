// Auto-completion support has been removed. These stubs are kept so the rest of
// the CLI can call the same functions without requiring the external `tabtab`
// dependency.

// Previously powered by `tabtab`. Now a no-op to avoid breaking consumers that
// might still attempt to trigger completion.
export function complete() {}

export async function install() {
  console.log(
    'Auto-completion is no longer supported. Use `cli completion manual` for a simple bash script.'
  );
}

export async function uninstall() {
  console.log('Auto-completion is no longer supported.');
}

// `tabtab.parseEnv` used to determine when completion should run. Without
// `tabtab`, always return an object that disables completion.
export function parseEnv() {
  return { complete: false };
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
