import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = (name) => readFile(path.join(root, name), "utf8");
const config = JSON.parse(await read("site.config.json"));
const layout = await read("src/layout.html");
const pages = [
  [
    "index",
    "Home",
    "Living with Bipolar — A memoir by P.J. Ray",
    "A personal story of life before diagnosis, a breakdown, and the work of rebuilding. Discover Living with Bipolar, a memoir by P.J. Ray.",
  ],
  [
    "authors",
    "The author",
    "About P.J. Ray — Living with Bipolar",
    "Meet P.J. Ray, author of Living with Bipolar. From the Berkshire countryside to a career as a chef and business owner, discover the life behind the memoir.",
  ],
  [
    "books",
    "The book",
    "The book — Living with Bipolar by P.J. Ray",
    "Explore Living with Bipolar by P.J. Ray. Read the synopsis, discover the paperback details, and find the memoir on Amazon.",
  ],
  [
    "what-we-write",
    "The story",
    "The story behind Living with Bipolar — P.J. Ray",
    "Explore the themes of Living with Bipolar: undiagnosed illness, the impact on a life and its relationships, and the personal work of recovery.",
  ],
  [
    "faq",
    "Questions",
    "Your questions — Living with Bipolar",
    "Answers about Living with Bipolar, its author P.J. Ray, paperback details, purchasing on Amazon, and getting in touch.",
  ],
  [
    "contact",
    "Contact",
    "Get in touch — P.J. Ray",
    "Contact P.J. Ray about Living with Bipolar for reader correspondence, interview requests, and questions about the memoir.",
  ],
  [
    "privacy",
    "Privacy",
    "Privacy — Living with Bipolar",
    "How this static author website handles browsing, external links, and email correspondence.",
  ],
  [
    "terms",
    "Terms",
    "Website terms — Living with Bipolar",
    "Information about the content of this memoir website, external retailers, and personal mental health experiences.",
  ],
  [
    "404",
    "Page not found",
    "Page not found — Living with Bipolar",
    "This page could not be found. Return to Living with Bipolar by P.J. Ray.",
  ],
];
const escape = (s) =>
  s.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
const baseURL = new URL(config.url);
if (
  !["https:", "http:"].includes(baseURL.protocol) ||
  !config.url.endsWith("/")
)
  throw new Error("site.config.json url must be an absolute URL ending in /");
const navPages = pages.slice(1, 6);
for (const [slug, label, title, description] of pages) {
  const canonical = new URL(
    slug === "index" ? "./" : `${slug}.html`,
    config.url,
  ).href;
  const nav = navPages
    .map(
      ([id, text]) =>
        `<a href="${id}.html"${id === slug ? ' aria-current="page"' : ""}>${text}</a>`,
    )
    .join("\n");
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${config.url}#website`,
        name: config.name,
        url: config.url,
      },
      {
        "@type": "Person",
        "@id": `${config.url}#author`,
        name: config.author,
        url: new URL("authors.html", config.url).href,
        sameAs: [config.amazonAuthor],
        image: new URL("assets/img/pj-ray-portrait.jpg", config.url).href,
      },
      {
        "@type": "Book",
        "@id": `${config.url}#book`,
        name: config.name,
        author: { "@id": `${config.url}#author` },
        inLanguage: "en",
        image: new URL("assets/img/81pFcztlgCL._SY425_.jpg", config.url).href,
        url: new URL("books.html", config.url).href,
        sameAs: [config.amazon],
        bookFormat: "https://schema.org/Paperback",
      },
      {
        "@type": "WebPage",
        name: title,
        description,
        url: canonical,
        isPartOf: { "@id": `${config.url}#website` },
        about: { "@id": `${config.url}#book` },
      },
    ],
  };
  const tokens = {
    TITLE: escape(title),
    DESCRIPTION: escape(description),
    CANONICAL: escape(canonical),
    SOCIAL_IMAGE: new URL("assets/img/social.jpg", config.url).href,
    ROBOTS: slug === "404" ? "noindex, follow" : "index, follow",
    BASE: slug === "404" ? `<base href="${escape(baseURL.pathname)}">` : "",
    NAV: nav,
    BODY_CLASS: `page-${slug}`,
    CONTENT: await read(`src/pages/${slug}.html`),
    SCHEMA: JSON.stringify(schema).replaceAll("<", "\\u003c"),
    AMAZON: escape(config.amazon),
    AMAZON_AUTHOR: escape(config.amazonAuthor),
    EMAIL: escape(config.email),
    YEAR: String(new Date().getFullYear()),
  };
  // Expand content first so shared values inside page bodies are resolved too.
  let html = layout.replaceAll("{{CONTENT}}", tokens.CONTENT);
  html = html.replace(/\{\{([A-Z_]+)\}\}/g, (_, key) => {
    if (!(key in tokens)) throw new Error(`Unknown token ${key}`);
    return tokens[key];
  });
  await writeFile(path.join(root, `${slug}.html`), html.replace(/[\t ]+$/gm, ""));
}
await writeFile(
  path.join(root, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
    .filter(([slug]) => slug !== "404")
    .map(
      ([slug]) =>
        `  <url><loc>${new URL(slug === "index" ? "./" : `${slug}.html`, config.url).href}</loc></url>`,
    )
    .join("\n")}\n</urlset>\n`,
);
await writeFile(
  path.join(root, "robots.txt"),
  `User-agent: *\nAllow: /\nSitemap: ${new URL("sitemap.xml", config.url).href}\n`,
);
await writeFile(path.join(root, ".nojekyll"), "");
await mkdir(path.join(root, "artifacts"), { recursive: true });
console.log(
  `Built ${pages.length} static pages, sitemap, and robots.txt. Canonical base: ${config.url}`,
);
