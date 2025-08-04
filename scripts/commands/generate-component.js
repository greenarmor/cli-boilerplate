import fs from 'fs';
import path from 'path';

export default function generateComponent(componentName) {
  const dir = `src/components/${componentName}`;
  const filename = `${componentName}.jsx`;
  const fullPath = path.join(dir, filename);

  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const content = `export default function ${componentName}() {
  return <div>${componentName} component</div>;
}
`;

  fs.writeFileSync(fullPath, content);
  console.log(`Component created: ${fullPath}`);
}
