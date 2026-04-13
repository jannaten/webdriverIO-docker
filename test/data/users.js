'use strict';
/**
 * Test data fixtures — credentials for https://the-internet.herokuapp.com
 *
 * Centralising test data here means a single change propagates to every spec
 * that imports it, rather than hunting through hard-coded strings.
 */
const USERS = {
  /**
   * Known-good account accepted by the /login page.
   */
  valid: {
    username: 'tomsmith',
    password: 'SuperSecretPassword!',
  },
  /**
   * Credentials that do not exist in the system — triggers the
   * "Your username is invalid!" flash message.
   */
  invalidUsername: {
    username: 'not_a_real_user',
    password: 'doesNotMatter',
  },
  /**
   * Valid username with a wrong password — triggers the
   * "Your password is invalid!" flash message.
   */
  wrongPassword: {
    username: 'tomsmith',
    password: 'wrongPassword123!',
  },
};

module.exports = { USERS };
