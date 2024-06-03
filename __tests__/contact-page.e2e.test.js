const puppeteer = require('puppeteer');

describe('E2E test: contact management', () => {
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
    await page.click('.nav-links a:nth-child(3)');
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should create, delete, and create multiple contacts', async () => {
    // Create a new contact
    await page.type('input[name="name"]', 'John Doe');
    await page.type('input[name="email"]', 'john.doe@example.com');
    await page.type('input[name="phone"]', '123-456-7890');
    await page.click('#avatar-options img:nth-child(1)'); // Select the first avatar
    await page.click('form input[type="submit"]');

    // Verify the new contact is added
    let contact = await page.evaluate(() => {
      return document.evaluate("//h2[contains(text(), 'John Doe')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    });
    expect(contact).not.toBeNull();

    // Delete the contact
    const deleteButton = await page.evaluateHandle(() => {
      return document.evaluate("//h2[contains(text(), 'John Doe')]/following-sibling::button[contains(text(), 'Delete')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    });

    page.on('dialog', async dialog => {
      await dialog.accept(); // Accept the confirmation dialog
    });

    await deleteButton.asElement().click();

    // Verify the contact is deleted
    contact = await page.evaluate(() => {
      return document.evaluate("//h2[contains(text(), 'John Doe')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    });
    expect(contact).toBeNull();

    // Create the first new contact
    await page.type('input[name="name"]', 'Alice Smith');
    await page.type('input[name="email"]', 'alice.smith@example.com');
    await page.type('input[name="phone"]', '234-567-8901');
    await page.click('#avatar-options img:nth-child(2)'); // Select the second avatar
    await page.click('form input[type="submit"]');

    // Verify the first new contact is added
    let contact1 = await page.evaluate(() => {
      return document.evaluate("//h2[contains(text(), 'Alice Smith')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    });
    expect(contact1).not.toBeNull();

    // Create the second new contact
    await page.type('input[name="name"]', 'Bob Johnson');
    await page.type('input[name="email"]', 'bob.johnson@example.com');
    await page.type('input[name="phone"]', '345-678-9012');
    await page.click('#avatar-options img:nth-child(3)'); // Select the third avatar
    await page.click('form input[type="submit"]');

    // Verify the second new contact is added
    let contact2 = await page.evaluate(() => {
      return document.evaluate("//h2[contains(text(), 'Bob Johnson')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    });
    expect(contact2).not.toBeNull();
  });

  it('should edit an existing contact', async () => {
    // Locate and click edit button for the contact
    const editButton = await page.evaluateHandle(() => {
      return document.evaluate("//h2[contains(text(), 'Alice Smith')]/following-sibling::button[contains(text(), 'Edit')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    });
    await editButton.asElement().click();

    // Clear and edit the name field
    await page.evaluate(() => {
      document.getElementById('edit-name').value = '';
    });
    await page.type('input#edit-name', 'Alice Johnson');

    // Click the save button
    const saveButton = await page.evaluateHandle(() => {
      return document.evaluate("//button[contains(text(), 'Save')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    });
    await saveButton.asElement().click();

    // Verify the contact name is updated
    const updatedContact = await page.evaluate(() => {
      return document.evaluate("//h2[contains(text(), 'Alice Johnson')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    });
    expect(updatedContact).not.toBeNull();
  });
});

describe('E2E test: create contacts for each category', () => {
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
    await page.click('.nav-links a:nth-child(3)');
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should create a contact for Team Leads', async () => {
    await page.type('input[name="name"]', 'Team Lead');
    await page.type('input[name="email"]', 'team.lead@example.com');
    await page.type('input[name="phone"]', '111-111-1111');
    await page.click('#avatar-options img:nth-child(1)'); // Select the first avatar for Team Leads
    await page.click('form input[type="submit"]');

    // Verify the contact is added
    const contact = await page.evaluate(() => {
      return document.evaluate("//h2[contains(text(), 'Team Lead')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    });
    console.log('Contact Team Lead created:', contact !== null);
    expect(contact).not.toBeNull();
  });

  it('should create a contact for Planners', async () => {
    await page.type('input[name="name"]', 'Planner');
    await page.type('input[name="email"]', 'planner@example.com');
    await page.type('input[name="phone"]', '222-222-2222');
    await page.click('#avatar-options img:nth-child(2)'); // Select the second avatar for Planners
    await page.click('form input[type="submit"]');

    // Verify the contact is added
    const contact = await page.evaluate(() => {
      return document.evaluate("//h2[contains(text(), 'Planner')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    });
    console.log('Contact Planner created:', contact !== null);
    expect(contact).not.toBeNull();
  });

  it('should create a contact for Programmers', async () => {
    await page.type('input[name="name"]', 'Programmer');
    await page.type('input[name="email"]', 'programmer@example.com');
    await page.type('input[name="phone"]', '333-333-3333');
    await page.click('#avatar-options img:nth-child(3)'); // Select the third avatar for Programmers
    await page.click('form input[type="submit"]');

    // Verify the contact is added
    const contact = await page.evaluate(() => {
      return document.evaluate("//h2[contains(text(), 'Programmer')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    });
    console.log('Contact Programmer created:', contact !== null);
    expect(contact).not.toBeNull();
  });
});
