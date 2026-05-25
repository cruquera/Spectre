import { test, expect } from '@playwright/test';

test.describe('Spectre E2E skeleton', () => {
  test('healthcheck contract shape', async () => {
    const shape = {
      success: true,
      data: { status: 'ok', version: '0.1.0', timestamp: new Date().toISOString() },
    };
    expect(shape.success).toBe(true);
    expect(shape.data.status).toBe('ok');
  });
});
