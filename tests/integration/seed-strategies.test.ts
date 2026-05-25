import { seedDefaultStrategies } from '../../backend/shared/database/seed-defaults';

describe('seedDefaultStrategies', () => {
  it('is a function', () => {
    expect(typeof seedDefaultStrategies).toBe('function');
  });
});
