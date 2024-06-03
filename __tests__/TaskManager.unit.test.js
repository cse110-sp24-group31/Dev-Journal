describe('Unit test: addTaskToProject', () => {
    beforeAll(async () => {
      await page.goto('https://cse110-sp24-group31.github.io/Dev-Journal/');
      await page.evaluate(() => {
        localStorage.clear();
      });
      await page.evaluate(() => {
        const project = {
          id: 1,
          title: 'Test Project',
          desc: 'Description',
          image: 'https://via.placeholder.com/150',
          tasks: [],
        };
        localStorage.setItem('projects', JSON.stringify([project]));
      });
    });
  
    it('should not add a task with empty fields', async () => {
      const result = await page.evaluate(() => {
        document.getElementById('taskName').value = '';
        document.getElementById('taskDueDate').value = '';
        addTaskToProject();
        return JSON.parse(localStorage.getItem('projects'))[0].tasks;
      });
      expect(result.length).toBe(0);
    });
  
    it('should add a valid task', async () => {
      await page.evaluate(() => {
        document.getElementById('taskName').value = 'Test Task';
        document.getElementById('taskDueDate').value = '2024-12-31';
        addTaskToProject();
      });
      const tasks = await page.evaluate(() => JSON.parse(localStorage.getItem('projects'))[0].tasks);
      expect(tasks.length).toBe(1);
      expect(tasks[0].name).toBe('Test Task');
      expect(tasks[0].dueDate).toBe('2024-12-31');
    });
  });
  