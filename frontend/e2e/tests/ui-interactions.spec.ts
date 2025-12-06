import { test, expect } from '@playwright/test';

test.describe('UI Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should handle keyboard interactions', async ({ page }) => {
    const taskText = `Keyboard task ${Date.now()}`;

    // Add task using Enter key
    const taskInput = page.getByPlaceholder('작업을 입력하세요');
    await taskInput.fill(taskText);
    await taskInput.press('Enter');

    await expect(page.getByText(taskText)).toBeVisible();
  });

  test('should show proper focus states', async ({ page }) => {
    // Focus on task input
    const taskInput = page.getByPlaceholder('작업을 입력하세요');
    await taskInput.focus();
    await expect(taskInput).toBeFocused();

    // Tab to add button
    await page.keyboard.press('Tab');
    const addButton = page.getByRole('button', { name: '추가' });
    await expect(addButton).toBeFocused();
  });

  test('should work on mobile viewports', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check if mobile layout works
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByPlaceholder('작업을 입력하세요')).toBeVisible();
    await expect(page.getByRole('button', { name: '추가' })).toBeVisible();
  });

  test('should handle rapid task creation', async ({ page }) => {
    const tasks = Array.from({ length: 5 }, (_, i) => `Rapid task ${i + 1} ${Date.now()}`);

    // Rapidly create tasks
    for (const task of tasks) {
      await page.getByPlaceholder('작업을 입력하세요').fill(task);
      await page.getByPlaceholder('작업을 입력하세요').press('Enter');
      await page.waitForTimeout(100);
    }

    // Verify all tasks are visible
    for (const task of tasks) {
      await expect(page.getByText(task)).toBeVisible();
    }
  });

  test('should handle task text with special characters', async ({ page }) => {
    const timestamp = Date.now();
    const specialChars = [
      `Task with "quotes" ${timestamp}`,
      `Task with <brackets> ${timestamp}`,
      `Task with & ampersand ${timestamp}`,
      `Task with émojis 🎯 ${timestamp}`,
      `Task with ñ special chars ${timestamp}`
    ];

    for (const task of specialChars) {
      await page.getByPlaceholder('작업을 입력하세요').fill(task);
      await page.getByRole('button', { name: '추가' }).click();
      await expect(page.getByText(task, { exact: false })).toBeVisible();
    }
  });
});