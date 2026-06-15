import { test, expect, request } from '@playwright/test';
import { ApiHelper } from '../helpers/api-helper';
import { MaintenancePage } from '../pages/MaintenancePage';

test.describe('Maintenance Mode Screen Block', () => {
  let apiHelper: ApiHelper;

  test.beforeEach(async () => {
    const requestContext = await request.newContext();
    apiHelper = new ApiHelper(requestContext);
    // Ensure maintenance mode is OFF initially
    await apiHelper.toggleMaintenance(false);
  });

  test.afterEach(async () => {
    // Clean up: ensure maintenance mode is turned OFF after the test finishes
    await apiHelper.toggleMaintenance(false);
  });

  test('should display maintenance overlay page and redirect standard visitors when enabled', async ({ page }) => {
    const maintenancePage = new MaintenancePage(page);

    // 1. Verify dashboard loads fine when maintenance is OFF
    await page.goto('/');
    await expect(page.locator('h1')).not.toContainText('Đang bảo trì');

    // 2. Enable maintenance mode programmatically
    await apiHelper.toggleMaintenance(true);

    // 3. Navigate back to / or wait for automatic socket/redirect
    await page.goto('/');
    
    // Verify redirection to /maintenance
    await expect(page).toHaveURL(/\/maintenance/);
    await expect(maintenancePage.heading).toBeVisible();
    await expect(page.locator('body')).toContainText('Hệ thống đang trong quá trình bảo trì');

    // 4. Disable maintenance mode
    await apiHelper.toggleMaintenance(false);

    // 5. Verify real-time Socket.IO automatic redirect back to home (no manual clicking needed due to socket push)
    await expect(page).toHaveURL('http://localhost:5002/', { timeout: 15000 });
    await expect(page.locator('h1')).toContainText('Giải pháp quản lý');
  });
});
