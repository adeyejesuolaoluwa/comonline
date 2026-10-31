import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { setTimeout } from "node:timers/promises";

const config = JSON.parse(
  await readFile(new URL("../site.config.json", import.meta.url), "utf8"),
);
const base = new URL(config.url);
assert.equal(base.protocol, "https:");
const pages = [
  "index",
  "authors",
  "books",
  "what-we-write",
  "faq",
  "contact",
  "privacy",
  "terms",
  "404",
];
const checks = [
  ...pages.map((page) => ({ path: `${page}.html`, marker: '<main id="main"' })),
  { path: "assets/css/styles.css", marker: ".hero-book" },
  { path: "assets/js/app.js", marker: "IntersectionObserver" },
  { path: "assets/js/vendor/gsap.min.js", marker: "GSAP" },
  { path: "assets/js/vendor/ScrollTrigger.min.js", marker: "ScrollTrigger" },
  { path: "sitemap.xml", marker: new URL("books.html", base).href },
  { path: "robots.txt", marker: new URL("sitemap.xml", base).href },
  {
    path: "__production-check__/missing-page",
    status: 404,
    marker: '<base href="/">',
  },
];

async function verify(check) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const url = new URL(check.path, base);
      const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
      assert.equal(response.status, check.status ?? 200, `${url}: HTTP status`);
      const text = await response.text();
      assert.ok(
        text.includes(check.marker),
        `${url}: expected content missing`,
      );
      if (check.path === "index.html") {
        assert.ok(
          text.includes(`<link rel="canonical" href="${base.href}"`),
          "Production canonical URL is incorrect",
        );
      }
      console.log(`PASS ${response.status} ${url}`);
      return;
    } catch (error) {
      if (attempt === 1) throw error;
      await setTimeout(1000);
    }
  }
}

const results = await Promise.allSettled(checks.map(verify));
const failures = results.filter((result) => result.status === "rejected");
for (const failure of failures) console.error(failure.reason.message);
if (failures.length) process.exitCode = 1;
else console.log(`PASS: ${checks.length} production HTTP/content checks.`);
