const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

console.log('Starting screenshot process...');
(async () => {
  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    const files = [
      'index.html', 'beginners.html', 'pricing.html', 
      'instructors.html', 'facility.html', 'access.html', 
      'faq.html', 'contact.html', 'privacy.html'
    ];

    if (!fs.existsSync('wireframes_png')) {
      fs.mkdirSync('wireframes_png');
    }

    for (const file of files) {
      const filePath = `file://${path.resolve(__dirname, file)}`;
      console.log(`Navigating to ${filePath}`);
      await page.goto(filePath, { waitUntil: 'networkidle0' });
      await new Promise(r => setTimeout(r, 1000));
      await page.screenshot({ 
        path: `wireframes_png/${file.replace('.html', '.png')}`, 
        fullPage: true 
      });
      console.log(`Captured ${file}.png`);
    }

    await browser.close();
    console.log('Finished all screenshots.');
  } catch (err) {
    console.error('Error during capture:', err);
  }
})();
