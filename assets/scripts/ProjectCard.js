/**
 * Filename: ProjectCard.js
 * Description:  This script handles the rendering and interaction logic for project cards with local storage. 
 */

/**
 * Define the ProjectCard Web Component along with it's styling.
 */
class ProjectCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    const article = document.createElement('article');
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(`
        .project-card {
          flex: 1;
          align-items: center;
          background-color: rgba(255, 255, 255, 0.712);
          border-radius: 10px;
          display: grid;
          grid-template-areas:
            'name'
            'project-image'
            'desc'
            'progress-bar'
            'actions';
          grid-template-rows: 10% 40% 30% 5% 10%;
          grid-row-gap: 1.5%;
          height: 400px; /*height should remain constant */
          width: 320px;
          filter: drop-shadow(0px 10px 10px rgb(0, 0, 0, 0.4));
          padding: 10px 20px;
        }

        .project-card .name {
          color: rgb(0, 0, 0);
          font-size: 1.8em;
          font-weight: bold;
        }

        .project-card .name:hover {
          font-size: 2em;
          margin: 0;
          white-space: wrap;
          overflow: auto;
          text-overflow: unset;
          transition: 0.1s ease all;
        }

        .project-card img {
          width = 100px;
        }

        .project-card button {
          background-color: rgb(255, 208, 0);
          border: none;
          border-radius: 5px;
          color: black;
          justify-self: center;
          height: auto;
          max-height: 50px;
          padding: 8px 20px;
          transition: 0.1s ease all;
          margin-right: 5px;
          margin-bottom: 2px;
        }

        .project-card button:hover {
          background-color: rgb(255, 166, 0);
          cursor: pointer;
          transition: 0.1s ease all;
        }

        .project-card .project-image {
          align-self: center;
          justify-self: center;
          object-fit: fill;
          height: 100%;
          width: 100%;
        }
        .project-card .progress-bar {
          width: 100%;
          background-color: grey;
        }

        .project-card .desc {
          width: 90%;
          height: 80%;
          align-self: center;
          overflow: auto;
          text-align: left;
          padding-top: 5%;
          padding-left: 5%;
          padding-right: 5%;
          text-anchor: middle;
          border-radius: 5% 5% 5% 5%;
          background-color: rgba(0, 0, 0, 0.164);
        }
        .progress-bar {
          height: 100%;
        }
        .progress-bar > .progress-bar-fill {
          width: 12%;
          height: 100%;
          background-color: rgb(0, 128, 122);
          text-align: center;
          color: white;
        }

        /**
        * accessibility: 3 stages
        * stage 1: full display, use default CSS
        * stage 2: hide image
        * stage 3: hide image and desc
        */
        /*half height*/
        @media (max-height: 600px) or (max-width: 1200px) {
          .project-card {
            flex: 1 0;
            grid-template-areas:
              'name'
              'desc'
              'progress-bar'
              'actions';
            grid-template-rows: 10% 40% 10% 40%;
            grid-row-gap: 1%;
            height: 150px;
            min-height: 100px;
            width: 200px;
            min-width: 60px;
            padding: 5px 10px;
          }
          .project-card .project-image {
            display: none;
          }
          .project-card .name {
            font-size: 1em;
          }
          .project-card .name:hover {
            font-size: 1.2em;
            transition: 0.1s ease all;
          }
          .project-card button {
            border-radius: 3px;
            height: auto;
            padding: 4px 10px;
            margin-right: 5px;
            margin-bottom: 3px;
          }
        }
        /*smallest display*/
        @media (max-height: 400px) or (max-width: 800px) {
          .project-card {
            flex: 1 0;
            grid-template-areas:
              'name'
              'progress-bar'
              'actions';
            grid-template-rows: 20% 20% 60%;
            grid-row-gap: 1%;
            height: 70px;
            min-height: 30px;
            width: 30px;
            min-width: 30px;
            padding: 2px 5px;
            min-width: 100px;
          }
          .project-card .project-image {
            display: none;
          }
          .project-card .desc {
            display: none;
          }
          .project-card button {
            height: auto;
            font-size: small;
            padding: 0px;
            border-radius: 0px;
            margin-right: 2px;
          }
          .project-card .name {
            font-size: 1em;
          }
          .progress-bar > .progress-bar-fill {
            text-align: center;
            font-size: 1em;
            text-overflow: ellipsis;
          }
        }

    `);
    this.shadowRoot.adoptedStyleSheets = [sheet];
    article.classList.add('project-card');
    this.shadowRoot.appendChild(article);
  }

  set data(data) {
    if (!data) return;
    this.dataset.id = data.id;
    this.shadowRoot.querySelector('article').innerHTML = `
      <p class="name">${data.title}</p>
      <img src="${data.image}" alt="${data.title}" class="project-image">
      <div class="desc">${data.desc}</div>
      <div class="progress-bar-container">
        <div class="progress-bar">
          <div class="progress-bar-fill" style="width: ${
            data.progress || 0
          }%;">${data.progress || 0}%</div>
        </div>
      </div>
      <div class="actions">
        <button onclick="this.getRootNode().host.updateProgress(this)">Update Progress</button>
        <button onclick="this.getRootNode().host.deleteCard()">Delete</button>
        <button onclick="openViewCardModal('${data.id}')">View</button>
      </div>
    `;
  }

  updateProgress(button) {
    const progressBar = this.shadowRoot.querySelector('.progress-bar-fill');
    let progress = parseInt(progressBar.style.width);
    progress = (progress + 10) % 110;
    progressBar.style.width = `${progress}%`;
    progressBar.textContent = `${progress}%`;

    // Update the project progress in the localStorage
    const project = projects.find(p => p.id === this.dataset.id);
    project.progress = progress;
    localStorage.setItem('projects', JSON.stringify(projects));
  }

  deleteCard() {
    let cardId = this.dataset.id;
    cardId = Number(cardId);
    projects = projects.filter(project => project.id !== cardId);
    localStorage.setItem('projects', JSON.stringify(projects));
    renderProjects();
  }
}
customElements.define('project-card', ProjectCard);   

// Stores all project data for all projects. 
let projects = []

// Display each project in the projects array as a ProjectCard Web Componnet
function renderProjects() {
  const projContainer = document.getElementById('project-cards-wrap');
  if (projects.length == 0) { projIdCounter = 0; }
  projContainer.innerHTML = '';
  projects.forEach(project => {
    const card = document.createElement('project-card');
    card.data = project;
    projContainer.appendChild(card);
  });
}

// Save the current projects array to 'projects' in localStorage
function saveProjects() {
  localStorage.setItem('projects', JSON.stringify(projects));
}

// Load projects array with stored 'projects' from localStorage
function loadProjects() {
  const storedProjs = localStorage.getItem('projects');
  if (storedProjs) {
      projects = JSON.parse(storedProjs);
  }
}

/**
 * Upon inital DOM load, initialize projectIdCounter and projects from localStorage, and render them onto the UI.
 * Additionally, add necessary event listeners. 
 * 
 * Note: projectIdCounter is defined in AddProject.js
 */
document.addEventListener('DOMContentLoaded', () => {
  initializeCounter();
  loadProjects();
  renderProjects(); 
  document.getElementById('addCardForm').addEventListener('submit', addProject);
  document.getElementById('editButton').addEventListener('click', editDetails);
  document.getElementById('saveButton').addEventListener('click', saveDetails);
  document.getElementById('taskDueDate').addEventListener('change', updateDateColor);
  document.getElementById('addTaskButton').addEventListener('click', addTaskToProject);
});