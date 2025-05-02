#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import { simulateSEO, SEOSimulationReport } from '../src/index';

program
  .version('1.0.0')
  .description('SEO simulation tool for SPAs')
  .argument('<url>', 'URL of the SPA to analyze')
  .option('--output <type>', 'Output format: json, html', 'terminal')
  .option('--timeout <ms>', 'Timeout for page load (ms)', '10000')
  .parse(process.argv);

interface ProgramOptions {
  output?: 'json' | 'html' | 'terminal';
  timeout?: string;
}

const { url } = program.args[0] ? { url: program.args[0] } : { url: '' };
const options = program.opts<ProgramOptions>();

async function run() {
  if (!url) {
    console.error(chalk.red('Error: URL is required'));
    program.help();
  }

  try {
    const report = await simulateSEO(url, { timeout: parseInt(options.timeout ?? '10000') });
    if (options.output === 'json') {
      console.log(JSON.stringify(report, null, 2));
    } else if (options.output === 'html') {
      const html = generateHTMLReport(report);
      console.log(html);
    } else {
      displayTerminalReport(report);
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error(chalk.red(`Error: ${errorMessage}`));
    process.exit(1);
  }
}

function displayTerminalReport(report: SEOSimulationReport) {
  console.log(chalk.bold.blue('SEO Simulation Report'));
  console.log(chalk.gray('-----------------------'));
  console.log(chalk.green(`URL: ${report.url}`));
  console.log(chalk.green(`Status: ${report.status}`));
  console.log(chalk.bold('SEO Checks:'));
  Object.entries(report.checks).forEach(([key, value]) => {
    console.log(
      value.passed
        ? chalk.green(`✓ ${key}: ${value.message}`)
        : chalk.red(`✗ ${key}: ${value.message}`)
    );
  });
}

function generateHTMLReport(report: SEOSimulationReport): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>SEO Simulation Report</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #333; }
        .passed { color: green; }
        .failed { color: red; }
      </style>
    </head>
    <body>
      <h1>SEO Simulation Report</h1>
      <p><strong>URL:</strong> ${report.url}</p>
      <p><strong>Status:</strong> ${report.status}</p>
      <h2>SEO Checks</h2>
      <ul>
        ${Object.entries(report.checks)
          .map(
            ([key, value]) =>
              `<li class="${value.passed ? 'passed' : 'failed'}">${key}: ${value.message}</li>`
          )
          .join('')}
      </ul>
    </body>
    </html>
  `;
}

run();