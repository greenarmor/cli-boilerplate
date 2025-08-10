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

export default function generateService(serviceName, framework) {
  const { services } = loadConfig();
  const dir = services.dir
    .replace(/__NAME__/g, serviceName)
    .replace(/__NAME_LOWER__/g, serviceName.toLowerCase());
  const filename = services.file
    .replace(/__NAME__/g, serviceName)
    .replace(/__NAME_LOWER__/g, serviceName.toLowerCase());
  const fullPath = path.join(dir, filename);

  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const template = loadTemplate(framework, 'service.js');
  const content = template
    .replace(/__NAME__/g, serviceName)
    .replace(/__NAME_LOWER__/g, serviceName.toLowerCase());

  fs.writeFileSync(fullPath, content);
  console.log(`Service created: ${fullPath}`);
}
