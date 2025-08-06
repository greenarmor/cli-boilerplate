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
    await tabtab.install({ name: 'cli', completer: 'cli' });
    console.log('Auto-completion installed. Restart your shell.');
  } catch (err) {
    console.error('Error installing auto-completion:', err.message);
  }
}

export async function uninstall() {
  try {
    await tabtab.uninstall({ name: 'cli' });
    console.log('Auto-completion uninstalled.');
  } catch (err) {
    console.error('Error uninstalling auto-completion:', err.message);
  }
}

export function parseEnv(env = process.env) {
  return tabtab.parseEnv(env);
}
