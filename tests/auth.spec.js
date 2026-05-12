import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {

  test('user can login with valid credentials', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    
    await page.locator('input[type="email"]').fill('test@test.com');
    await page.locator('input[type="password"]').fill('test1234');
    await page.getByRole('button', { name: /sign in/i }).click();
    
    await expect(page.getByText('Application Board')).toBeVisible();
  });

  test('login fails with wrong password', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    
    await page.locator('input[type="email"]').fill('test@test.com');
    await page.locator('input[type="password"]').fill('wrongpassword');
    await page.getByRole('button', { name: /sign in/i }).click();
    
    await expect(page.getByText(/invalid email or password/i)).toBeVisible();
  });

  test('login fails for non-existent user', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    
    await page.locator('input[type="email"]').fill('nobody@nowhere.com');
    await page.locator('input[type="password"]').fill('test1234');
    await page.getByRole('button', { name: /sign in/i }).click();
    
    await expect(page.getByText(/invalid email or password/i)).toBeVisible();
  });

  test('user can register a new account', async ({ page }) => {
    await page.goto('http://localhost:5173/register');
    
    const uniqueEmail = `user${Date.now()}@test.com`;
    
    await page.locator('input[type="text"]').fill('New User');
    await page.locator('input[type="email"]').fill(uniqueEmail);
    await page.locator('input[type="password"]').fill('test1234');
    await page.getByRole('button', { name: /create|sign up/i }).click();
    
    await expect(page.getByText('Application Board')).toBeVisible();
  });

  test('register fails with duplicate email', async ({ page }) => {
    await page.goto('http://localhost:5173/register');
    
    await page.locator('input[type="text"]').fill('Duplicate User');
    await page.locator('input[type="email"]').fill('test@test.com');
    await page.locator('input[type="password"]').fill('test1234');
    await page.getByRole('button', { name: /create|sign up/i }).click();
    
    await expect(page.getByText(/already in use/i)).toBeVisible();
  });

  test('register fails with short password', async ({ page }) => {
    await page.goto('http://localhost:5173/register');
    
    await page.locator('input[type="text"]').fill('Short Pass');
    await page.locator('input[type="email"]').fill(`short${Date.now()}@test.com`);
    await page.locator('input[type="password"]').fill('123');
    await page.getByRole('button', { name: /create|sign up/i }).click();
    
    await expect(page.getByText(/at least 6 characters/i)).toBeVisible();
  });

  test('session persists after page reload', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    await page.locator('input[type="email"]').fill('test@test.com');
    await page.locator('input[type="password"]').fill('test1234');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page.getByText('Application Board')).toBeVisible();
    
    await page.reload();
    
    await expect(page.getByText('Application Board')).toBeVisible();
  });

  test('logout redirects to login', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    await page.locator('input[type="email"]').fill('test@test.com');
    await page.locator('input[type="password"]').fill('test1234');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page.getByText('Application Board')).toBeVisible();
    
    await page.getByRole('button', { name: /logout/i }).click();
    
    await expect(page).toHaveURL(/login/);
  });

  test('accessing dashboard without auth redirects to login', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('http://localhost:5173/');
    
    await expect(page).toHaveURL(/login/);
  });

});