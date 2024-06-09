const puppeteer = require('puppeteer');

describe('E2E test: contact management', () => {
  beforeAll(async () => {
    await page.goto('https://cse110-sp24-group31.github.io/Dev-Journal/'); //change this for live server
  });
  it('should have no project in the local storage', async () => {
    const res = await page.evaluate(() => {
      localStorage.getItem('projects');
    });
    expect(res).toBe(undefined);
  });

  let addProjectCardBtnHandle;
  it('should add contact', async () => {
    addProjectCardBtnHandle = await page.$('.add-project-card');
    expect(addProjectCardBtnHandle).not.toBe(null);
  });

  let addProjectCardModalHandle;
  it('should delete contact using id', async () => {
    addProjectCardModalHandle = await page.$('#addCardModal');
    const isHidden = await page.$eval('#addCardModal', modal => {
      return window.getComputedStyle(modal).display;
    });
    expect(isHidden).toBe('none');
  });
});