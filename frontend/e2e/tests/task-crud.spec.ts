import { test, expect, Page } from '@playwright/test';

test.describe('Task CRUD Operations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should create a new task', async ({ page }) => {
    const taskText = `New task ${Date.now()}`;

    // Add task
    await page.getByPlaceholder('작업을 입력하세요').fill(taskText);
    await page.getByRole('button', { name: '추가' }).click();

    // Verify task appears in the list
    await expect(page.getByText(taskText)).toBeVisible();
  });

  test('should complete a task and remove it from list', async ({ page }) => {
    const taskText = `Toggle task ${Date.now()}`;

    // Create a task
    await page.getByPlaceholder('작업을 입력하세요').fill(taskText);
    await page.getByRole('button', { name: '추가' }).click();
    await expect(page.getByText(taskText)).toBeVisible();

    // Find the task item and its complete button
    const taskItem = page.getByText(taskText).locator('..');
    const completeButton = taskItem.getByRole('button', { name: '완료' });

    // Click complete button
    await completeButton.click();

    // Task should disappear from incomplete list
    await expect(page.getByText(taskText)).not.toBeVisible();
  });

  test('should delete a task', async ({ page }) => {
    const taskText = `Delete task ${Date.now()}`;

    // Create a task
    await page.getByPlaceholder('작업을 입력하세요').fill(taskText);
    await page.getByRole('button', { name: '추가' }).click();
    await expect(page.getByText(taskText)).toBeVisible();

    // Delete the task
    const taskItem = page.getByText(taskText).locator('..');
    await taskItem.getByRole('button', { name: '삭제' }).click();

    // Task should no longer exist
    await expect(page.getByText(taskText)).not.toBeVisible();
  });

  test('should handle multiple tasks', async ({ page }) => {
    const tasks = [
      `Task 1 ${Date.now()}`,
      `Task 2 ${Date.now()}`,
      `Task 3 ${Date.now()}`
    ];

    // Create multiple tasks
    for (const task of tasks) {
      await page.getByPlaceholder('작업을 입력하세요').fill(task);
      await page.getByRole('button', { name: '추가' }).click();
      // Wait for the task to appear before adding the next one
      await expect(page.getByText(task)).toBeVisible();
    }

    // Complete first task
    const firstTaskItem = page.getByText(tasks[0]).locator('..');
    const firstCompleteButton = firstTaskItem.getByRole('button', { name: '완료' });
    await firstCompleteButton.click();

    // First task should disappear
    await expect(page.getByText(tasks[0])).not.toBeVisible();

    // Other tasks should remain visible
    await expect(page.getByText(tasks[1])).toBeVisible();
    await expect(page.getByText(tasks[2])).toBeVisible();
  });

  test('should handle empty task input validation', async ({ page }) => {
    // Count initial tasks
    const initialTasks = await page.locator('[data-testid="task-item"]').count();

    // Try to add empty task
    await page.getByRole('button', { name: '추가' }).click();

    // Task count should remain the same
    const finalTasks = await page.locator('[data-testid="task-item"]').count();
    expect(finalTasks).toBe(initialTasks);
  });

  test('should persist tasks after page reload', async ({ page }) => {
    const taskText = `Persistent task ${Date.now()}`;

    // Create a task
    await page.getByPlaceholder('작업을 입력하세요').fill(taskText);
    await page.getByRole('button', { name: '추가' }).click();
    await expect(page.getByText(taskText)).toBeVisible();

    // Reload the page
    await page.reload();

    // Task should still be visible
    await expect(page.getByText(taskText)).toBeVisible();
  });
});