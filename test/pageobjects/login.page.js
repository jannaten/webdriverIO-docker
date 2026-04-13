'use strict';

const Page = require('./page');

/**
 * Login Page Object
 *
 * Encapsulates all selectors and interactions for /login.
 */
class LoginPage extends Page {
  // ── Selectors ─────────────────────────────────────────────────────────────

  get inputUsername() {
    return $('#username');
  }

  get inputPassword() {
    return $('#password');
  }

  get btnSubmit() {
    return $('button[type="submit"]');
  }

  get flashMessage() {
    return $('#flash');
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  /**
   * Fill in credentials and submit the login form.
   * @param {string} username
   * @param {string} password
   */
  async login(username, password) {
    await this.inputUsername.setValue(username);
    await this.inputPassword.setValue(password);
    await this.btnSubmit.click();
  }

  /**
   * Clear any pre-filled values, then fill in credentials and submit.
   * Useful when the browser has cached values from a previous test.
   * @param {string} username
   * @param {string} password
   */
  async clearAndLogin(username, password) {
    await this.inputUsername.clearValue();
    await this.inputUsername.setValue(username);
    await this.inputPassword.clearValue();
    await this.inputPassword.setValue(password);
    await this.btnSubmit.click();
  }

  // ── Queries ───────────────────────────────────────────────────────────────

  /**
   * Wait for the flash banner to appear, then return its text.
   * @returns {Promise<string>}
   */
  async getFlashText() {
    await this.flashMessage.waitForDisplayed({ timeout: 10000 });
    return this.flashMessage.getText();
  }

  // ── Navigation ────────────────────────────────────────────────────────────

  async open() {
    await super.open('login');
  }
}

module.exports = new LoginPage();
