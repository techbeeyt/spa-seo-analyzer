#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const index_1 = require("../src/index");
commander_1.program
    .version('1.0.0')
    .description('SEO simulation tool for SPAs')
    .argument('<url>', 'URL of the SPA to analyze')
    .option('--output <type>', 'Output format: json, html', 'terminal')
    .option('--timeout <ms>', 'Timeout for page load (ms)', '10000')
    .parse(process.argv);
const { url } = commander_1.program.args[0] ? { url: commander_1.program.args[0] } : { url: '' };
const options = commander_1.program.opts();
async function run() {
    var _a;
    if (!url) {
        console.error(chalk_1.default.red('Error: URL is required'));
        commander_1.program.help();
    }
    try {
        const report = await (0, index_1.simulateSEO)(url, { timeout: parseInt((_a = options.timeout) !== null && _a !== void 0 ? _a : '10000') });
        if (options.output === 'json') {
            console.log(JSON.stringify(report, null, 2));
        }
        else if (options.output === 'html') {
            const html = generateHTMLReport(report);
            console.log(html);
        }
        else {
            displayTerminalReport(report);
        }
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error(chalk_1.default.red(`Error: ${errorMessage}`));
        process.exit(1);
    }
}
function displayTerminalReport(report) {
    console.log(chalk_1.default.bold.blue('SEO Simulation Report'));
    console.log(chalk_1.default.gray('-----------------------'));
    console.log(chalk_1.default.green(`URL: ${report.url}`));
    console.log(chalk_1.default.green(`Status: ${report.status}`));
    console.log(chalk_1.default.bold('SEO Checks:'));
    Object.entries(report.checks).forEach(([key, value]) => {
        console.log(value.passed
            ? chalk_1.default.green(`✓ ${key}: ${value.message}`)
            : chalk_1.default.red(`✗ ${key}: ${value.message}`));
    });
}
function generateHTMLReport(report) {
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
        .map(([key, value]) => `<li class="${value.passed ? 'passed' : 'failed'}">${key}: ${value.message}</li>`)
        .join('')}
      </ul>
    </body>
    </html>
  `;
}
run();
