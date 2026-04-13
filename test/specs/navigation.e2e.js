'use strict';

const CheckboxesPage = require('../pageobjects/checkboxes.page');

// ─────────────────────────────────────────────────────────────────────────────
// UI Components — Checkboxes (https://the-internet.herokuapp.com/checkboxes)
// ─────────────────────────────────────────────────────────────────────────────

describe('UI Components — Checkboxes', () => {
  beforeEach(async () => {
    await CheckboxesPage.open();
  });

  // ── Rendering ──────────────────────────────────────────────────────────────

  describe('page rendering', () => {
    it('should display exactly two checkbox inputs', async () => {
      // Arrange & Act
      const count = await CheckboxesPage.getCount();

      // Assert
      expect(count).toBe(2);
    });

    it('should have the second checkbox checked by default', async () => {
      // Arrange & Act
      const isChecked = await CheckboxesPage.isChecked(1);

      // Assert
      expect(isChecked).toBe(true);
    });

    it('should have the first checkbox unchecked by default', async () => {
      // Arrange & Act
      const isChecked = await CheckboxesPage.isChecked(0);

      // Assert
      expect(isChecked).toBe(false);
    });
  });

  // ── Interaction ────────────────────────────────────────────────────────────

  describe('checkbox toggling', () => {
    it('should check the first checkbox when toggled', async () => {
      // Arrange — confirm starting state
      expect(await CheckboxesPage.isChecked(0)).toBe(false);

      // Act
      await CheckboxesPage.toggle(0);

      // Assert
      expect(await CheckboxesPage.isChecked(0)).toBe(true);
    });

    it('should uncheck the second checkbox when toggled', async () => {
      // Arrange — confirm starting state
      expect(await CheckboxesPage.isChecked(1)).toBe(true);

      // Act
      await CheckboxesPage.toggle(1);

      // Assert
      expect(await CheckboxesPage.isChecked(1)).toBe(false);
    });

    it('should allow toggling a checkbox back to its original state', async () => {
      // Arrange
      const originalState = await CheckboxesPage.isChecked(0);

      // Act — toggle twice to round-trip
      await CheckboxesPage.toggle(0);
      await CheckboxesPage.toggle(0);

      // Assert
      expect(await CheckboxesPage.isChecked(0)).toBe(originalState);
    });

    it('should reach an all-checked state using setChecked', async () => {
      // Arrange & Act
      await CheckboxesPage.setChecked(0, true);
      await CheckboxesPage.setChecked(1, true);

      // Assert
      expect(await CheckboxesPage.isChecked(0)).toBe(true);
      expect(await CheckboxesPage.isChecked(1)).toBe(true);
    });
  });
});
