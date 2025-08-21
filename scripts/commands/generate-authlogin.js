import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadTemplate(framework, name) {
  const templatesDir = path.resolve(__dirname, '../../templates');
  let filePath = path.join(templatesDir, framework, 'auth', name);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(templatesDir, 'default', 'auth', name);
  }
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, 'utf8');
}

export default function generateAuthLogin(name, framework, useTs = false) {
  const authDir = path.resolve(process.cwd(), name || 'auth');
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  const files = ['server.js', 'client.js', 'schema.sql'];

  for (const file of files) {
    const content = loadTemplate(framework, file);
    if (content) {
      fs.writeFileSync(path.join(authDir, file), content);
    }
  }

  console.log(`Auth login files created in ${authDir}`);
}
