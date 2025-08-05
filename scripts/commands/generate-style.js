import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

export default function generateStyle(styleName, framework) {
  const dir = `src/styles/${styleName}`;
  const filename = `${styleName}.module.css`;
  const fullPath = path.join(dir, filename);

  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const template = loadTemplate(framework, 'style.css');
  const content = template
    .replace(/__NAME__/g, styleName)
    .replace(/__NAME_LOWER__/g, styleName.toLowerCase());

  fs.writeFileSync(fullPath, content);
  console.log(`Style created: ${fullPath}`);
}
