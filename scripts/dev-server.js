const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', 'presentation-web');
const port = Number(process.env.PORT) || 4000;
const routes = {
  '/': 'index.html',
  '/game': 'public/game-host.html',
  '/admin': 'public/game-host.html',
  '/play': 'public/play.html'
};
const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.gif': 'image/gif',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.ico': 'image/x-icon'
};

http.createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
  const relative = routes[pathname] || pathname.replace(/^\/+/, '');
  const file = path.resolve(root, relative);
  if (file !== root && !file.startsWith(root + path.sep)) {
    response.writeHead(403).end('Forbidden');
    return;
  }
  fs.readFile(file, (error, body) => {
    if (error) {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
      return;
    }
    response.writeHead(200, { 'Content-Type': types[path.extname(file).toLowerCase()] || 'application/octet-stream' });
    response.end(body);
  });
}).listen(port, '0.0.0.0', () => {
  console.log(`HCM202 running at http://localhost:${port}`);
  console.log(`Host: http://localhost:${port}/game`);
  console.log(`Player: http://localhost:${port}/play`);
});
