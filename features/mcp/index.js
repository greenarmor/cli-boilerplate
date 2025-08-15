import express from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { z } from 'zod';
import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

export default async function serve() {
  const app = express();
  app.use(express.json());

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const cliPath = path.resolve(__dirname, '../../bin/index.js');

  const server = new McpServer(
    { name: 'boilerplate-cli', version: '1.0.0' },
    { capabilities: { logging: {} } }
  );

  server.tool(
    'cli',
    'Run a boilerplate CLI command',
    z.object({ args: z.array(z.string()) }),
    async ({ args }) => {
      const result = spawnSync('node', [cliPath, ...args], {
        encoding: 'utf8',
      });
      return {
        content: [
          {
            type: 'text',
            text: (result.stdout || '') + (result.stderr || ''),
          },
        ],
      };
    }
  );

  app.post('/mcp', async (req, res) => {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
    res.on('close', () => {
      transport.close?.();
      server.close();
    });
  });

  const port = process.env.MCP_PORT || 5173;
  app.listen(port, () => {
    console.log(`MCP server listening on ${port}`);
  });
  await new Promise(() => {});
}
