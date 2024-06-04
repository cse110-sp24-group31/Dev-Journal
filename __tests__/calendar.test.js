// calendar.test.js
import puppeteer from 'puppeteer';

const websitePage = `https://cse110-sp24-group31.github.io/Dev-Journal/`; //<--- change this link to not liveserver
const taskTitle = 'Test Task';
const taskDesc = 'Test Description';

describe('Calendar and Add Task Tests', () => {
    beforeAll(async () => {
        browser = await puppeteer.launch({ headless: false, slowMo: 50 });
        page = await browser.newPage();
        await page.goto(websitePage);
    });


    // tests that clicking on a date will navigate you to add_task.html
    /* several tests that checks whether or not it is on add_task html
        checks for a back button
        checks for a save task button
    **/
    let backBtnHandle;
    let saveTaskBtnHandle;
    it('not really a test just clicks on a date to attempt to open it up', async () => {
        const iframeElement = await page.$('iframe'); //allows us to interact within the calendarhtml iframe
        const iframe = await iframeElement.contentFrame();
        const firstActiveDate = await iframe.$('.calendar-dates li:not(.inactive)');
        await firstActiveDate.click();
    });

    it('tests specific elements to check if it is currently on the add_task page', async () => {
        const iframeElement = await page.$('iframe'); //allows us to interact within the calendarhtml iframe
        const iframe = await iframeElement.contentFrame();
        backBtnHandle = await iframe.$('.back-button');
        saveTaskBtnHandle = await iframe.$('button[onclick="saveTask()"]');
        expect(backBtnHandle).not.toBe(null); //expects the back button to be detected and not be null
        expect(saveTaskBtnHandle).not.toBe(null); //expects the save button to be detected and not be null
    })

    // tests to see if the delete task button is available    
    let deleteTaskBtnHandle;
    it('should not have a delete task button before any task is created', async () => {
        const iframeElement = await page.$('iframe'); //allows us to interact within the calendarhtml iframe
        const iframe = await iframeElement.contentFrame();
        deleteTaskBtnHandle = await iframe.$('.delete-button');
        expect(deleteTaskBtnHandle).toBe(null); //expects the delete task not to be detected and be null
    });

    // tests to see if required fields implementation works when nothing is typed
    let needToInput = false;
    it('check to see if the program returns required field after no input in created task', async () => {
        const iframeElement = await page.$('iframe'); //allows us to interact within the calendarhtml iframe
        const iframe = await iframeElement.contentFrame();
        saveTaskBtnHandle = await iframe.$('button[onclick="saveTask()"]');
        page.on('dialog', async dialog => {
            needToInput = true;
            await dialog.dismiss();
        }); /*checks whether or not an alert is popped up, if it is then required fields work, and then dismiss it*/
        await saveTaskBtnHandle.click();
        expect(needToInput).toBe(true);//expects the boolean to be true when the require fields pops up
    });

    // tests to see if required fields implementation works when task title is typed but not desc
    it('check to see if the program returns required field after no input in created task', async () => {
        const iframeElement = await page.$('iframe'); //allows us to interact within the calendarhtml iframe
        const iframe = await iframeElement.contentFrame();
        saveTaskBtnHandle = await iframe.$('button[onclick="saveTask()"]');
        await iframe.type('#task-title', taskTitle);//types in given task title
        await saveTaskBtnHandle.click();
        expect(needToInput).toBe(true);//expects the boolean to be true when the require fields pops up
    });

    // tests to see if required fields implementation works when task desc is typed but not desc
    it('check to see if the program returns required field after no input in created task', async () => {
        const iframeElement = await page.$('iframe'); //allows us to interact within the calendarhtml iframe
        const iframe = await iframeElement.contentFrame();
        saveTaskBtnHandle = await iframe.$('button[onclick="saveTask()"]');
        await iframe.type('#task-desc', taskDesc);//types in given task desc
        await saveTaskBtnHandle.click();
        expect(needToInput).toBe(true);//expects the boolean to be true when the require fields pops up
    });
    
    // types in the tasks into the required fields and saves it
    it('should add a task and display it in the task list', async () => {
        const iframeElement = await page.$('iframe'); //allows us to interact within the calendarhtml iframe
        const iframe = await iframeElement.contentFrame();
        saveTaskBtnHandle = await iframe.$('button[onclick="saveTask()"]');
        await iframe.type('#task-title', taskTitle);//types in given task title and description
        await iframe.type('#task-desc', taskDesc);
        await saveTaskBtnHandle.click();
    });

    //tests to see whether or not the created tasks are now in the localstorage
    it('it should check if the added task is in the local storage', async () =>{
        const iframeElement = await page.$('iframe'); //allows us to interact within the calendarhtml iframe
        const iframe = await iframeElement.contentFrame();
        const tasks = await iframe.$$eval('#task-list .task', tasks => tasks.map(task => ({
            title: task.querySelector('.task-title').textContent,
            desc: task.querySelector('.task-desc').textContent
        }))); /* creates a map that contains the task list content */
        expect(tasks).toHaveLength(1); //expect the task list to have a length of 1 now
        expect(tasks[0].title).toBe(taskTitle); //expect the title of the first task to match the given title
        expect(tasks[0].desc).toBe(taskDesc); //expect the desc of the first task to match the given desc
    });

    //tests to see if tasks will be saved locally after a refreshed page
    it('should save tasks locally after refresh', async () => {
        const iframeElement = await page.$('iframe'); //allows us to interact within the calendarhtml iframe
        const iframe = await iframeElement.contentFrame();
        await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
        const savedTasks = await page.evaluate(() => {
            return JSON.parse(localStorage.getItem('tasks'));
        }); /* takes the tasks from the JSON in the localStorage and saves it into savedTasks after refresh*/

        expect(savedTasks).toEqual(expect.arrayContaining([
            expect.objectContaining({
                title: taskTitle,
                desc: taskDesc,
            }) /*expects an array that returns the given task attributes*/
        ]));
    });

    //checks for a new delete task button to appear after a task is create
    it('should have a delete task button', async () => {
        const iframeElement = await page.$('iframe'); //allows us to interact within the calendarhtml iframe
        const iframe = await iframeElement.contentFrame();
        const firstActiveDate = await iframe.$('.calendar-dates li:not(.inactive)');
        await firstActiveDate.click();
        const newframe = await iframeElement.contentFrame();
        deleteTaskBtnHandle = await newframe.$('.delete-button');
        expect(deleteTaskBtnHandle).not.toBe(null); //expects the delete task to be detected and not be null
    });

    //checks for delete task implementation, and see if it is deleted from the localStorage
    it('should delete a task make sure it is deleted from local storage cache', async () => {
        const iframeElement = await page.$('iframe'); //allows us to interact within the calendarhtml iframe
        const iframe = await iframeElement.contentFrame();
        deleteTaskBtnHandle = await iframe.$('.delete-button');
        await deleteTaskBtnHandle.click();
        await page.waitForFunction(() => !document.querySelector('.task'));
        const savedTasks = await iframe.evaluate(() => {
            return JSON.parse(localStorage.getItem('tasks'));
        }); /*takes whatever is in the localStorage and stores into savedTasks*/
        expect(savedTasks).not.toContainEqual(expect.objectContaining({
            title: taskTitle,
            desc: taskDesc,
        }));/*should expect that savedTasks does not have the given task that was supposedly deleted*/
    });

    //tests the back button implementation if it navigates us back to the calendar html page
    //in order to test this we will check if the calendar header is detected
    it('should navigate back to calendar.html when the back button is clicked', async () => {
        const iframeElement = await page.$('iframe'); //allows us to interact within the calendarhtml iframe
        const iframe = await iframeElement.contentFrame();
        backBtnHandle = await iframe.$('.back-button');
        await backBtnHandle.click();
        const calendarIframe = await page.$('iframe'); // Select the iframe again as the page has reloaded
        const calendarFrame = await calendarIframe.contentFrame();
        await calendarFrame.waitForSelector('.calendar-header'); 
        const calendarHeaderExists = await calendarFrame.$('.calendar-header') !== null;
        expect(calendarHeaderExists).toBe(true); // Expects the calendar header to be detected and not be null    
    });
});