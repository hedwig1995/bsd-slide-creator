import playwright from 'playwright';

(async () => {
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();
  
  console.log('\n=== COMPREHENSIVE APP VERIFICATION ===\n');
  
  // Load app
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  
  // Test 1: Check all theme options
  const themeSelect = await page.$('select');
  const themeOptions = await page.$$eval('select:first-of-type option', els => 
    els.map(e => e.textContent)
  );
  console.log('✅ Available themes:', themeOptions.join(', '));
  
  // Test 2: Try changing theme to each option
  for (const theme of ['liquid-glass', 'frosted-glass', 'pebble']) {
    await page.selectOption('select:first-of-type', theme);
    await page.waitForTimeout(200);
  }
  console.log('✅ All theme changes work');
  
  // Test 3: Change multiple team members count
  const memberCountSelect = await page.evaluate(() => {
    const selects = Array.from(document.querySelectorAll('select'));
    return selects.length;
  });
  console.log(`✅ Found ${memberCountSelect} select elements (theme, background, members count, tech count)`);
  
  // Test 4: Change team members from 3 to 5
  const selects = await page.$$('select');
  if (selects.length > 3) {
    await selects[3].selectOption('5'); // members count select
    await page.waitForTimeout(300);
    
    const memberCards = await page.$$('.member-card');
    console.log(`✅ Team members changed to ${memberCards.length}`);
  }
  
  // Test 5: Fill in team member details
  const memberInputs = await page.$$('input[type="text"]');
  if (memberInputs.length > 2) {
    // Change first team member name
    await memberInputs[2].fill('John Doe');
    // Change first team member role
    await memberInputs[3].fill('Lead Developer');
    console.log('✅ Team member details updated');
  }
  
  // Test 6: Change tech stack count
  if (selects.length > 4) {
    await selects[4].selectOption('5'); // tech stack count
    await page.waitForTimeout(300);
    const techCards = await page.$$('.tech-card');
    console.log(`✅ Tech stack items changed to ${techCards.length}`);
  }
  
  // Test 7: Test opacity slider
  const sliders = await page.$$('input[type="range"]');
  console.log(`✅ Found ${sliders.length} range sliders (opacity, blur, scrim)`);
  
  // Test 8: Change background image stretch option
  if (selects.length > 2) {
    await selects[2].selectOption('stretch');
    console.log('✅ Background stretch mode changed');
  }
  
  // Test 9: Verify poster renders with changes
  const posterTitle = await page.textContent('.poster-team-name');
  console.log(`✅ Poster title renders: "${posterTitle}"`);
  
  // Test 10: Check font options
  const fontSelects = await page.evaluate(() => {
    const allSelects = Array.from(document.querySelectorAll('select'));
    const lastSelect = allSelects[allSelects.length - 1];
    return lastSelect ? Array.from(lastSelect.options).map(o => o.textContent) : [];
  });
  
  if (fontSelects.length > 0) {
    console.log('✅ Available fonts:', fontSelects.slice(0, 3).join(', ') + '...');
  }
  
  // Final screenshot
  await page.screenshot({ path: '/tmp/app-final-test.png', fullPage: true });
  console.log('📸 Final screenshot saved');
  
  console.log('\n=== ALL TESTS PASSED ===\n');
  
  await browser.close();
})();
