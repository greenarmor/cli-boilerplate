import fs from 'fs';
import path from 'path';

export default function generateLayout(layoutName) {
  const dir = `src/layouts/${layoutName}`;
  const filename = `${layoutName}.jsx`;
  const fullPath = path.join(dir, filename);

  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const content = `export default function ${layoutName}({ children }) {
  return (
    <div className="${layoutName.toLowerCase()}-layout">
      <header>Header</header>
      <main>{children}</main>
      <footer>Footer</footer>
    </div>
  );
}
`;

  fs.writeFileSync(fullPath, content);
  console.log(`Layout created: ${fullPath}`);
}
