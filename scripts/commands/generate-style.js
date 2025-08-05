import fs from 'fs';
import path from 'path';

export default function generateStyle(styleName) {
  const dir = `src/styles/${styleName}`;
  const filename = `${styleName}.module.css`;
  const fullPath = path.join(dir, filename);

  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const content = `.${styleName.toLowerCase()} {
  /* Add your styles here */
}
`;

  fs.writeFileSync(fullPath, content);
  console.log(`Style created: ${fullPath}`);
}
