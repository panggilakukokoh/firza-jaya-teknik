import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

const port = Number(process.env.PORT || 3000);
const apiKey = process.env.BLUEPACK_API_KEY || process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY || process.env.OPENROUTER_API_KEY;
const provider = process.env.API_PROVIDER || (process.env.BLUEPACK_API_KEY ? 'bluepack' : 'anthropic');
const model = process.env.CLAUDE_MODEL || process.env.OPENROUTER_MODEL || 'claude-3-5-sonnet-latest';
const apiUrl = process.env.CLAUDE_API_URL || (provider === 'bluepack' ? 'https://api.bluepack.ai/v1/messages' : 'https://api.anthropic.com/v1/messages');

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

function getContentType(filePath) {
  return mimeTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function serveStatic(req, res) {
  let requestPath = req.url === '/' ? '/index.html' : req.url.split('?')[0];
  const safePath = path.normalize(requestPath).replace(/^([.][.][/\\])+/, '');
  const filePath = path.join(__dirname, safePath);

  if (!filePath.startsWith(__dirname)) {
    sendJson(res, 403, { error: 'Forbidden' });
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      sendJson(res, 404, { error: 'Not found' });
      return;
    }

    res.writeHead(200, { 'Content-Type': getContentType(filePath) });
    res.end(data);
  });
}

async function proxyClaude(req, res) {
  if (!apiKey) {
    sendJson(res, 500, { error: 'API key not configured. Set BLUEPACK_API_KEY or CLAUDE_API_KEY.' });
    return;
  }

  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', async () => {
    try {
      const payload = JSON.parse(body || '{}');
      const prompt = payload.prompt || 'Halo dari server deployment';
      const requestBody = provider === 'bluepack'
        ? JSON.stringify({
            model,
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 300,
          })
        : JSON.stringify({
            model,
            max_tokens: 300,
            messages: [{ role: 'user', content: prompt }],
          });

      const headers = {
        'Content-Type': 'application/json',
      };

      if (provider === 'bluepack') {
        headers.Authorization = `Bearer ${apiKey}`;
      } else {
        headers['x-api-key'] = apiKey;
        headers['anthropic-version'] = '2023-06-01';
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: requestBody,
      });

      const data = await response.json();
      if (!response.ok) {
        sendJson(res, response.status, { error: 'Upstream API request failed', details: data });
        return;
      }

      sendJson(res, 200, { ok: true, data });
    } catch (error) {
      sendJson(res, 500, { error: 'Failed to process request', details: error.message });
    }
  });
}

const server = createServer(async (req, res) => {
  if (req.url === '/health' && req.method === 'GET') {
    sendJson(res, 200, { ok: true, status: 'healthy' });
    return;
  }

  if (req.url === '/api/claude' && req.method === 'POST') {
    await proxyClaude(req, res);
    return;
  }

  if (req.method === 'GET') {
    serveStatic(req, res);
    return;
  }

  sendJson(res, 405, { error: 'Method not allowed' });
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Deployment server ready at http://0.0.0.0:${port}`);
});
