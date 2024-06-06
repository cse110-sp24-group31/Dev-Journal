const puppeteer = require('puppeteer');

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

    //button should be visible
    const buttonVisible = await page.waitForSelector('#submitButton', {
      visible: true,
    });
    expect(buttonVisible).not.toBe(null);

    const buttonNotDisabled = await page.$eval(
      '#submitButton',
      el => el.getAttribute('disabled') === null
    );
    expect(buttonNotDisabled).toBe(true);
  });

  it('should not accept empty submission', async () => {
    submitBtnHandle.click();
    const dialog = page.on('dialog', async dialog => {
      return dialog;
    });
    expect(dialog).not.toBe(null);
    //suppress
    await page.evaluate(() => {
      window.confirm = () => true; // Accept the confirm alert
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

    await page.click('#submitButton');

    const isHidden = await page.$eval('#addCardModal', modal => {
      return window.getComputedStyle(modal).display;
    });
    expect(isHidden).toBe('none');
  }, 20000);

  afterAll(async () => {
    await page.waitForSelector('project-card');
  });
});

//TODO: edit and update project card workflow
describe('E2E test: updateCard(title, desc, imgURL, progress)', () => {
  beforeAll(async () => {
    await page.goto('https://cse110-sp24-group31.github.io/Dev-Journal/'); //change this for live server
  });
  it('should have a card', async () => {
    const pcIsNull = await page.$eval('project-card', ele => {
      return ele === null;
    });
    expect(pcIsNull).toBe(false);
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

//E2E testing for deleting the project card
describe('E2E tests: delete project card workflow', () => {
  beforeAll(async () => {
    await page.goto('https://cse110-sp24-group31.github.io/Dev-Journal/'); // change this for live server
  }, 20000);

  let projectCardHandle;

  it('should have at least one project card', async () => {
    // Add a project card if none exists for testing delete functionality
    await page.evaluate(() => {
      const projects = JSON.parse(localStorage.getItem('projects')) || [];
      if (projects.length === 0) {
        projects.push({
          id: 1,
          title: 'Sample Project',
          desc: 'This is a sample project description',
          image:
            'https://via.placeholder.com/150/0000FF/808080%20?Text=SampleImage',
          progress: 50,
        });
        localStorage.setItem('projects', JSON.stringify(projects));
      }
    });

    // Reload the page to render the new project card if added
    await page.reload();
    projectCardHandle = await page.$('project-card');
    expect(projectCardHandle).not.toBe(null);
  });

  it('should delete a project card and remove it from the UI', async () => {
    const initialCardCount = await page.$$eval(
      'project-card',
      cards => cards.length
    );

    // Click the delete button on the project card
    await page.$eval('project-card', card =>
      card.shadowRoot.querySelector('button[onclick*="deleteCard"]').click()
    );

    // Wait for the number of project cards to decrease
    await page.waitForFunction(
      initialCount =>
        document.querySelectorAll('project-card').length < initialCount,
      {},
      initialCardCount
    );

    const finalCardCount = await page.$$eval(
      'project-card',
      cards => cards.length
    );
    expect(finalCardCount).toBe(initialCardCount - 1);
  });

  it('should delete a project card and remove it from localStorage', async () => {
    // Add a project card to ensure at least one exists for deletion testing
    await page.evaluate(() => {
      const projects = JSON.parse(localStorage.getItem('projects')) || [];
      projects.push({
        id: 2,
        title: 'Sample Project 2',
        desc: 'This is another sample project description',
        image:
          'https://via.placeholder.com/150/0000FF/808080%20?Text=SampleImage2',
        progress: 70,
      });
      localStorage.setItem('projects', JSON.stringify(projects));
    });

    // Reload the page to render the new project card if added
    await page.reload();
    projectCardHandle = await page.$('project-card');
    const cardId = await projectCardHandle.evaluate(card => card.dataset.id);

    // Click the delete button on the project card
    await page.$eval('project-card', card =>
      card.shadowRoot.querySelector('button[onclick*="deleteCard"]').click()
    );

    // Wait for the project card to be removed from localStorage
    await page.waitForFunction(
      id => {
        const projectsInStorage =
          JSON.parse(localStorage.getItem('projects')) || [];
        return projectsInStorage.every(project => project.id !== Number(id));
      },
      {},
      cardId
    );

    // Verify the project card is removed from localStorage
    const projectsInStorage = await page.evaluate(
      () => JSON.parse(localStorage.getItem('projects')) || []
    );
    const isCardDeleted = projectsInStorage.every(
      project => project.id !== Number(cardId)
    );
    expect(isCardDeleted).toBe(true);
  });
});

//TODO:
describe('E2E tests: task manager related workflow', () => {});
