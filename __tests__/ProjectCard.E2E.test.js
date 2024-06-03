/**
 * E2E test, focus on class interactions
 * MAKE SURE USE: npm test ProjectCard.E2E.test.js --runInBand
 * it has to run in sequence
 */
const TEST_CASE = [
  'title',
  'this is dsc',
  'https://via.placeholder.com/150/0000FF/808080%20?Text=PAKAINFO.com',
  '1',
];

describe('E2E test: create project card workflow', () => {
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
  it('should have an add project card button', async () => {
    addProjectCardBtnHandle = await page.$('.add-project-card');
    expect(addProjectCardBtnHandle).not.toBe(null);
  });

  let addProjectCardModalHandle;
  it('add project modal should be hidden initially', async () => {
    addProjectCardModalHandle = await page.$('#addCardModal');
    const isHidden = await page.$eval('#addCardModal', modal => {
      return window.getComputedStyle(modal).display;
    });
    expect(isHidden).toBe('none');
  });

  it('click add project button should open add project modal', async () => {
    await addProjectCardBtnHandle.click();
    const isHidden = await page.$eval('#addCardModal', modal => {
      return window.getComputedStyle(modal).display;
    });
    expect(isHidden).not.toBe('none');
  });

  let submitBtnHandle;
  it('should have a submit button', async () => {
    submitBtnHandle = await addProjectCardModalHandle.$('#submitButton');
    expect(submitBtnHandle).not.toBe(null);
  });

  it('should not accept empty submission', () => {
    submitBtnHandle.click();
    const dialog = page.on('dialog', async dialog => {
      return dialog;
    });
    expect(dialog).not.toBe(null);
    //suppress
    page.on('dialog', async dialog => {
      await dialog.dismiss();
    });
  });

  it('should create a new project card and close modal', async () => {
    //check value
    await addProjectCardModalHandle.$eval(
      '#projectName',
      (input, str) => {
        input.value = str;
      },
      TEST_CASE[0]
    );
    expect(
      await addProjectCardModalHandle.$eval(
        '#projectName',
        input => input.value
      )
    ).toBe(TEST_CASE[0]);

    await addProjectCardModalHandle.$eval(
      '#projectDescription',
      (input, str) => {
        input.value = str;
      },
      TEST_CASE[1]
    );
    expect(
      await addProjectCardModalHandle.$eval(
        '#projectDescription',
        input => input.value
      )
    ).toBe(TEST_CASE[1]);

    await addProjectCardModalHandle.$eval(
      '#projectImage',
      (input, str) => {
        input.value = str;
      },
      TEST_CASE[2]
    );
    expect(
      await addProjectCardModalHandle.$eval(
        '#projectImage',
        input => input.value
      )
    ).toBe(TEST_CASE[2]);

    await submitBtnHandle.click();

    const isHidden = await page.$eval('#addCardModal', modal => {
      return window.getComputedStyle(modal).display;
    });
    expect(isHidden).toBe('none');
  }, 10000);
});

//TODO: edit and update project card workflow
describe('E2E test: updateCard(title, desc, imgURL, progress)', () => {
  beforeAll(async () => {
    await page.goto('https://cse110-sp24-group31.github.io/Dev-Journal/'); //change this for live server
  }, 20000);
  let projectCardHandle;
  it('should have a card', async () => {
    projectCardHandle = await page.$('project-card');
    expect(projectCardHandle).not.toBe(null);
  });
  it('should be same', async () => {
    //arrange
    //expect(await testUpdateCard(TEST_CASE)).toBe(true);
  });
});

//TODO: this is not complete
async function testUpdateCard(testcase) {
  //action
  await page.$eval(
    'project-card',
    async (card, tc) => {
      await card.update(tc);
    },
    testcase
  );
  //TODO: answer
  return true;
}

//TODO:
describe('E2E tests: delete project card workflow', () => {});

//TODO:
describe('E2E tests: task manager related workflow', () => {});
