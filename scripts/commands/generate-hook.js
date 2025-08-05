import fs from 'fs';
import path from 'path';

export default function generateHook(hookName) {
  const filename = `use${hookName}.js`;
  const dir = `src/hooks`;
  const fullPath = path.join(dir, filename);

  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const content = `import { useState, useEffect } from 'react';

export function use${hookName}() {
  const [state, setState] = useState(null);

  useEffect(() => {
    // TODO: implement hook logic
  }, []);

  return state;
}
`;

  fs.writeFileSync(fullPath, content);
  console.log(`Hook created: ${fullPath}`);
}
