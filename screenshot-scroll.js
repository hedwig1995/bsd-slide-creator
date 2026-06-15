import playwright from 'playwright';

(async () => {
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  
  // Scroll the control panel down
  const controlPanel = await page.$('.control-panel');
  if (controlPanel) {
    await controlPanel.evaluate(el => el.scrollTop = el.scrollHeight);
    await page.waitForTimeout(500);
  }
  
  await page.screenshot({ path: '/tmp/modern-design-scroll.png', fullPage: true });
  console.log('Scrolled screenshot saved');
  
  await browser.close();
})();
