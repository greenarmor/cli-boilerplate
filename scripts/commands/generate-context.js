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

export default function generateContext(contextName, framework) {
  const { contexts } = loadConfig();
  const dir = contexts.dir
    .replace(/__NAME__/g, contextName)
    .replace(/__NAME_LOWER__/g, contextName.toLowerCase());
  const filename = contexts.file
    .replace(/__NAME__/g, contextName)
    .replace(/__NAME_LOWER__/g, contextName.toLowerCase());
  const fullPath = path.join(dir, filename);

  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const templateFileMap = {
    react: 'context.js',
    vue: 'context.js',
    angular: 'context.ts'
  };
  const template = loadTemplate(
    framework,
    templateFileMap[framework] || 'context.js'
  );
  const content = template
    .replace(/__NAME__/g, contextName)
    .replace(/__NAME_LOWER__/g, contextName.toLowerCase());

  fs.writeFileSync(fullPath, content);
  console.log(`Context created: ${fullPath}`);
}
