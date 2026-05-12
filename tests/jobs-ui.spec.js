import { test, expect } from '@playwright/test';

async function login(page) {
  await page.goto('http://localhost:5173/login');
  await page.locator('input[type="email"]').fill('test@test.com');
  await page.locator('input[type="password"]').fill('test1234');
  await page.getByRole('button', { name: /sign in/i }).click();
  await expect(page.getByText('Application Board')).toBeVisible();
}

async function openAddModal(page) {
  await page.getByRole('button', { name: '+ Add Application' }).click();
  await expect(page.getByRole('heading', { name: 'Add Application' })).toBeVisible();
}

async function submitModal(page) {
  await page.getByRole('button', { name: 'Add application', exact: true }).click();
}

test.describe('Kanban Board CRUD', () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('empty board shows No applications placeholder', async ({ page }) => {
    const placeholder = page.getByText('No applications').first();
    await expect(placeholder).toBeVisible();
  });

  test('user can add a new job application', async ({ page }) => {
    // Wait for initial jobs to finish loading
    await expect(page.getByText('Loading your applications')).not.toBeVisible();
    
    const uniqueCompany = `Ather Energy ${Date.now()}`;
    const uniqueRole = `SDET-I ${Date.now()}`;
    
    await openAddModal(page);
    await page.getByPlaceholder('Google').fill(uniqueCompany);
    await page.getByPlaceholder('Frontend Engineer').fill(uniqueRole);
    await submitModal(page);
    
    // Give the new card time to appear (10s for large boards)
    await expect(page.getByText(uniqueCompany)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(uniqueRole)).toBeVisible({ timeout: 10000 });
  });

  test('user can add application with optional fields', async ({ page }) => {
    await expect(page.getByText('Loading your applications')).not.toBeVisible();
    
    const uniqueCompany = `Full Details Co ${Date.now()}`;
    
    await openAddModal(page);
    await page.getByPlaceholder('Google').fill(uniqueCompany);
    await page.getByPlaceholder('Frontend Engineer').fill('Senior Dev');
    await page.getByPlaceholder('Bangalore, India').fill('Mumbai');
    await page.getByPlaceholder('₹12 LPA').fill('₹25 LPA');
    await page.getByPlaceholder('https://...').fill('https://example.com/job');
    await submitModal(page);
    
    await expect(page.getByText(uniqueCompany)).toBeVisible({ timeout: 10000 });
  });

  test('Company and Role are required fields', async ({ page }) => {
    await openAddModal(page);
    await submitModal(page);
    await expect(page.getByRole('heading', { name: 'Add Application' })).toBeVisible();
  });

  test('total applications count increases after adding', async ({ page }) => {
    await expect(page.getByText('Loading your applications')).not.toBeVisible();

    const beforeText = await page.getByText(/total application/i).textContent();
    const before = parseInt(beforeText.match(/\d+/)[0]);

    const uniqueCompany = `Count Test ${Date.now()}`;
    await openAddModal(page);
    await page.getByPlaceholder('Google').fill(uniqueCompany);
    await page.getByPlaceholder('Frontend Engineer').fill('Engineer');
    await submitModal(page);

    await expect(page.getByText(uniqueCompany)).toBeVisible({ timeout: 10000 });

    const afterText = await page.getByText(/total application/i).textContent();
    const after = parseInt(afterText.match(/\d+/)[0]);
    expect(after).toBe(before + 1);
  });

  test('new application appears on the board after adding', async ({ page }) => {
    await expect(page.getByText('Loading your applications')).not.toBeVisible();
    
    const company = `Default Status ${Date.now()}`;
    await openAddModal(page);
    await page.getByPlaceholder('Google').fill(company);
    await page.getByPlaceholder('Frontend Engineer').fill('Engineer');
    await submitModal(page);
    await expect(page.getByText(company)).toBeVisible({ timeout: 10000 });
  });

  test('modal closes when clicking X button', async ({ page }) => {
    await openAddModal(page);
    await page.locator('button').filter({ hasText: /^×$|^✕$|^X$/ }).first().click();
    await expect(page.getByRole('heading', { name: 'Add Application' })).not.toBeVisible();
  });

  test('can navigate to Analytics page', async ({ page }) => {
    await page.getByRole('link', { name: /analytics/i }).click();
    await expect(page).toHaveURL(/analytics/i);
  });

});
