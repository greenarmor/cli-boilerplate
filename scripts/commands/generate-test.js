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

export default function generateTest(testName, framework, useTs = false) {
  const { tests } = loadConfig();
  const dir = tests.dir
    .replace(/__NAME__/g, testName)
    .replace(/__NAME_LOWER__/g, testName.toLowerCase());
  let filename = tests.file
    .replace(/__NAME__/g, testName)
    .replace(/__NAME_LOWER__/g, testName.toLowerCase());
  if (useTs) {
    filename = filename.replace(/\.test\.js$/, '.test.tsx');
  }
  const fullPath = path.join(dir, filename);

  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const templateFileMap = {
    react: useTs ? 'test.tsx' : 'test.js',
    vue: useTs ? 'test.tsx' : 'test.js',
    angular: 'test.ts'
  };
  const template = loadTemplate(
    framework,
    templateFileMap[framework] || (useTs ? 'test.tsx' : 'test.js')
  );
  const content = template
    .replace(/__NAME__/g, testName)
    .replace(/__NAME_LOWER__/g, testName.toLowerCase());

  fs.writeFileSync(fullPath, content);
  console.log(`Test created: ${fullPath}`);
}
