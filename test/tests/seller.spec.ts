import { test, expect } from '@playwright/test';

function makeName(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

test('seller login', async ({ page }) => {
  await page.goto('http://127.0.0.1:8080/');
  const userName = 'seller1'
  const welcomeMsg = 'Welcome, seller 1 seller 1';
  const password = 'seller1'
  // create a locator
  const getStarted = page.getByRole('link', { name: 'Login' });

  await getStarted.click();

  await page.getByLabel('Username or email').fill(userName);
  await page.getByLabel('Password').fill(password);

  const login = page.getByRole('button', { name: 'Sign in' });

  await login.click();
  await expect(page.locator('span')).toContainText(welcomeMsg);
});

test('login and add product', async ({ page }) => {
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

  await page.getByRole('link', { name: 'My Seller Screen' }).click();

  await page.getByRole('link', { name: 'Add Product' }).click();

  const productName = makeName(15);
  const productDescription = makeName(30);
  await page.getByLabel('Name:').fill(productName);
  await page.getByLabel('Description:').fill(productDescription);
  await page.getByLabel('Price:').fill('10');

  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('button', { name: 'Submit' }).click();

  await page.getByRole('link', { name: 'My Products' }).click();
  await expect(page.locator('tr:last-child').nth(1)).toContainText(productName);
  await expect(page.locator('tr:last-child').nth(1)).toContainText(productDescription);
  await expect(page.locator('tr:last-child').nth(1)).toContainText(userName);
});
