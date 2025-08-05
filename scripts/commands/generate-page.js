import fs from 'fs';
import path from 'path';

export default function generatePage(pageName) {
  const dir = `src/pages/${pageName}`;
  const filename = `${pageName}.jsx`;
  const fullPath = path.join(dir, filename);

  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const content = `export default function ${pageName}() {
  return <main><h1>${pageName} Page</h1></main>;
}
`;

  fs.writeFileSync(fullPath, content);
  console.log(`Page created: ${fullPath}`);
}
