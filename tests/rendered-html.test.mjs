import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", String(process.pid) + "-" + String(Date.now()));
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the Atollingo language hub", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<title>Atollingo \| Language Learning Hub<\/title>/i);
  assert.match(html, /Every language\./);
  assert.match(html, /OceanLearn/);
  assert.match(html, /OceanPlay/);
  assert.match(html, /OceanArabic/);
  assert.match(html, /العربية/);
  assert.match(html, /އައިސް އެކުގައި ދަސްކޮށްލަމާ!/);
});

test("links every live language app and keeps source UTF-8 clean", async () => {
  const [page, layout] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);
  for (const url of [
    "https://oceanlearn-maldives.mohamedmisbaah.chatgpt.site/",
    "https://oceanplay-maldives.mohamedmisbaah.chatgpt.site/",
    "https://oceanarabic-maldives.mohamedmisbaah.chatgpt.site/",
  ]) assert.ok(page.includes(url), `missing app link: ${url}`);
  assert.doesNotMatch(page + layout, /Ã|Â|â€|ðŸ|Þ/);
  assert.match(layout, /Language Learning Hub/);
});
