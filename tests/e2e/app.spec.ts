import { expect, test } from '@playwright/test';

test.describe('Spectre E2E skeleton', () => {
  test('healthcheck contract shape', () => {
    const shape = {
      data: { status: 'ok', timestamp: new Date().toISOString(), version: '0.1.0' },
      success: true,
    };

    expect(shape.success).toBe(true);
    expect(shape.data.status).toBe('ok');
  });
});
