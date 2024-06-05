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
    await page.goto('http://127.0.0.1:5501/');
    // Click the "Contacts" link
    await page.click('.nav-links a:nth-child(1)');
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should create and delete a contact', async () => {
    await page.type('input[name="name"]', 'Jane Doe');
    await page.click('form input[type="submit"]');
    
    // Verify the new contact is added
    let contact = await page.evaluate(() => {
      return document.evaluate("//h3[contains(text(), 'Jane Doe')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    });
    expect(contact).not.toBeNull();

    // Delete the contact
    const deleteButton = await page.evaluateHandle(() => {
      return document.evaluate("//button[@class='delete-btn']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    });

    await deleteButton.asElement().click();

    // Verify the contact is deleted
    contact = await page.evaluate(() => {
      return document.evaluate("//h3[contains(text(), 'Jane Doe')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    });
    expect(contact).toBeNull();
  });
});