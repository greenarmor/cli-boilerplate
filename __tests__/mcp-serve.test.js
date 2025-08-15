import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

test('mcp:serve starts server and logs port', async () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const binPath = path.resolve(__dirname, '../bin/index.js');

  const proc = spawn('node', [binPath, 'mcp:serve'], {
    env: { ...process.env, NODE_ENV: 'development', MCP_PORT: '5599' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  let output = '';
  proc.stdout.on('data', (d) => {
    output += d.toString();
    if (output.includes('MCP server listening on 5599')) {
      proc.kill();
    }
  });

  await new Promise((resolve) => proc.on('close', resolve));

  expect(output).toContain('MCP server listening on 5599');
});
