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
    await page.click('.nav-links a:nth-child(3)');
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should create a new contact', async () => {
    await page.type('input[name="name"]', 'Jane Doe');
    await page.type('input[name="email"]', 'jane.doe@example.com');
    await page.type('input[name="phone"]', '123-456-7890');
    // Select an avatar
    await page.click('#avatar-options img:nth-child(1)'); // Select the first avatar
    await page.click('form input[type="submit"]');

    // Verify the new contact is added
    const contact = await page.evaluate(() => {
      return document.evaluate("//h2[contains(text(), 'Jane Doe')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    });
    expect(contact).not.toBeNull();
  });

  it('should edit an existing contact', async () => {
    // Locate and click edit button for the contact
    const editButton = await page.evaluateHandle(() => {
      return document.evaluate("//h2[contains(text(), 'Jane Doe')]/following-sibling::button[contains(text(), 'Edit')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    });
    await editButton.asElement().click();

    // Clear and edit the name field
    await page.evaluate(() => {
      document.getElementById('edit-name').value = '';
    });
    await page.type('input#edit-name', 'Jane Smith');

    // Click the save button
    const saveButton = await page.evaluateHandle(() => {
      return document.evaluate("//button[contains(text(), 'Save')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    });
    await saveButton.asElement().click();

    // Verify the contact name is updated
    const updatedContact = await page.evaluate(() => {
      return document.evaluate("//h2[contains(text(), 'Jane Smith')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    });
    expect(updatedContact).not.toBeNull();
  });

  it('should delete an existing contact', async () => {
    // Locate and click delete button for the contact
    const deleteButton = await page.evaluateHandle(() => {
      return document.evaluate("//h2[contains(text(), 'Jane Smith')]/following-sibling::button[contains(text(), 'Delete')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    });

    page.on('dialog', async dialog => {
      await dialog.accept(); // Accept the confirmation dialog
    });

    await deleteButton.asElement().click();

    // Verify the contact is deleted
    const contact = await page.evaluate(() => {
      return document.evaluate("//h2[contains(text(), 'Jane Smith')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    });
    expect(contact).toBeNull();
  });
});
