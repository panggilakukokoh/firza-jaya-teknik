import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

function loadEnvFile() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    return;
  }

  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) continue;
    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, '');
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvFile();

const apiKey =
  process.env.CLAUDE_API_KEY ||
  process.env.ANTHROPIC_API_KEY ||
  process.env.BLUEPACK_API_KEY ||
  process.env.OPENROUTER_API_KEY;

const provider = process.env.API_PROVIDER || (process.env.BLUEPACK_API_KEY ? 'bluepack' : 'anthropic');
const model = process.env.CLAUDE_MODEL || process.env.OPENROUTER_MODEL || 'claude-3-5-sonnet-latest';
const prompt = process.env.TEST_PROMPT || 'Halo dari VSCode sample menggunakan Claude API';

if (!apiKey) {
  console.error('Error: set CLAUDE_API_KEY, ANTHROPIC_API_KEY, BLUEPACK_API_KEY, or OPENROUTER_API_KEY environment variable.');
  process.exit(1);
}

async function run() {
  const urls = [
    process.env.CLAUDE_API_URL,
    'https://api.anthropic.com/v1/messages',
    'https://api.bluepack.ai/v1/messages',
    'https://api.bluepack.dev/v1/messages',
  ].filter(Boolean);

  let lastError;
  for (const url of urls) {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };

      let body;
      if (provider === 'bluepack' || url.includes('bluepack')) {
        headers.Authorization = `Bearer ${apiKey}`;
        body = JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 300,
        });
      } else {
        headers['x-api-key'] = apiKey;
        headers['anthropic-version'] = '2023-06-01';
        body = JSON.stringify({
          model,
          max_tokens: 300,
          messages: [{ role: 'user', content: prompt }],
        });
      }

      const res = await fetch(url, {
        method: 'POST',
        headers,
        body,
      });

      const data = await res.json();
      if (!res.ok) {
        lastError = new Error(`Request failed (${res.status}) at ${url}: ${JSON.stringify(data)}`);
        continue;
      }

      console.log(JSON.stringify({ url, response: data }, null, 2));
      return;
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('No API endpoint worked.');
}

run().catch((err) => {
  console.error('Request failed:', err);
  process.exit(1);
});
