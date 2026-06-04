import { seedDefaultStrategies } from '../../backend/src/shared/database/seed-defaults.js';

describe('seedDefaultStrategies', () => {
  it('is a function', () => {
    expect(typeof seedDefaultStrategies).toBe('function');
  });
});
