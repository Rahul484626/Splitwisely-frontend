import { expect, test } from '@playwright/test';

test('auth screen shows Splitwisely brand', async ({ page }) => {
  await page.goto('/auth');
  await expect(page.getByRole('heading', { name: 'Splitwisely' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
});
