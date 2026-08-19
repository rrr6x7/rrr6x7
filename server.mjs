import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const port = Number(process.env.PORT || 4173);
const root = process.cwd();
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
  let path = normalize(join(root, pathname));

  if (!path.startsWith(root)) {
    response.writeHead(403).end("Forbidden");
    return;
  }

  if (pathname === "/") path = join(root, "index.html");
  if (!existsSync(path) || statSync(path).isDirectory()) path = join(root, "index.html");

  response.setHeader("Content-Type", types[extname(path)] || "application/octet-stream");
  response.setHeader("Cache-Control", extname(path) === ".html" ? "no-cache" : "public, max-age=3600");
  createReadStream(path).pipe(response);
}).listen(port, "0.0.0.0", () => {
  console.log(`Marea is ready at http://0.0.0.0:${port}`);
});
