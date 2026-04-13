'use strict';

/**
 * Base Page Object
 *
 * Contains shared behaviour inherited by every page-specific object.
 * All methods are async — WebdriverIO v9 dropped the synchronous wrapper.
 */
class Page {
  /**
   * Navigate to a path relative to the baseUrl set in wdio.conf.js.
   * @param {string} path  e.g. 'login', 'checkboxes'
   */
  async open(path) {
    await browser.url(`/${path}`);
  }

  /**
   * Return the current <title> of the page.
   * @returns {Promise<string>}
   */
  async getTitle() {
    return browser.getTitle();
  }

  /**
   * Wait for an element to be displayed, then click it.
   * Scrolls into view first to handle elements below the fold.
   * @param {WebdriverIO.Element} element
   */
  async scrollAndClick(element) {
    await element.scrollIntoView();
    await element.waitForClickable({ timeout: 10000 });
    await element.click();
  }

  /**
   * Wait for an element to disappear from the DOM.
   * Useful for confirming loaders / spinners have resolved.
   * @param {WebdriverIO.Element} element
   * @param {number} [timeout=10000]
   */
  async waitForGone(element, timeout = 10000) {
    await element.waitForExist({ timeout, reverse: true });
  }
}

module.exports = Page;
