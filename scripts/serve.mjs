import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(fileURLToPath(new URL("../", import.meta.url)));
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
  ".txt": "text/plain",
};
const port = Number(process.env.PORT || 8000);
const config = JSON.parse(
  await readFile(path.join(root, "site.config.json"), "utf8"),
);
const prefix = new URL(config.url).pathname;
http
  .createServer(async (req, res) => {
    try {
      let requested = decodeURIComponent(
        new URL(req.url, "http://localhost").pathname,
      );
      if (prefix !== "/" && requested.startsWith(prefix))
        requested = "/" + requested.slice(prefix.length);
      let target = path.resolve(root, `.${requested}`);
      if (target !== root && !target.startsWith(root + path.sep)) {
        res.writeHead(403);
        res.end();
        return;
      }
      const relative = path.relative(root, target).replaceAll("\\", "/");
      if (
        relative &&
        !/^(assets\/|[a-z0-9-]+\.(html|xml|txt)$)/.test(relative)
      ) {
        res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
        res.end(await readFile(path.join(root, "404.html")));
        return;
      }
      try {
        if ((await stat(target)).isDirectory())
          target = path.join(target, "index.html");
      } catch {
        target = path.join(root, "404.html");
        res.statusCode = 404;
      }
      res.setHeader(
        "Content-Type",
        types[path.extname(target)] || "application/octet-stream",
      );
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.end(await readFile(target));
    } catch {
      res.writeHead(400);
      res.end("Bad request");
    }
  })
  .listen(port, "127.0.0.1", () =>
    console.log(`Preview: http://127.0.0.1:${port}`),
  );
