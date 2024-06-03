describe('Unit test: addProject', () => {
    beforeAll(async () => {
      await page.goto('https://cse110-sp24-group31.github.io/Dev-Journal/');
      await page.evaluate(() => {
        localStorage.clear();
      });
    });
  
    it('should not add a project with empty fields', async () => {
      const result = await page.evaluate(() => {
        document.getElementById('projectName').value = '';
        document.getElementById('projectDescription').value = '';
        document.getElementById('projectImage').value = '';
        addProject({ preventDefault: () => {} });
        return localStorage.getItem('projects');
      });
      expect(result).toBe(null);
    });
  
    it('should add a valid project', async () => {
      await page.evaluate(() => {
        document.getElementById('projectName').value = 'Test Project';
        document.getElementById('projectDescription').value = 'Description';
        document.getElementById('projectImage').value = 'https://via.placeholder.com/150';
        addProject({ preventDefault: () => {} });
      });
      const projects = await page.evaluate(() => JSON.parse(localStorage.getItem('projects')));
      expect(projects.length).toBe(1);
      expect(projects[0].title).toBe('Test Project');
    });
  });
  