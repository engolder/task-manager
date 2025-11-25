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

  test('should toggle task completion status', async ({ page }) => {
    const taskText = `Toggle task ${Date.now()}`;

    // Create a task
    await page.getByPlaceholder('작업을 입력하세요').fill(taskText);
    await page.getByRole('button', { name: '추가' }).click();
    await expect(page.getByText(taskText)).toBeVisible();

    // Find the task item and its checkbox
    const taskItem = page.getByText(taskText).locator('..');
    const checkbox = taskItem.locator('button[role="checkbox"]');

    // Initially task should be active (not completed)
    await expect(checkbox).toHaveAttribute('data-state', 'unchecked');

    // Toggle to completed
    await checkbox.click();
    await expect(checkbox).toHaveAttribute('data-state', 'checked');

    // Toggle back to active
    await checkbox.click();
    await expect(checkbox).toHaveAttribute('data-state', 'unchecked');
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
    const firstCheckbox = firstTaskItem.locator('button[role="checkbox"]');
    await firstCheckbox.click();
    await expect(firstCheckbox).toHaveAttribute('data-state', 'checked');

    // Other tasks should remain active
    const secondCheckbox = page.getByText(tasks[1]).locator('..').locator('button[role="checkbox"]');
    const thirdCheckbox = page.getByText(tasks[2]).locator('..').locator('button[role="checkbox"]');
    await expect(secondCheckbox).toHaveAttribute('data-state', 'unchecked');
    await expect(thirdCheckbox).toHaveAttribute('data-state', 'unchecked');
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