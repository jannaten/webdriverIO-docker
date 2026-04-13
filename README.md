# WebdriverIO + Selenium Grid 4 + Docker

![E2E Tests](https://github.com/<YOUR_GITHUB_USERNAME>/webdriverIO-docker/actions/workflows/ci.yml/badge.svg)
![Node](https://img.shields.io/badge/node-%3E%3D20-brightgreen)
![WebdriverIO](https://img.shields.io/badge/WebdriverIO-v9-orange)
![License](https://img.shields.io/badge/license-MIT-blue)

A production-grade end-to-end test automation framework built with **WebdriverIO v9**, **Selenium Grid 4**, and **Docker Compose**. Tests run in parallel across Chrome and Firefox inside isolated containers, with Allure HTML reports generated after every run.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Running Tests](#running-tests)
  - [With Docker (recommended)](#with-docker-recommended)
  - [Selective suite execution](#selective-suite-execution)
- [Code Quality](#code-quality)
- [Allure Reporting](#allure-reporting)
- [CI/CD](#cicd)
- [Architecture Notes](#architecture-notes)

---

## Tech Stack

| Tool                                                            | Version | Role                                          |
| --------------------------------------------------------------- | ------- | --------------------------------------------- |
| [WebdriverIO](https://webdriver.io/)                            | v9      | Test runner & browser automation              |
| [Mocha](https://mochajs.org/)                                   | v10     | Test framework (BDD)                          |
| [Selenium Grid 4](https://www.selenium.dev/documentation/grid/) | 4.x     | Parallel cross-browser orchestration          |
| [Docker Compose](https://docs.docker.com/compose/)              | v3.8    | Container management                          |
| [Allure](https://allurereport.org/)                             | 2.x     | Rich HTML test reporting                      |
| [ESLint](https://eslint.org/)                                   | v9      | Static analysis (WebdriverIO + Mocha plugins) |
| [Prettier](https://prettier.io/)                                | v3      | Opinionated code formatting                   |
| [Husky](https://typicode.github.io/husky/)                      | v9      | Git hooks                                     |
| [GitHub Actions](https://github.com/features/actions)           | —       | Continuous integration                        |

---

## Project Structure

```
webdriverIO-docker/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions pipeline
├── test/
│   ├── data/
│   │   └── users.js            # Centralised test data / fixtures
│   ├── pageobjects/
│   │   ├── page.js             # Base Page Object (shared methods)
│   │   ├── login.page.js       # /login selectors & actions
│   │   ├── secure.page.js      # /secure selectors & actions
│   │   └── checkboxes.page.js  # /checkboxes selectors & actions
│   └── specs/
│       ├── login.e2e.js        # Authentication — 7 scenarios
│       └── navigation.e2e.js   # UI components — 6 scenarios
├── docker-compose.yml          # Selenium Hub + Chrome + Firefox nodes
├── wdio.conf.js                # WebdriverIO configuration
├── package.json
└── README.md
```

---

## Prerequisites

| Requirement                                                       | Version                     |
| ----------------------------------------------------------------- | --------------------------- |
| [Node.js](https://nodejs.org/)                                    | ≥ 20                        |
| [Docker Desktop](https://www.docker.com/products/docker-desktop/) | ≥ 24                        |
| npm                                                               | ≥ 10 (bundled with Node 20) |

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/jannten/webdriverIO-docker.git
cd webdriverIO-docker

# 2. Install Node dependencies
npm install

# 3. Start Selenium Grid (Hub + Chrome + Firefox nodes)
npm run docker:up

# 4. Run all tests
npm test

# 5. Open the Allure report
npm run report
```

---

## Running Tests

### With Docker (recommended)

The Grid must be running before `npm test` is invoked.

```bash
# Start Grid in the background
npm run docker:up

# Run tests against the Grid
npm test

# Stop and remove containers when done
npm run docker:down
```

> **One-liner** — start Grid, run tests, then stop Grid:
>
> ```bash
> npm run docker:test
> ```

**Scale browser nodes** for heavier parallel workloads:

```bash
docker compose up -d --scale chrome=4 --scale firefox=2
```

### Selective suite execution

```bash
# Authentication tests only
npm run test:suite:auth

# UI-component tests only
npm run test:suite:ui
```

---

## Code Quality

The project enforces consistent code style and catches real bugs before they reach CI.

### Tools

| Tool         | Config file                              | What it does                                               |
| ------------ | ---------------------------------------- | ---------------------------------------------------------- |
| ESLint v9    | [`eslint.config.js`](eslint.config.js)   | Flags missing `await`, `.only()` leaks, unused vars        |
| Prettier v3  | [`.prettierrc`](.prettierrc)             | Enforces formatting (quotes, trailing commas, line width)  |
| Husky v9     | [`.husky/pre-commit`](.husky/pre-commit) | Runs lint-staged automatically on every `git commit`       |
| lint-staged  | `package.json`                           | Runs ESLint + Prettier on staged files only (fast)         |
| EditorConfig | [`.editorconfig`](.editorconfig)         | Baseline indent/line-ending consistency across all editors |

### Workflow for contributors

```bash
# Lint all files
npm run lint

# Auto-fix ESLint issues
npm run lint:fix

# Format all files with Prettier
npm run format

# Check formatting without writing (used in CI)
npm run format:check
```

The pre-commit hook runs automatically — you don't need to call these manually unless you want to check before committing.

### ESLint rules worth knowing

| Rule                       | Level | Reason                                                    |
| -------------------------- | ----- | --------------------------------------------------------- |
| `wdio/await-expect`        | error | Every browser command must be `await`ed in async mode     |
| `wdio/no-pause`            | error | `browser.pause()` is a debugging tool — must not reach CI |
| `mocha/no-exclusive-tests` | error | `.only()` silently skips all other tests in CI            |
| `mocha/no-done-callback`   | error | `done` callbacks are an anti-pattern with async/await     |
| `mocha/no-identical-title` | error | Duplicate test names hide failures                        |
| `mocha/no-skipped-tests`   | warn  | `.skip()` in committed code is usually a forgotten test   |

---

## Allure Reporting

After a test run, Allure results land in `allure-results/`. Generate and view the HTML report:

```bash
npm run report
```

Or step by step:

```bash
npm run report:generate   # writes allure-report/
npm run report:open       # opens a browser at localhost:port
```

> The Allure CLI (`allure-commandline`) is bundled as a dev dependency — no global install required.

---

## CI/CD

The [GitHub Actions workflow](.github/workflows/ci.yml) runs on every push and pull request to `master`/`main`:

1. Checks out the repository and installs dependencies via `npm ci`
2. Starts the Selenium Grid with `docker compose up -d`
3. Polls `http://localhost:4444/status` until the Grid reports `"ready": true`
4. Executes all E2E tests in **headless** mode (`HEADLESS=true`)
5. Generates an Allure report regardless of test outcome
6. Uploads the report as a **downloadable workflow artifact** (kept for 30 days)
7. Tears down all containers

---

## Architecture Notes

### Page Object Model

Every page is represented by a class that extends a shared `Page` base. Page objects expose:

- **Getters** for element references (lazy — evaluated only when called)
- **Action methods** that encapsulate multi-step interactions
- **Query methods** that return data about the current page state

Test specs import page object _instances_ and compose them, keeping spec files focused on **what** is being verified rather than **how** to interact with the browser.

### Async/await throughout

WebdriverIO v8+ removed the synchronous `@wdio/sync` wrapper. Every browser command is `await`ed, making control flow explicit and stack traces meaningful.

### Test isolation

Each `it` block runs after a `beforeEach` that navigates to the target page. Tests never depend on the state left by a previous test.

### Environment variables

| Variable        | Default     | Description                             |
| --------------- | ----------- | --------------------------------------- |
| `SELENIUM_HOST` | `localhost` | Selenium Grid hostname                  |
| `SELENIUM_PORT` | `4444`      | Selenium Grid port                      |
| `HEADLESS`      | `false`     | Set to `true` for headless browser mode |
