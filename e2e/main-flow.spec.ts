import { expect, test, type APIRequestContext } from '@playwright/test';

const api = process.env.API_BASE_URL ?? 'http://localhost:3000/api/v1';

async function apiReady(request: APIRequestContext): Promise<boolean> {
  const res = await request.get(`${api.replace(/\/api\/v1$/, '')}/health`);
  return res.ok();
}

test.describe('main expense flow', () => {
  test.beforeEach(async ({ request }) => {
    test.skip(!(await apiReady(request)), 'Backend not running on :3000 — start Splitwisely-backend first');
  });

  test('sign up, create group, add equal expense, see balance', async ({ page }) => {
    const stamp = Date.now();
    const email = `e2e-${stamp}@example.com`;
    const password = 'password123';
    const name = `E2E ${stamp}`;

    await page.goto('/auth');
    await expect(page.getByRole('heading', { name: 'Splitwisely' })).toBeVisible();

    await page.getByRole('button', { name: /Need an account/i }).click();
    await page.locator('input[name="name"]').fill(name);
    await page.locator('input[name="email"]').fill(email);
    await page.locator('input[name="password"]').fill(password);
    await page.getByRole('button', { name: 'Sign up' }).click();

    await expect(page).toHaveURL(/dashboard/);
    await expect(page.getByText('Overall balance')).toBeVisible();

    await page.getByRole('link', { name: 'Groups' }).first().click();
    await expect(page).toHaveURL(/groups/);

    await page.locator('input[name="groupName"]').fill(`Trip ${stamp}`);
    await page.getByRole('button', { name: 'Create' }).click();

    await expect(page).toHaveURL(/\/groups\/.+/);
    await expect(page.getByRole('heading', { name: `Trip ${stamp}` })).toBeVisible();

    await page.getByRole('link', { name: 'Add expense' }).click();
    await expect(page).toHaveURL(/expenses\/new/);

    await page.locator('input[name="description"]').fill('Dinner');
    await page.locator('input[name="amount"]').fill('100');

    const createResp = page.waitForResponse(
      (res) => res.url().includes('/expenses') && res.request().method() === 'POST' && res.status() === 201,
    );
    await page.getByRole('button', { name: 'Save expense' }).click();
    await createResp;

    await expect(page).toHaveURL(/\/groups\/[^/]+$/);
    await expect(page.getByRole('heading', { name: 'Expenses' })).toBeVisible();
    await expect(page.locator('.expense-list')).toContainText('Dinner', { timeout: 15_000 });
    await expect(page.getByText('Your balance')).toBeVisible();
  });
});
