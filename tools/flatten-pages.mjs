import fs from "node:fs";
import path from "node:path";

const DOCS = path.resolve("docs");

// Angular new build usually outputs to docs/browser
const BROWSER = path.join(DOCS, "browser");

if (!fs.existsSync(DOCS)) {
  console.error("docs folder not found. Run ng build first.");
  process.exit(1);
}

if (!fs.existsSync(BROWSER)) {
  // If your build already outputs directly to docs/, nothing to do
  const indexAtRoot = path.join(DOCS, "index.html");
  if (fs.existsSync(indexAtRoot)) {
    console.log("docs/index.html already exists. Nothing to flatten.");
    process.exit(0);
  }

  console.error("docs/browser not found and docs/index.html not found.");
  process.exit(1);
}

const moveAll = (fromDir, toDir) => {
  for (const name of fs.readdirSync(fromDir)) {
    const from = path.join(fromDir, name);
    const to = path.join(toDir, name);

    // Remove old target if exists
    if (fs.existsSync(to)) fs.rmSync(to, { recursive: true, force: true });

    fs.renameSync(from, to);
  }
};

// Move browser/* -> docs/*
moveAll(BROWSER, DOCS);

// Remove empty browser folder
fs.rmSync(BROWSER, { recursive: true, force: true });

// Disable Jekyll processing (recommended for SPA assets)
fs.writeFileSync(path.join(DOCS, ".nojekyll"), "");

// SPA refresh support on GitHub Pages (optional but recommended)
const index = path.join(DOCS, "index.html");
const notFound = path.join(DOCS, "404.html");
if (fs.existsSync(index)) {
  fs.copyFileSync(index, notFound);
}

console.log("Flatten done. docs/index.html is ready for GitHub Pages.");
