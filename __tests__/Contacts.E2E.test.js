const puppeteer = require('puppeteer');

describe('Unit test: contact management', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      args: ['--start-maximized']
    });
    page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto('https://cse110-sp24-group31.github.io/Dev-Journal/');
    // Click the "Contacts" link
    await page.click('.nav-links a:nth-child(1)');
  });


  it('should create and delete a contact', async () => {
    await page.type('input[name="name"]', 'Jane Doe');
    await page.click('form input[type="submit"]');
    
    // Verify the new contact is added
  });
});