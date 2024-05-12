# Dev-Journal

Main project for CSE 110. Includes calendar, journal entries, contact pages, progression meter, a task list, all within a polish UI

# preview

### home page

# Documentation

## project-card

- HTML element name: `project-card`
- JS element class: `ProductCard`
- sample project card HTML:

```HTML
<project-card>
  <div class="project-card">
    <p class="name">warmup</p>
    <img src="https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg" alt="warmup" class="project-image">
    <div class="desc">a warmup project</div>
    <div class="progress-bar">
      <div class="progress-bar-fill" style="width: 79%;">79</div>
    </div>
    <div class="actions">
      <button>progress + random</button>
      <button>open</button>
      <button>options</button>
    </div>
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
