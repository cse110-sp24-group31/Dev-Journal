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
      return localStorage.getItem('projects');
    });
    expect(res).toBe(null);
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

    // Button should be visible
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
    page.on('dialog', async dialog => {
      await dialog.accept(); // Accept the alert
    });
    await page.click('#submitButton');

    // Check if an alert is present
    const alert = await page.evaluate(() => {
      return window.alert; // Get the global alert function
    });
    expect(alert).toBeDefined();
  });

  it('fill in all input fields', async () => {
    // Check value
    await page.$eval(
      '#addCardModal #projectName',
      (input, str) => {
        input.value = str;
      },
      TEST_CASE[0]
    );
    expect(
      await page.$eval('#addCardModal #projectName', input => input.value)
    ).toBe(TEST_CASE[0]);

    await addProjectCardModalHandle.$eval(
      '#addCardModal #projectDescription',
      (input, str) => {
        input.value = str;
      },
      TEST_CASE[1]
    );
    expect(
      await addProjectCardModalHandle.$eval(
        '#addCardModal #projectDescription',
        input => input.value
      )
    ).toBe(TEST_CASE[1]);

    await addProjectCardModalHandle.$eval(
      '#addCardModal #projectImage',
      (input, str) => {
        input.value = str;
      },
      TEST_CASE[2]
    );
    expect(
      await addProjectCardModalHandle.$eval(
        '#addCardModal #projectImage',
        input => input.value
      )
    ).toBe(TEST_CASE[2]);
  });

  it('should create a new project card and close modal', async () => {
    await page.click('#submitButton');
    await page.waitForSelector('project-card');

    const isHidden = await page.$eval('#addCardModal', modal => {
      return window.getComputedStyle(modal).display;
    });
    expect(isHidden).toBe('none');
  });
});

// E2E testing for updating the project card
describe('E2E test: update project card workflow', () => {
  beforeAll(async () => {
    await page.goto('https://cse110-sp24-group31.github.io/Dev-Journal/'); // change this for live server
  });

  it('should have at least one project card', async () => {
    // Add a project card if none exists for testing update functionality
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
    const projectCardHandle = await page.$('project-card');
    expect(projectCardHandle).not.toBe(null);
  });

  it('should update the project card', async () => {
    const newTitle = 'Updated Project Title';
    const newDesc = 'Updated project description';
    const newImage = 'https://via.placeholder.com/150/FF0000/FFFFFF?Text=NewImage';
    const newProgress = 75;

    // Open the edit modal for the first project card
    await page.$eval('project-card', card => {
      card.shadowRoot.querySelector('button[onclick*="openViewCardModal"]').click();
    });

    // Fill in the new details
    await page.$eval(
      '#viewCardModal #projectName',
      (input, newTitle) => {
        input.readOnly = false;
        input.value = newTitle;
      },
      newTitle
    );

    await page.$eval(
      '#viewCardModal #projectDescription',
      (input, newDesc) => {
        input.readOnly = false;
        input.value = newDesc;
      },
      newDesc
    );

    await page.$eval(
      '#viewCardModal #projectImage',
      (input, newImage) => {
        input.readOnly = false;
        input.value = newImage;
      },
      newImage
    );

    // Click save button
    await page.click('#saveButton');

    // Verify that the project card has been updated
    const projectCardData = await page.$eval('project-card', card => {
      return {
        title: card.shadowRoot.querySelector('.name').textContent,
        desc: card.shadowRoot.querySelector('.desc').textContent,
        image: card.shadowRoot.querySelector('.project-image').src,
        progress: parseInt(card.shadowRoot.querySelector('.progress-bar-fill').textContent),
      };
    });

    expect(projectCardData.title).toBe(newTitle);
    expect(projectCardData.desc).toBe(newDesc);
    expect(projectCardData.image).toBe(newImage);
    expect(projectCardData.progress).toBe(newProgress);
  });
});

// E2E testing for deleting the project card
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

// TODO:
describe('E2E tests: task manager related workflow', () => {});
