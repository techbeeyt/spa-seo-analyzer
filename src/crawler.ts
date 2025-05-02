import puppeteer, { Browser } from 'puppeteer';
import ora from 'ora';

export async function crawlPage(url: string, timeout: number): Promise<{ html: string; status: number }> {
  const spinner = ora(`Crawling ${url}`).start();
  let browser: Browser | null = null;

  try {
    browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    // Set timeout
    await page.setDefaultNavigationTimeout(timeout);

    // Navigate to URL
    const response = await page.goto(url, { waitUntil: 'networkidle2' });
    const status = response?.status() ?? 500;

    if (status !== 200) {
      throw new Error(`HTTP ${status} received`);
    }

    // Get fully rendered HTML
    const html = await page.content();

    await browser.close();
    spinner.succeed('Page crawled successfully');
    return { html, status };
  } catch (error: unknown) {
    spinner.fail(`Failed to crawl page: ${(error as Error).message}`);
    if (browser) await browser.close();
    throw error;
  }
}