"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeSEO = void 0;
const jsdom_1 = require("jsdom");
async function analyzeSEO(html) {
    var _a, _b, _c, _d, _e, _f;
    const dom = new jsdom_1.JSDOM(html);
    const document = dom.window.document;
    const checks = {};
    // Check <title>
    const title = (_b = (_a = document.querySelector('title')) === null || _a === void 0 ? void 0 : _a.textContent) !== null && _b !== void 0 ? _b : '';
    checks['Title Tag'] = {
        passed: !!title,
        message: title ? `Title found: ${title}` : 'No title tag found',
    };
    // Check <meta name="description">
    const metaDescription = (_d = (_c = document.querySelector('meta[name="description"]')) === null || _c === void 0 ? void 0 : _c.getAttribute('content')) !== null && _d !== void 0 ? _d : '';
    checks['Meta Description'] = {
        passed: !!metaDescription,
        message: metaDescription ? `Description found: ${metaDescription}` : 'No meta description found',
    };
    // Check <link rel="canonical">
    const canonical = (_f = (_e = document.querySelector('link[rel="canonical"]')) === null || _e === void 0 ? void 0 : _e.getAttribute('href')) !== null && _f !== void 0 ? _f : '';
    checks['Canonical Tag'] = {
        passed: !!canonical,
        message: canonical ? `Canonical found: ${canonical}` : 'No canonical tag found',
    };
    // Check heading hierarchy
    const h1Count = document.querySelectorAll('h1').length;
    const h2Count = document.querySelectorAll('h2').length;
    checks['Heading Structure'] = {
        passed: h1Count === 1 && h2Count >= 0,
        message: h1Count === 1
            ? `One H1 found, ${h2Count} H2s found`
            : `Expected one H1, found ${h1Count}`,
    };
    // Check internal links
    const internalLinks = document.querySelectorAll('a[href^="/"], a[href^="' + document.location.origin + '"]');
    checks['Internal Links'] = {
        passed: internalLinks.length > 0,
        message: `Found ${internalLinks.length} internal links`,
    };
    // Check image alt attributes
    const images = document.querySelectorAll('img');
    let missingAlt = 0;
    images.forEach((img) => {
        if (!img.getAttribute('alt'))
            missingAlt++;
    });
    checks['Image Alt Attributes'] = {
        passed: missingAlt === 0,
        message: missingAlt === 0
            ? 'All images have alt attributes'
            : `${missingAlt} images missing alt attributes`,
    };
    return checks;
}
exports.analyzeSEO = analyzeSEO;
