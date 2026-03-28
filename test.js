const puppeteer = require('puppeteer');
console.log('started');
(async () => {
  try {
    const browser = await puppeteer.launch({ headless: "new" });
    console.log('browser launched');
    await browser.close();
  } catch (e) {
    console.error(e);
  }
})();
