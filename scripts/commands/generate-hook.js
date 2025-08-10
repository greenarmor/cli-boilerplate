import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import loadConfig from '../utils/load-config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadTemplate(framework, name) {
  const templatesDir = path.resolve(__dirname, '../../templates');
  let filePath = path.join(templatesDir, framework, name);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(templatesDir, 'default', name);
  }
  return fs.readFileSync(filePath, 'utf8');
}

export default function generateHook(hookName, framework, useTs = false) {
  const { hooks } = loadConfig();
  const dir = hooks.dir
    .replace(/__NAME__/g, hookName)
    .replace(/__NAME_LOWER__/g, hookName.toLowerCase());
  let filename = hooks.file
    .replace(/__NAME__/g, hookName)
    .replace(/__NAME_LOWER__/g, hookName.toLowerCase());
  if (useTs) {
    filename = filename.replace(/\.jsx$/, '.tsx').replace(/\.js$/, '.ts');
  }
  const fullPath = path.join(dir, filename);

  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const templateFileMap = {
    react: useTs ? 'hook.ts' : 'hook.js',
    vue: 'hook.js',
    angular: 'hook.ts'
  };
  const template = loadTemplate(
    framework,
    templateFileMap[framework] || (useTs ? 'hook.ts' : 'hook.js')
  );
  const content = template
    .replace(/__NAME__/g, hookName)
    .replace(/__NAME_LOWER__/g, hookName.toLowerCase());

  fs.writeFileSync(fullPath, content);
  console.log(`Hook created: ${fullPath}`);
}
