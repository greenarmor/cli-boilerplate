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

export default function generateLayout(layoutName, framework) {
  const { layouts } = loadConfig();
  const dir = layouts.dir
    .replace(/__NAME__/g, layoutName)
    .replace(/__NAME_LOWER__/g, layoutName.toLowerCase());
  const filename = layouts.file
    .replace(/__NAME__/g, layoutName)
    .replace(/__NAME_LOWER__/g, layoutName.toLowerCase());
  const fullPath = path.join(dir, filename);

  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const templateFileMap = {
    react: 'layout.jsx',
    vue: 'layout.vue',
    angular: 'layout.ts'
  };
  const template = loadTemplate(
    framework,
    templateFileMap[framework] || 'layout.jsx'
  );
  const content = template
    .replace(/__NAME__/g, layoutName)
    .replace(/__NAME_LOWER__/g, layoutName.toLowerCase());

  fs.writeFileSync(fullPath, content);
  console.log(`Layout created: ${fullPath}`);
}
