SPA SEO Simulator
A production-ready SEO simulation and auditing tool for Single-Page Applications (SPAs). It simulates how search engine crawlers (e.g., Googlebot) render and index JavaScript-heavy SPAs, performing essential SEO checks on the final rendered DOM.

## Features
- Simulates search engine crawling using Puppeteer
- Performs SEO checks (title, meta description, canonical, headings, links, image alt)
- Outputs results in terminal, JSON, or HTML
- Usable as a CLI tool or Node.js module
- Built with TypeScript for type safety

## Installation
```npm install -g spa-seo-simulator```

## CLI Usage
```spa-seo <url> [--output <json|html>] [--timeout <ms>]```

Examples

Basic terminal output:spa-seo https://techbeeyt.github.io/spa-seo-checker


JSON output:spa-seo https://techbeeyt.github.io/spa-seo-checker --output json


HTML report:spa-seo https://techbeeyt.github.io/spa-seo-checker --output html


Custom timeout (e.g., 15 seconds):spa-seo https://example.com --timeout 15000



Programmatic Usage
import { simulateSEO } from 'spa-seo-simulator';

async function run() {
  const report = await simulateSEO('https://example.com', { timeout: 10000 });
  console.log(report);
}

run();

SEO Checks Performed

Title Tag: Checks for presence of <title>.
Meta Description: Checks for <meta name="description">.
Canonical Tag: Verifies <link rel="canonical"> exists.
Heading Structure: Ensures exactly one <h1> and valid <h2> usage.
Internal Links: Counts internal <a> links.
Image Alt Attributes: Checks for missing alt attributes on <img>.

Example Output
Terminal
SEO Simulation Report
-----------------------
URL: https://techbeeyt.github.io/spa-seo-checker
Status: 200
SEO Checks:
✓ Title Tag: Title found: My SPA
✗ Meta Description: No meta description found
✓ Canonical Tag: Canonical found: https://techbeeyt.github.io/spa-seo-checker
✓ Heading Structure: One H1 found, 2 H2s found
✓ Internal Links: Found 5 internal links
✓ Image Alt Attributes: All images have alt attributes

JSON
{
  "url": "https://example.com",
  "status": 200,
  "checks": {
    "Title Tag": { "passed": true, "message": "Title found: My SPA" },
    "Meta Description": { "passed": false, "message": "No meta description found" },
    ...
  }
}

Development

Clone the repo:git clone <repo-url>


Install dependencies:npm install


Build the project:npm run build


Run locally:npm start -- <url>



License
MIT
