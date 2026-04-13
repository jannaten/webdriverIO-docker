/**
 * WebdriverIO Configuration
 *
 * Primary run mode: tests execute against a Selenium Grid 4 instance.
 * Start the Grid first:  npm run docker:up
 * Then run tests:        npm test
 *
 * Environment variables
 * ─────────────────────
 * SELENIUM_HOST  – Grid hostname          (default: localhost)
 * SELENIUM_PORT  – Grid port              (default: 4444)
 * HEADLESS       – 'true' for headless    (default: false)
 */

'use strict';

exports.config = {
  // ─── Runner ──────────────────────────────────────────────────────────────
  runner: 'local',
  // ─── Selenium Grid 4 endpoint ────────────────────────────────────────────
  // Grid 4 uses '/' as its WebDriver path (not the legacy '/wd/hub').
  hostname: process.env.SELENIUM_HOST || 'localhost',
  port: Number(process.env.SELENIUM_PORT) || 4444,
  path: '/',
  protocol: 'http',
  // ─── Test files ──────────────────────────────────────────────────────────
  specs: ['./test/specs/**/*.e2e.js'],
  exclude: [],
  // Named suites for selective execution: wdio run wdio.conf.js --suite auth
  suites: {
    auth: ['./test/specs/login.e2e.js'],
    ui: ['./test/specs/navigation.e2e.js'],
  },
  // ─── Parallelism ─────────────────────────────────────────────────────────
  maxInstances: 6,
  // ─── Capabilities ────────────────────────────────────────────────────────
  capabilities: [
    {
      browserName: 'chrome',
      maxInstances: 3,
      acceptInsecureCerts: true,
      // Disable WebDriver BiDi — WDIO v9 enables it automatically when the
      // browser supports it, but the BiDi WebSocket URL returned by the Grid
      // points to the node's Docker-internal IP which the test runner cannot
      // reach directly. Classic WebDriver routes cleanly through the hub.
      'wdio:enforceWebDriverClassic': true,
      'goog:chromeOptions': {
        args: [
          '--disable-gpu',
          '--no-sandbox',
          '--disable-dev-shm-usage',
          '--window-size=1920,1080',
          ...(process.env.HEADLESS === 'true' ? ['--headless=new'] : []),
        ],
      },
    },
    {
      browserName: 'firefox',
      maxInstances: 3,
      acceptInsecureCerts: true,
      'wdio:enforceWebDriverClassic': true,
      'moz:firefoxOptions': {
        args: process.env.HEADLESS === 'true' ? ['-headless'] : [],
      },
    },
  ],
  // ─── General settings ────────────────────────────────────────────────────
  logLevel: 'warn',
  bail: 0,
  baseUrl: 'https://the-internet.herokuapp.com',
  waitforTimeout: 15000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  // No local services needed — Selenium Grid is managed by Docker Compose
  services: [],
  // ─── Framework ───────────────────────────────────────────────────────────
  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  },
  // ─── Reporters ───────────────────────────────────────────────────────────
  reporters: [
    'spec',
    [
      'allure',
      {
        outputDir: 'allure-results',
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: false,
      },
    ],
  ],
  // ─── Hooks ───────────────────────────────────────────────────────────────
  before: async function () {
    // Global setup: runs once per worker before any tests in that worker.
  },
  beforeSuite: async function (_suite) {
    // Fires before each describe block.
  },
  afterTest: async function (_test, _context, { error }) {
    // Capture a screenshot on test failure for Allure attachment.
    if (error) {
      await browser.takeScreenshot();
    }
  },
  after: async function () {
    // Global teardown: runs once per worker after all tests in that worker.
  },
};
