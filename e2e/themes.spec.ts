import { expect, test } from '@playwright/test';

const api = process.env.API_BASE_URL ?? 'http://localhost:3000/api/v1';

test.describe('themes', () => {
  test.beforeEach(async ({ request }) => {
    const res = await request.get(`${api.replace(/\/api\/v1$/, '')}/health`);
    test.skip(!res.ok(), 'Backend not running on :3000 — start Splitwisely-backend first');
  });

  test('sign up, switch theme, and keep it after reload', async ({ page }) => {
    const stamp = Date.now();
    const email = `theme-${stamp}@example.com`;

    await page.goto('/auth');
    await page.getByRole('button', { name: /Need an account/i }).click();
    await page.locator('input[name="name"]').fill(`Theme ${stamp}`);
    await page.locator('input[name="email"]').fill(email);
    await page.locator('input[name="password"]').fill('password123');
    await page.getByRole('button', { name: 'Sign up' }).click();
    await expect(page).toHaveURL(/dashboard/);

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'midnight');

    await page.getByRole('link', { name: 'Settings' }).click();
    await expect(page).toHaveURL(/settings/);
    await expect(page.getByRole('radio')).toHaveCount(6);

    await page.getByRole('radio', { name: /Ember/ }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'ember');

    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'ember');
    await expect(page.getByRole('radio', { name: /Ember/ })).toHaveAttribute('aria-checked', 'true');

    // Light theme must flip the color-scheme for native form controls.
    await page.getByRole('radio', { name: /Daylight/ }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'daylight');
    await expect(page.locator('html')).toHaveCSS('color-scheme', 'light');
  });
});
