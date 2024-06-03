const puppeteer = require('puppeteer');

describe('Unit test: contact management', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
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

  it('should show an error when the name field is empty', async () => {
    // Clear the name field if it's not already empty
    await page.evaluate(() => {
      document.querySelector('input[name="name"]').value = '';
    });
    // Attempt to submit the form without filling the name
    await page.click('form input[type="submit"]');

    // Verify the error message is displayed
    const errorMessage = await page.evaluate(() => {
      const nameField = document.querySelector('input[name="name"]');
      return nameField.validationMessage;
    });

    expect(errorMessage).toBe('Please fill out this field.');
  });

  it('should create two contacts and filter by category', async () => {
    // Create the first contact (Team Lead)
    await page.type('input[name="name"]', 'Alice TeamLead');
    await page.type('input[name="email"]', 'alice.teamlead@example.com');
    await page.type('input[name="phone"]', '111-111-1111');
    await page.click('#avatar-options img:nth-child(1)'); // Select the first avatar
    await page.click('form input[type="submit"]');

    // Create the second contact (Planner)
    await page.type('input[name="name"]', 'Bob Planner');
    await page.type('input[name="email"]', 'bob.planner@example.com');
    await page.type('input[name="phone"]', '222-222-2222');
    await page.click('#avatar-options img:nth-child(2)'); // Select the second avatar
    await page.click('form input[type="submit"]');

    // Select only Team Leads in the filter
    await page.click('.filter-checkbox[data-category="team-lead"]');

    // Verify only the Team Lead contact is displayed
    const teamLeadVisible = await page.evaluate(() => {
      const teamLead = document.evaluate("//h2[contains(text(), 'Alice TeamLead')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      return teamLead && window.getComputedStyle(teamLead.closest('.person-entry')).display !== 'none';
    });
    expect(teamLeadVisible).toBe(true);

    const plannerVisible = await page.evaluate(() => {
      const planner = document.evaluate("//h2[contains(text(), 'Bob Planner')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      return planner && window.getComputedStyle(planner.closest('.person-entry')).display !== 'none';
    });
    expect(plannerVisible).toBe(false);
  });
});
