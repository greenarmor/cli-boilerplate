import fs from 'fs';
import path from 'path';

export default function generateService(serviceName) {
  const filename = `${serviceName}.js`;
  const dir = `src/services`;
  const fullPath = path.join(dir, filename);

  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const content = `export const ${serviceName} = {
  async fetchData() {
    // TODO: Implement fetch logic
    return Promise.resolve('data');
  }
};
`;

  fs.writeFileSync(fullPath, content);
  console.log(`Service created: ${fullPath}`);
}
