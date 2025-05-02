"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.crawlPage = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const ora_1 = __importDefault(require("ora"));
async function crawlPage(url, timeout) {
    var _a;
    const spinner = (0, ora_1.default)(`Crawling ${url}`).start();
    let browser = null;
    try {
        browser = await puppeteer_1.default.launch({ headless: "new" });
        const page = await browser.newPage();
        // Set timeout
        await page.setDefaultNavigationTimeout(timeout);
        // Navigate to URL
        const response = await page.goto(url, { waitUntil: 'networkidle2' });
        const status = (_a = response === null || response === void 0 ? void 0 : response.status()) !== null && _a !== void 0 ? _a : 500;
        if (status !== 200) {
            throw new Error(`HTTP ${status} received`);
        }
        // Get fully rendered HTML
        const html = await page.content();
        await browser.close();
        spinner.succeed('Page crawled successfully');
        return { html, status };
    }
    catch (error) {
        spinner.fail(`Failed to crawl page: ${error.message}`);
        if (browser)
            await browser.close();
        throw error;
    }
}
exports.crawlPage = crawlPage;
