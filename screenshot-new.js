import playwright from 'playwright';

(async () => {
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  
  await page.screenshot({ path: '/tmp/new-design.png', fullPage: false });
  console.log('New design screenshot saved');
  
  await browser.close();
})();
