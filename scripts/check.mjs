import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../", import.meta.url));
const pages = (await readdir(root)).filter((file) => file.endsWith(".html"));
const config = JSON.parse(
  await readFile(path.join(root, "site.config.json"), "utf8"),
);
const prefix = new URL(config.url).pathname;
let links = 0;
for (const file of pages) {
  const html = await readFile(path.join(root, file), "utf8");
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${file}: one h1`);
  for (const marker of [
    "<title>",
    'name="description"',
    'rel="canonical"',
    'property="og:image"',
    "application/ld+json",
    "Skip to content",
    'id="main"',
  ])
    assert.ok(html.includes(marker), `${file}: missing ${marker}`);
  assert.ok(!html.includes("{{"), `${file}: unresolved token`);
  for (const [, image] of html.matchAll(/<img\b([^>]+)>/g))
    assert.ok(
      /\balt="[^"]*"/.test(image) &&
        /\bwidth="\d+"/.test(image) &&
        /\bheight="\d+"/.test(image),
      `${file}: image alt and dimensions`,
    );
  for (const [, json] of html.matchAll(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
  ))
    JSON.parse(json);
  for (const [, url] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^(https?:|mailto:|data:)/.test(url)) continue;
    let [target, hash] = url.split("#");
    if (target.startsWith(prefix))
      target = target.slice(prefix.length) || "index.html";
    const targetPath = path.join(root, target || file);
    assert.ok((await stat(targetPath)).isFile(), `${file}: missing ${url}`);
    if (hash && targetPath.endsWith(".html"))
      assert.ok(
        (await readFile(targetPath, "utf8")).includes(`id="${hash}"`),
        `${file}: missing fragment ${url}`,
      );
    links++;
  }
}
const css = await readFile(path.join(root, "assets/css/styles.css"), "utf8");
for (const [, url] of css.matchAll(/url\(['"]?([^'"\)]+)['"]?\)/g))
  assert.ok(
    (await stat(path.resolve(root, "assets/css", url))).isFile(),
    `Missing CSS asset ${url}`,
  );
const js = await readFile(path.join(root, "assets/js/app.js"), "utf8");
assert.ok(
  !js.includes("localStorage") &&
    !js.includes("setInterval") &&
    !js.includes("countdown"),
  "No obsolete runtime features",
);
console.log(
  `PASS: ${pages.length} pages; ${links} local links/assets; metadata, schema, image dimensions and CSS assets valid.`,
);
