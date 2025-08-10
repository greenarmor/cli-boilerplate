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

export default function generateStyle(styleName, framework) {
  const { styles } = loadConfig();
  const dir = styles.dir
    .replace(/__NAME__/g, styleName)
    .replace(/__NAME_LOWER__/g, styleName.toLowerCase());
  const filename = styles.file
    .replace(/__NAME__/g, styleName)
    .replace(/__NAME_LOWER__/g, styleName.toLowerCase());
  const fullPath = path.join(dir, filename);

  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const templateFileMap = {
    react: 'style.css',
    vue: 'style.css',
    angular: 'style.css'
  };
  const template = loadTemplate(
    framework,
    templateFileMap[framework] || 'style.css'
  );
  const content = template
    .replace(/__NAME__/g, styleName)
    .replace(/__NAME_LOWER__/g, styleName.toLowerCase());

  fs.writeFileSync(fullPath, content);
  console.log(`Style created: ${fullPath}`);
}
