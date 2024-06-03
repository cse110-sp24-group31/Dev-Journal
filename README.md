
# Dev-Journal

Main project for CSE 110. Includes calendar, journal entries, contact pages, progression meter, a task list, all within a polish UI

# Testing

- run tests using: `npm test --runInBand`, some test suits need to run in sequence

### node modules

- run this `npm install --save-dev prettier eslint puppeteer jest`

### accessibily

- **project card** has 3 different forms to accomodate for different screen width/height

### home page

# Documentation

# `TaskManager.js`

- Filename: TaskManager.js
- Description: Functionality relating to the task manager of the view card modal.

## getters and setters

### `getTasksByProjectID(projectID)`

- get all tasks by the project ID, return empty array if invalid
- @param {\*} projectID the project ID
- @returns an array of tasks

### `getCompletedTasksByProjectID(projectID)`

- get all completed tasks of this project, including due and undue tasks
- @param {\*} projectID the project ID
- @returns an array of completed projects

### `getCompletedTasksByProjectID(projectID) `

- get all completed tasks of this project, including due and undue tasks
- @param {\*} projectID the project ID
- @returns an array of completed projects

### `getProgressByProjectID(projectID)`

- return % completed, 0-100; if project does not exist return 0
- @param {\*} projectID the project ID

## `ProjectCard.js`

- HTML element name: `project-card`
- JS element class: `ProjectCard`
- access instance via access its HTML element

## instance functions

### `updateCard(title, desc, imgURL, progress)`

- update this project card
- @param {string} title title of the project, string
- @param {string} desc description of project, string
- @param {string} imgURL URL of image, string
- @param {integer} progress project progress, integer between 0-100

### `updateProgress(progress)`

- this function should be automatically called upon change in the task manager.
- call this manually if you wish only change progress of this project. WILL NOT change actual data
- @param {integer} progress new progress [0-100]

### `deleteCard()`

- delete this project card and its project

## global functions

### `saveProjects()`

- Save the current projects array to 'projects' in localStorage

### `updateProjects()`

- reload from local storage and update all project cards.

### `loadProjects()`

- Load projects array with stored 'projects' from localStorage

# Local Storage

## projects

> where all data of projects stored. a typical project data look like:

```JSON
{
  "id": 1,
  "title": "df",
  "desc": "sdaf",
  "image": "https://picsum.photos/200/300",
  "taskIdCounter": 1,
  "tasks": [
    {
      "id": 1,
      "name": "ads",
      "dueDate": "2024-06-06",
      "completed": false
    }
  ],
  "progress": 0
}
```
