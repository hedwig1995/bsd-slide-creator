import playwright from 'playwright';

(async () => {
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();
  
  console.log('Navigating to http://localhost:5173/');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  
  // Check for main elements
  const headerExists = await page.$('.app-header');
  const controlPanelExists = await page.$('.control-panel');
  const posterPreviewExists = await page.$('.poster-preview');
  
  console.log('Header exists:', !!headerExists);
  console.log('Control panel exists:', !!controlPanelExists);
  console.log('Poster preview exists:', !!posterPreviewExists);
  
  // Check for title
  const title = await page.title();
  console.log('Page title:', title);
  
  // Take screenshot
  await page.screenshot({ path: '/tmp/app-initial.png', fullPage: true });
  console.log('Screenshot saved to /tmp/app-initial.png');
  
  // Test theme selector
  const themeSelect = await page.$('select');
  if (themeSelect) {
    console.log('Theme selector found');
    await themeSelect.selectOption('frosted-glass');
    console.log('Changed theme to frosted-glass');
  }
  
  // Test color picker
  const colorInput = await page.$('input[type="color"]');
  if (colorInput) {
    console.log('Color picker found');
    await colorInput.fill('#FF0000');
    console.log('Changed color to red');
  }
  
  // Test team name input
  const textInputs = await page.$$('input[type="text"]');
  if (textInputs.length > 0) {
    await textInputs[0].fill('My BSD Team');
    console.log('Changed team name to "My BSD Team"');
  }
  
  // Take screenshot after interactions
  await page.screenshot({ path: '/tmp/app-after-changes.png', fullPage: true });
  console.log('Screenshot after changes saved');
  
  await browser.close();
  console.log('Test completed successfully');
})();
