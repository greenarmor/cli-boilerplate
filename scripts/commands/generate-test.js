import fs from 'fs';
import path from 'path';

export default function generateTest(testName) {
  const dir = `src/__tests__/${testName}`;
  const filename = `${testName}.test.js`;
  const fullPath = path.join(dir, filename);

  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const content = `import { render, screen } from '@testing-library/react';
import ${testName} from '../components/${testName}/${testName}';

test('renders ${testName} component', () => {
  render(<${testName} />);
  const element = screen.getByText(/${testName} component/i);
  expect(element).toBeInTheDocument();
});
`;

  fs.writeFileSync(fullPath, content);
  console.log(`Test created: ${fullPath}`);
}
