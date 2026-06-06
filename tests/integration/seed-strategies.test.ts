import { seedDefaults } from '../../backend/src/shared/database/seed-defaults.js';

describe('seedDefaults', () => {
  it('is a function', () => {
    expect(typeof seedDefaults).toBe('function');
  });
});
