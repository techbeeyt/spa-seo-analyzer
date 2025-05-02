import { JSDOM } from 'jsdom';
import { SEOCheck } from './index';

export async function analyzeSEO(html: string): Promise<Record<string, SEOCheck>> {
  const dom = new JSDOM(html);
  const document = dom.window.document;

  const checks: Record<string, SEOCheck> = {};

  // Check <title>
  const title = document.querySelector('title')?.textContent ?? '';
  checks['Title Tag'] = {
    passed: !!title,
    message: title ? `Title found: ${title}` : 'No title tag found',
  };

  // Check <meta name="description">
  const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') ?? '';
  checks['Meta Description'] = {
    passed: !!metaDescription,
    message: metaDescription ? `Description found: ${metaDescription}` : 'No meta description found',
  };

  // Check <link rel="canonical">
  const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? '';
  checks['Canonical Tag'] = {
    passed: !!canonical,
    message: canonical ? `Canonical found: ${canonical}` : 'No canonical tag found',
  };

  // Check heading hierarchy
  const h1Count = document.querySelectorAll('h1').length;
  const h2Count = document.querySelectorAll('h2').length;
  checks['Heading Structure'] = {
    passed: h1Count === 1 && h2Count >= 0,
    message:
      h1Count === 1
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
    if (!img.getAttribute('alt')) missingAlt++;
  });
  checks['Image Alt Attributes'] = {
    passed: missingAlt === 0,
    message:
      missingAlt === 0
        ? 'All images have alt attributes'
        : `${missingAlt} images missing alt attributes`,
  };

  return checks;
}