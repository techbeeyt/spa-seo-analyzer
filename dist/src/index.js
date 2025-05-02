"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simulateSEO = void 0;
async function simulateSEO(url, options = {}) {
    const { timeout = 10000 } = options;
    // Crawl the page
    const { html, status } = await (0, crawler_1.crawlPage)(url, timeout);
    // Analyze SEO metrics
    const checks = await (0, analyzer_1.analyzeSEO)(html);
    return {
        url,
        status,
        checks,
    };
}
exports.simulateSEO = simulateSEO;
const crawler_1 = require("./crawler");
const analyzer_1 = require("./analyzer");
