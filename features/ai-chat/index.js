import 'dotenv/config';
import readline from 'readline';
import { execSync } from 'child_process';
// If you use an LLM SDK, import it here (e.g., OpenAI official SDK or LangChain)
// import { ChatOpenAI } from 'langchain/chat_models/openai';
import { ALLOWED } from './allowlist.js';
import path from 'path';
import fs from 'fs';

export default function chat() {
  if (process.env.NODE_ENV === 'production') {
    console.error('AI chat is disabled in production.');
    process.exit(1);
  }

  const key = process.env.OPENAI_API_KEY;
  if (!key || key.trim() === '') {
    console.error('Missing OPENAI_API_KEY (set it in local .env for development).');
    process.exit(1);
  }

  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, prompt: 'AI> ' });
    console.log('Chat ready. Type instructions (e.g., "generate a context for auth"). Type "exit" to quit.');
    rl.prompt();

    rl.on('line', async (line) => {
      const input = (line || '').trim();
      if (!input) return rl.prompt();
      if (input.toLowerCase() === 'exit') { rl.close(); return; }

    try {
      // 1) Get intent from AI (stubbed here; wire to your LLM):
      // const openai = new ChatOpenAI({ openAIApiKey: key, temperature: 0.3 });
      // const result = await openai.call([ { role: 'user', content: input } ]);
      // const text = (result?.text || '').toLowerCase();
      const text = input.toLowerCase(); // Replace w/ AI output if using LLM

      // 2) Naive intent map (keep or replace w/ your structured parser)
      const candidates = [
        // scan commands
        { rx: /scan[: ]?init/,                cmd: () => ['scan:init'] },
        { rx: /scan(?:\s+(.*))?/,            cmd: (m) => ['scan', ...(m[1] ? m[1].trim().split(/\s+/) : [])] },

        // patch management
        { rx: /patch\s+apply\s+([\w.-]+\.patch)/, cmd: (m) => ['patch', 'apply', m[1]] },
        { rx: /patch\s+list/,               cmd: ()  => ['patch', 'list'] },
        { rx: /patch\s+clean/,              cmd: ()  => ['patch', 'clean'] },

        // other root commands
        { rx: /bump/,                       cmd: ()  => ['bump'] },
        { rx: /changelog/,                  cmd: ()  => ['changelog'] },
        { rx: /completion(?:\s+(uninstall|manual))?/, cmd: (m) => ['completion', ...(m[1] ? [m[1]] : [])] },
        { rx: /mcp.*serve/,                 cmd: ()  => ['mcp:serve'] },
        { rx: /rag[: ]?index(?:\s+(.*))?/,  cmd: (m) => ['rag:index', ...(m[1] ? m[1].trim().split(/\s+/) : [])] },
        { rx: /rag[: ]?query(?:\s+(.*))?/,  cmd: (m) => ['rag:query', ...(m[1] ? m[1].trim().split(/\s+/) : [])] },

        { rx: /generate.*context.*\b(\w+)/, cmd: (m) => ['generate:context', m[1]] },
        { rx: /generate.*store.*\b(\w+)/,   cmd: (m) => ['generate:store', m[1]] },
        { rx: /env/,                        cmd: ()  => ['generate:env']        },
        { rx: /middleware.*\b(\w+)/,        cmd: (m) => ['generate:middleware', m[1]] },
        { rx: /api.*\b(\w+)/,               cmd: (m) => ['generate:api', m[1]] },
        { rx: /config.*\b([\w.-]+\.js)/,    cmd: (m) => ['generate:config', m[1]] },
        { rx: /component.*\b(\w+)/,         cmd: (m) => ['generate:component', m[1]] },
        { rx: /page.*\b(\w+)/,              cmd: (m) => ['generate:page', m[1]] },
        { rx: /hook.*\b(\w+)/,              cmd: (m) => ['generate:hook', m[1]] },
        { rx: /layout.*\b(\w+)/,            cmd: (m) => ['generate:layout', m[1]] },
        { rx: /service.*\b(\w+)/,           cmd: (m) => ['generate:service', m[1]] },
        { rx: /style.*\b(\w+)/,             cmd: (m) => ['generate:style', m[1]] },
        { rx: /test.*\b(\w+)/,              cmd: (m) => ['generate:test', m[1]] }
      ];

      let task = null;
      for (const c of candidates) {
        const m = text.match(c.rx);
        if (m) { task = c.cmd(m); break; }
      }

      if (!task) {
        console.log("AI didn't map to a known command. Try e.g. 'generate component Button'.");
        return rl.prompt();
      }

      const [cmdName, ...args] = task;

      // 3) Allowlist check
      if (!ALLOWED.has(cmdName)) {
        console.error('Blocked non-allowed command:', cmdName);
        return rl.prompt();
      }

      // 4) Safety checks
      // Generators already write under src/, so ensure that directory exists
      const safeRoot = path.resolve(process.cwd(), 'src');
      if (!fs.existsSync(safeRoot)) fs.mkdirSync(safeRoot, { recursive: true });

      // Patch apply: enforce file lives in patches/
      if (cmdName === 'patch' && args[0] === 'apply') {
        const patchesRoot = path.resolve(process.cwd(), 'patches');
        const patchFile = path.resolve(patchesRoot, args[1] || '');
        if (!patchFile.startsWith(patchesRoot) || !fs.existsSync(patchFile)) {
          console.error('Patch file must exist inside patches/');
          return rl.prompt();
        }
      }

      // 5) Execute
      const full = args.length ? `boiler-cli ${cmdName} ${args.join(' ')}` : `boiler-cli ${cmdName}`;
      console.log('[Running]:', full);
      const out = execSync(full).toString();
      console.log(out);
    } catch (err) {
      console.error('[ERROR]', err?.message || err);
    }
    rl.prompt();
  }).on('close', () => {
    console.log('Bye.');
    resolve();
  });
  });
}
