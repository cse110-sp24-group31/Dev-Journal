import { projectCard_update } from '../assets/scripts/project.js';
describe('project card test', () => {
  beforeAll(async () => {
    await page.goto('https://cse110-sp24-group31.github.io/Dev-Journal/'); //change this for live server
  });
  it('check updateProjectCard()', async () => {
    console.log('Checking updateProjectCard....');

    // Query select all of the <product-item> elements and return the length of that array
    await page.evaluate(() =>
      projectCard_update(
        document.querySelector('.project-card'),
        'new or',
        'new desc',
        'https://picsum.photos/id/5/415/160',
        29
      )
    );
    const card = page.$eval('.project-card', card => card);
    console.log(card);
  });
});
