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

export default function generatePage(pageName, framework, useTs = false) {
  const { pages } = loadConfig();
  const dir = pages.dir
    .replace(/__NAME__/g, pageName)
    .replace(/__NAME_LOWER__/g, pageName.toLowerCase());
  let filename = pages.file
    .replace(/__NAME__/g, pageName)
    .replace(/__NAME_LOWER__/g, pageName.toLowerCase());
  if (useTs) {
    filename = filename.replace(/\.jsx$/, '.tsx').replace(/\.js$/, '.ts');
  }
  const fullPath = path.join(dir, filename);

  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const templateFileMap = {
    react: useTs ? 'page.tsx' : 'page.jsx',
    vue: 'page.vue',
    angular: 'page.ts'
  };
  const template = loadTemplate(
    framework,
    templateFileMap[framework] || (useTs ? 'page.tsx' : 'page.jsx')
  );
  const content = template
    .replace(/__NAME__/g, pageName)
    .replace(/__NAME_LOWER__/g, pageName.toLowerCase());

  fs.writeFileSync(fullPath, content);
  console.log(`Page created: ${fullPath}`);
}
