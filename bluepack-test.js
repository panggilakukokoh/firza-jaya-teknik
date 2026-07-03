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

const apiKey = process.env.BLUEPACK_API_KEY;
if (!apiKey) {
  console.error('Error: BLUEPACK_API_KEY is not set. Please add it to .env or your environment.');
  process.exit(1);
}

const urls = [
  'https://api.bluepack.ai/v1/messages',
  'https://api.bluepack.dev/v1/messages'
];

async function testBluepack() {
  for (const url of urls) {
    try {
      console.log(`Testing Bluepack endpoint: ${url}`);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-latest',
          messages: [{ role: 'user', content: 'Halo dari tes Bluepack API.' }],
          max_tokens: 50,
        }),
      });

      console.log(`Status: ${response.status}`);
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        console.log('Response data:', JSON.stringify(data, null, 2));
      } catch {
        console.log('Response text:', text);
      }

      if (response.ok) {
        return;
      }

      console.warn(`Endpoint ${url} returned HTTP ${response.status}. Trying next endpoint if available.`);
    } catch (error) {
      console.warn(`Failed to reach ${url}:`, error.message || error);
    }
  }

  console.error('Bluepack API test failed for all endpoints. Please check your network and API key.');
  process.exit(1);
}

await testBluepack();
