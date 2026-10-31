import { cp, mkdir, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = path.join(root, "dist");
await mkdir(output, { recursive: true });
// Publish only the generated public website, excluding briefs, docs and tooling.
for (const file of await readdir(root)) {
  if (file.endsWith(".html") || ["robots.txt", "sitemap.xml"].includes(file)) {
    await cp(path.join(root, file), path.join(output, file));
  }
}
await cp(path.join(root, "assets"), path.join(output, "assets"), {
  recursive: true,
});
console.log("Prepared static Vercel output in dist/.");
