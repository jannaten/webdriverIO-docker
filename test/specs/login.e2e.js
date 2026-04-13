'use strict';

const LoginPage = require('../pageobjects/login.page');
const SecurePage = require('../pageobjects/secure.page');
const { USERS } = require('../data/users');

// ─────────────────────────────────────────────────────────────────────────────
// Authentication — Login page (https://the-internet.herokuapp.com/login)
// ─────────────────────────────────────────────────────────────────────────────

describe('Authentication — Login', () => {
  // Recreate the WebDriver session before each test so Chrome starts with a
  // completely clean slate — no cookies, no HTTP cache, no connection pool,
  // no retained internal state of any kind.
  //
  // Chrome 147 in headless mode retains session-level state between tests
  // that even browser.deleteCookies() does not clear. After a successful
  // login in test 1 (ends on /secure), subsequent tests find the form
  // submission silently failing — the server redirects back to /login and
  // no flash appears. browser.reloadSession() is the only reliable fix
  // because it tears down the browser process-level context entirely.
  // Firefox is unaffected and does not need this workaround.
  beforeEach(async () => {
    await browser.reloadSession();
    await LoginPage.open();
  });

  // ── Happy path ─────────────────────────────────────────────────────────────

  describe('with valid credentials', () => {
    it('should display a success flash message', async () => {
      // Arrange
      const { username, password } = USERS.valid;

      // Act
      await LoginPage.login(username, password);

      // Assert
      const flash = await SecurePage.getFlashText();
      await expect(SecurePage.flashAlert).toBeDisplayed();
      expect(flash).toContain('You logged into a secure area!');
    });

    it('should redirect the browser to /secure', async () => {
      // Arrange & Act
      await LoginPage.login(USERS.valid.username, USERS.valid.password);

      // Assert
      await expect(browser).toHaveUrl(expect.stringContaining('/secure'));
    });

    it('should show the "Secure Area" heading on the landing page', async () => {
      // Arrange & Act
      await LoginPage.login(USERS.valid.username, USERS.valid.password);

      // Assert
      const heading = await SecurePage.getHeading();
      expect(heading).toContain('Secure Area');
    });

    it('should return to /login after clicking logout', async () => {
      // Arrange
      await LoginPage.login(USERS.valid.username, USERS.valid.password);

      // Act
      await SecurePage.logout();

      // Assert
      await expect(browser).toHaveUrl(expect.stringContaining('/login'));
    });
  });

  // ── Sad path ───────────────────────────────────────────────────────────────

  describe('with invalid credentials', () => {
    it('should show an error for an unrecognised username', async () => {
      // Arrange
      const { username, password } = USERS.invalidUsername;

      // Act
      await LoginPage.login(username, password);

      // Assert
      const flash = await LoginPage.getFlashText();
      expect(flash).toContain('Your username is invalid!');
    });

    it('should show an error for a correct username but wrong password', async () => {
      // Arrange
      const { username, password } = USERS.wrongPassword;

      // Act
      await LoginPage.login(username, password);

      // Assert
      const flash = await LoginPage.getFlashText();
      expect(flash).toContain('Your password is invalid!');
    });

    it('should remain on /login after a failed attempt', async () => {
      // Arrange & Act
      await LoginPage.login(USERS.invalidUsername.username, USERS.invalidUsername.password);

      // Assert
      await expect(browser).toHaveUrl(expect.stringContaining('/login'));
    });
  });
});
