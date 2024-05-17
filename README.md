# Dev-Journal

Main project for CSE 110. Includes calendar, journal entries, contact pages, progression meter, a task list, all within a polish UI

### node modules

- please install prettier `npm install --save-dev prettier`, really helps with code formatting.

### accessibily

- **project card** has 3 different forms to accomodate for different screen width/height

### home page

# Documentation

## `project.js`

- where all **JS function calls** related to `project-card`, `project-cards-container`, `project-view-modal` goes
- this does not include `project-card.js` as it is an element class

> [!NOTE]
> modify `projectCard_onOpenButtonClicked`, `projectCard_onOptionButtonClicked`, `projectCard_onDebugProgressButtonClicked` to call your functions.

## `project-card.js`

- HTML element name: `project-card`
- JS element class: `ProductCard`

### `createProjectCard(data)`

- create a project card element with given data. add under `#project-cards-parent`

* @param {\*} data project data, defined in `projects.JSON`
* @returns the `project-card` element

### sample project card HTML:

```HTML
<project-card>
  <style>some styles</style>
  #shadow-root
    <p class="name">warmup</p>
    <img src="https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg" alt="warmup" class="project-image">
    <div class="desc">a warmup project</div>
    <div class="progress-bar">
        <div class="progress-bar-fill" style="width: 79%;">79</div>
    </div>
    <div class="actions">
        <button onclick="projectCard_onDebugProgressButtonClicked(this)">progress + random</button>
        <button onclick="projectCard_onOpenButtonClicked(this)">open</button>
        <button onclick="projectCard_onOptionButtonClicked(this)">options</button>
    </div>
</project-card>
```

# projects.JSON

```JSON
  {
    "id": 1,
    "name": "warmup",
    "desc": "a warmup project",
    "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
    "progress": 79
  },

```
