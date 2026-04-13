'use strict';

const Page = require('./page');

/**
 * Secure Area Page Object
 *
 * Represents the /secure page reached after a successful login.
 */
class SecurePage extends Page {
  // ── Selectors ─────────────────────────────────────────────────────────────

  get flashAlert() {
    return $('#flash');
  }

  get heading() {
    return $('h2');
  }

  get logoutButton() {
    return $('a[href="/logout"]');
  }

  // ── Queries ───────────────────────────────────────────────────────────────

  /**
   * Wait for the flash banner and return its trimmed text.
   * @returns {Promise<string>}
   */
  async getFlashText() {
    await this.flashAlert.waitForDisplayed({ timeout: 10000 });
    return this.flashAlert.getText();
  }

  /**
   * Return the text of the page's main <h2> heading.
   * @returns {Promise<string>}
   */
  async getHeading() {
    await this.heading.waitForDisplayed({ timeout: 10000 });
    return this.heading.getText();
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  /**
   * Click the logout link and wait for navigation away from /secure.
   */
  async logout() {
    await this.logoutButton.waitForClickable({ timeout: 10000 });
    await this.logoutButton.click();
  }
}

module.exports = new SecurePage();
