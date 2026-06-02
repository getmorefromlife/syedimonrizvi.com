import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, extname, dirname } from "path";
import { createServer } from "http";
import puppeteer from "puppeteer";

const PORT = 4174;
const DIST = join(process.cwd(), "dist");

const ROUTES = [
  "/",
  "/about",
  "/aligile",
  "/books",
  "/portfolio",
  "/studio",
  "/contact",
  "/tools",
  "/tools/velocity",
  "/tools/burndown",
  "/tools/capacity",
  "/tools/planning-poker",
  "/tools/wsjf",
  "/tools/cost-of-delay",
  "/tools/effort-impact",
  "/tools/story-map",
  "/tools/wip-limit",
  "/tools/lead-time-scatter",
  "/tools/value-stream",
  "/tools/cycle-vs-lead",
  "/tools/blocker-log",
];

const MIME = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".xml": "application/xml",
  ".txt": "text/plain",
  ".ico": "image/x-icon",
};

function serve() {
  return createServer((req, res) => {
    // SPA fallback: serve index.html for any non-file path
    let filePath = req.url === "/" ? "/index.html" : req.url;
    let fp = join(DIST, filePath);

    if (!existsSync(fp) || !extname(filePath)) {
      fp = join(DIST, "index.html");
    }

    const ext = extname(fp);
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(readFileSync(fp));
  });
}

async function prerenderRoute(page, route, originalHTML) {
  const url = `http://127.0.0.1:${PORT}${route}`;
  console.log(`  Navigating to ${route}...`);
  await page.goto(url, { waitUntil: "networkidle0", timeout: 20000 });
  await page.waitForSelector("#root", { timeout: 10000 });

  // Dismiss entry overlay only on home page
  if (route === "/") {
    await page.mouse.click(640, 450);
    await new Promise((r) => setTimeout(r, 1500));
    try {
      await page.waitForFunction(
        () => document.body.innerText.includes("Syed Imon Rizvi"),
        { timeout: 8000 }
      );
    } catch {
      await page.mouse.click(640, 450);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  // Trigger lazy/framer-motion animations by scrolling
  await page.evaluate(async () => {
    const delay = (ms) => new Promise((r) => setTimeout(r, ms));
    for (let y = 0; y < document.body.scrollHeight; y += 300) {
      window.scrollTo(0, y);
      await delay(150);
    }
    window.scrollTo(0, 0);
  });
  await new Promise((r) => setTimeout(r, 800));

  // Get rendered innerHTML
  const renderedContent = await page.evaluate(() => {
    const root = document.getElementById("root");
    return root ? root.innerHTML : "";
  });

  if (!renderedContent || renderedContent.length < 100) {
    console.log(`  ⚠️  Short content (${renderedContent.length} chars) for ${route}`);
  }

  // Build output path
  const outPath = route === "/"
    ? join(DIST, "index.html")
    : join(DIST, route.slice(1), "index.html");

  mkdirSync(dirname(outPath), { recursive: true });

  const rendered = originalHTML.replace(
    '<div id="root"></div>',
    `<div id="root">${renderedContent}</div>`
  );
  writeFileSync(outPath, rendered);
  console.log(`  ✓ ${outPath.replace(DIST, "dist")} (${rendered.length} bytes)`);
}

async function main() {
  const server = serve();
  await new Promise((r) => server.listen(PORT, "127.0.0.1", r));

  const originalHTML = readFileSync(join(DIST, "index.html"), "utf-8");

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  try {
    console.log(`Prerendering ${ROUTES.length} routes...`);
    for (const route of ROUTES) {
      await prerenderRoute(page, route, originalHTML);
    }
    console.log("Done.");
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
