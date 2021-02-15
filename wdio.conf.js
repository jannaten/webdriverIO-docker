exports.config = {
  runner: "local",
  hostname: "localhost",
  port: 4444,
  path: "/",
  specs: ["./test/specs/**/*.js"],
  exclude: [],
  maxInstances: 10,
  capabilities: [
    {
      maxInstances: 5,
      browserName: "chrome",
      acceptInsecureCerts: true,
    },
    {
      maxInstances: 5,
      browserName: "firefox",
      acceptInsecureCerts: true,
    },
  ],
  logLevel: "info",
  bail: 0,
  baseUrl: "http://localhost",
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  services: ["docker"],
  framework: "mocha",
  reporters: ["spec"],
  mochaOpts: {
    ui: "bdd",
    timeout: 60000,
  },
};
