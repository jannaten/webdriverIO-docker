'use strict';

const Page = require('./page');

/**
 * Checkboxes Page Object
 *
 * Represents the /checkboxes page — demonstrates interaction
 * with a collection of elements rather than single elements.
 */
class CheckboxesPage extends Page {
  // ── Selectors ─────────────────────────────────────────────────────────────

  /**
   * All checkbox inputs on the page (returns a ChainablePromiseArray).
   */
  get checkboxes() {
    return $$('input[type="checkbox"]');
  }

  // ── Queries ───────────────────────────────────────────────────────────────

  /**
   * Return the total number of checkboxes present on the page.
   * @returns {Promise<number>}
   */
  async getCount() {
    const boxes = await this.checkboxes;
    return boxes.length;
  }

  /**
   * Return whether the checkbox at the given index is checked.
   * @param {number} index  0-based
   * @returns {Promise<boolean>}
   */
  async isChecked(index) {
    const boxes = await this.checkboxes;
    return boxes[index].isSelected();
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  /**
   * Click the checkbox at the given index to toggle its state.
   * @param {number} index  0-based
   */
  async toggle(index) {
    const boxes = await this.checkboxes;
    await boxes[index].click();
  }

  /**
   * Ensure the checkbox at the given index is in the desired state.
   * Clicks only if the current state differs from the target.
   * @param {number}  index    0-based
   * @param {boolean} checked  true = checked, false = unchecked
   */
  async setChecked(index, checked) {
    const current = await this.isChecked(index);
    if (current !== checked) {
      await this.toggle(index);
    }
  }

  // ── Navigation ────────────────────────────────────────────────────────────

  async open() {
    await super.open('checkboxes');
  }
}

module.exports = new CheckboxesPage();
