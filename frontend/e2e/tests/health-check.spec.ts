import { test, expect } from '@playwright/test';

test.describe('Application Health Check', () => {
  test('should load the application successfully', async ({ page }) => {
    await page.goto('/');

    // Check if the page title is correct
    await expect(page).toHaveTitle(/Task List/);

    // Check if main elements are visible
    await expect(page.getByRole('main')).toBeVisible();
  });

  test('should show task list container', async ({ page }) => {
    await page.goto('/');

    // Check if task list container is present
    await expect(page.getByTestId('task-list')).toBeVisible();
  });

  test('should have working backend connection', async ({ page }) => {
    // Check backend health endpoint
    const response = await page.request.get('http://localhost:8080/health');
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
  });

  test('should load initial tasks from API', async ({ page }) => {
    await page.goto('/');

    // Wait for any API calls to complete
    await page.waitForLoadState('networkidle');

    // Task list should be rendered (even if empty)
    await expect(page.getByTestId('task-list')).toBeVisible();
  });
});