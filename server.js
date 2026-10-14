import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import reflection from './api/reflection.js';

try {
  const envText = await readFile(join(process.cwd(), '.env'), 'utf8');
  for (const line of envText.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2');
  }
} catch { /* .env is optional; local reflections work without it. */ }

const root = process.cwd();
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8' };
const server = http.createServer(async (req, res) => {
  if (req.url === '/api/reflection' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => { body += chunk; if (body.length > 4000) req.destroy(); });
    req.on('end', async () => {
      try {
        req.body = JSON.parse(body || '{}');
        const wrapper = { status(code) { res.statusCode = code; return this; }, json(value) { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(value)); } };
        await reflection(req, wrapper);
      } catch { res.statusCode = 400; res.end(JSON.stringify({ error: 'Invalid request' })); }
    });
    return;
  }
  const pathname = new URL(req.url, 'http://localhost').pathname;
  const allowedFiles = { '/': 'index.html', '/index.html': 'index.html', '/styles.css': 'styles.css', '/app.js': 'app.js' };
  const relative = allowedFiles[pathname];
  if (!relative) { res.writeHead(404); res.end('Not found'); return; }
  try {
    const file = await readFile(join(root, relative));
    res.writeHead(200, { 'Content-Type': mime[extname(relative)] || 'application/octet-stream' });
    res.end(file);
  } catch { res.writeHead(404); res.end('Not found'); }
});
const port = Number(process.env.PORT || 3000);
server.listen(port, () => console.log(`Saathi is running at http://localhost:${port}`));
