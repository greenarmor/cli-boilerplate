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

export default function generateComponent(componentName, framework) {
  const dir = `src/components/${componentName}`;
  const filename = `${componentName}.jsx`;
  const fullPath = path.join(dir, filename);

  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const template = loadTemplate(framework, 'component.jsx');
  const content = template
    .replace(/__NAME__/g, componentName)
    .replace(/__NAME_LOWER__/g, componentName.toLowerCase());

  fs.writeFileSync(fullPath, content);
  console.log(`Component created: ${fullPath}`);
}
