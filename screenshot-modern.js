import playwright from 'playwright';

(async () => {
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  
  await page.screenshot({ path: '/tmp/modern-design.png', fullPage: true });
  console.log('Modern design screenshot saved');
  
  await browser.close();
})();
