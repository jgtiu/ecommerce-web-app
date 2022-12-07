import { test, expect } from '@playwright/test';

test('buyer login', async ({ page }) => {
  await page.goto('http://127.0.0.1:8080/');
  const userName = 'buyer1'
  const welcomeMsg = 'Welcome, buyer 1 buyer 1';
  const password = 'buyer1'
  // create a locator
  const getStarted = page.getByRole('link', { name: 'Login' });

  await getStarted.click();

  await page.getByLabel('Username or email').fill(userName);
  await page.getByLabel('Password').fill(password);

  const login = page.getByRole('button', { name: 'Sign in' });

  await login.click();
  await expect(page.locator('span')).toContainText(welcomeMsg);
});

test('login and add to cart', async ({ page }) => {
  await page.goto('http://127.0.0.1:8080/');
  const userName = 'buyer1'
  const password = 'buyer1'
  // create a locator
  const getStarted = page.getByRole('link', { name: 'Login' });

  await getStarted.click();

  await page.getByLabel('Username or email').fill(userName);
  await page.getByLabel('Password').fill(password);

  const login = page.getByRole('button', { name: 'Sign in' });

  await login.click();

  await page.getByRole('link', { name: 'My Buyer Screen' }).click();
  const productName = await page.locator('td:nth-child(1)').nth(0).textContent();
  await page.locator('td:nth-child(5)').nth(0).click();
  await page.getByRole('link', { name: 'My Cart' }).click();
  await expect(page.locator('tr:last-child').nth(1)).toContainText(productName!);
});

test('login and remove from cart', async ({ page }) => {
  await page.goto('http://127.0.0.1:8080/');
  const userName = 'buyer1'
  const password = 'buyer1'
  // create a locator
  const getStarted = page.getByRole('link', { name: 'Login' });

  await getStarted.click();

  await page.getByLabel('Username or email').fill(userName);
  await page.getByLabel('Password').fill(password);

  const login = page.getByRole('button', { name: 'Sign in' });

  await login.click();

  await page.getByRole('link', { name: 'My Buyer Screen' }).click();
  await page.getByRole('link', { name: 'My Cart' }).click();
  await page.locator('tr').nth(1).waitFor();
  const rowCount = await page.locator('tr').count();
  await page.locator('td:nth-child(4)').nth(0).click();
  await page.getByRole('button', { name: 'Refresh' }).click();
  const newCount = await page.locator('tr').count();
  await expect(newCount).toBe(rowCount - 1);
});

test('login and add to cart and checkout', async ({ page }) => {
  await page.goto('http://127.0.0.1:8080/');
  const userName = 'buyer1'
  const password = 'buyer1'
  // create a locator
  const getStarted = page.getByRole('link', { name: 'Login' });

  await getStarted.click();

  await page.getByLabel('Username or email').fill(userName);
  await page.getByLabel('Password').fill(password);

  const login = page.getByRole('button', { name: 'Sign in' });
  await login.click();

  await page.getByRole('link', { name: 'My Buyer Screen' }).click();
  const productName = await page.locator('td:nth-child(1)').nth(0).textContent();
  await page.locator('td:nth-child(5)').nth(0).click();
  await page.getByRole('link', { name: 'My Cart' }).click();
  await expect(page.locator('tr:last-child').nth(1)).toContainText(productName!);
  
  await page.getByRole('button', { name: 'Checkout and Purchase' }).click();
  await page.getByRole('button', { name: 'Refresh' }).click();
  expect(await page.locator('tr').count()).toBe(1);
  await page.getByRole('link', { name: 'My Purchase History' }).click();
  await expect(page.locator('tr:last-child').nth(1)).toContainText(productName!);
});