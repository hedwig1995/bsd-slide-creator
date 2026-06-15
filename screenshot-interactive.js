import playwright from 'playwright';

(async () => {
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  
  // Change theme to frosted glass
  const themeSelect = await page.$('select');
  if (themeSelect) {
    await themeSelect.selectOption('frosted-glass');
    await page.waitForTimeout(300);
  }
  
  // Change theme color to a vibrant purple
  const colorInputs = await page.$$('input[type="color"]');
  if (colorInputs.length > 0) {
    await colorInputs[0].fill('#A855F7');
    await page.waitForTimeout(300);
  }
  
  // Change team name
  const textInputs = await page.$$('input[type="text"]');
  if (textInputs.length > 0) {
    await textInputs[0].fill('Design Team');
    await page.waitForTimeout(300);
  }
  
  await page.screenshot({ path: '/tmp/modern-design-interactive.png', fullPage: true });
  console.log('Interactive screenshot saved');
  
  await browser.close();
})();
