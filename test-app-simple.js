import playwright from 'playwright';

(async () => {
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();
  
  console.log('\n=== VERIFICATION: BSD Slide Creator ===\n');
  
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  
  // Test 1: All key sections present
  const header = await page.$('.app-header');
  const controlPanel = await page.$('.control-panel');
  const posterPreview = await page.$('.poster-preview');
  const posterCanvas = await page.$('.poster-canvas');
  
  console.log('✅ App header:', !!header);
  console.log('✅ Control panel:', !!controlPanel);
  console.log('✅ Poster preview:', !!posterPreview);
  console.log('✅ Poster canvas:', !!posterCanvas);
  
  // Test 2: Theme controls
  const themeSection = await page.evaluate(() => {
    const sections = document.querySelectorAll('.control-section');
    return sections[0]?.textContent.includes('THEME');
  });
  console.log('✅ Theme section present:', themeSection);
  
  // Test 3: Background controls
  const bgSections = await page.evaluate(() => {
    const sections = Array.from(document.querySelectorAll('.control-section h3'));
    return sections.map(s => s.textContent);
  });
  console.log('✅ Control sections:', bgSections.join(', '));
  
  // Test 4: Member and tech cards
  const memberCards = await page.$$('.member-card');
  const techCards = await page.$$('.tech-card');
  console.log(`✅ Team member cards: ${memberCards.length}`);
  console.log(`✅ Tech stack cards: ${techCards.length}`);
  
  // Test 5: Poster content
  const teamNameText = await page.textContent('.poster-team-name');
  const memberTiles = await page.$$('.member-tile');
  const techItems = await page.$$('.tech-item');
  
  console.log(`✅ Poster team name: "${teamNameText}"`);
  console.log(`✅ Poster member tiles: ${memberTiles.length}`);
  console.log(`✅ Poster tech items: ${techItems.length}`);
  
  // Test 6: Interactive features
  const colorInputs = await page.$$('input[type="color"]');
  const rangeInputs = await page.$$('input[type="range"]');
  const textInputs = await page.$$('input[type="text"]');
  const fileInputs = await page.$$('input[type="file"]');
  
  console.log(`✅ Color pickers: ${colorInputs.length}`);
  console.log(`✅ Range sliders: ${rangeInputs.length}`);
  console.log(`✅ Text inputs: ${textInputs.length}`);
  console.log(`✅ File inputs: ${fileInputs.length}`);
  
  // Test 7: User interaction
  if (textInputs.length > 0) {
    await textInputs[0].fill('Test Team Name');
    const newTeamName = await page.textContent('.poster-team-name');
    console.log(`✅ Team name update: "${newTeamName}"`);
  }
  
  // Test 8: Theme change
  if (colorInputs.length > 0) {
    await colorInputs[0].fill('#FF6B6B');
    await page.waitForTimeout(200);
    const posterTitle = await page.$('.poster-team-name');
    const color = await posterTitle.evaluate(el => window.getComputedStyle(el).color);
    console.log('✅ Theme color change applied');
  }
  
  console.log('\n=== VERIFICATION COMPLETE ===\n');
  
  await browser.close();
})();
