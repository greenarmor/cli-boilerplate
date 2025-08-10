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

export default function generateComponent(componentName, framework) {
  const { components } = loadConfig();
  const dir = components.dir
    .replace(/__NAME__/g, componentName)
    .replace(/__NAME_LOWER__/g, componentName.toLowerCase());
  const filename = components.file
    .replace(/__NAME__/g, componentName)
    .replace(/__NAME_LOWER__/g, componentName.toLowerCase());
  const fullPath = path.join(dir, filename);

  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const template = loadTemplate(framework, 'component.jsx');
  const content = template
    .replace(/__NAME__/g, componentName)
    .replace(/__NAME_LOWER__/g, componentName.toLowerCase());

  fs.writeFileSync(fullPath, content);
  console.log(`Component created: ${fullPath}`);
}
