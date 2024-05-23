class ProjectCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    const article = document.createElement('article');
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(`
        .project-card {
          flex: 1 0;
          align-items: center;
          background-color: rgba(255, 255, 255, 0.712);
          border-radius: 5px;
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
        <button onclick="this.getRootNode().host.deleteCard(this)">Delete</button>
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

  deleteCard(button) {
    const cardId = this.dataset.id;
    projects = projects.filter(project => project.id !== cardId);
    localStorage.setItem('projects', JSON.stringify(projects));
    this.remove();
  }
}

customElements.define('project-card', ProjectCard);

function openViewCardModal(projectId) {
  const project = projects.find(p => p.id === projectId);
  if (!project) {
    console.error('Project not found');
    return;
  }
  const viewCardModal = document.getElementById('viewCardModal');
  viewCardModal.querySelector('#projectName').value = project.title;
  viewCardModal.querySelector('#projectDescription').value = project.desc;
  viewCardModal.querySelector('#projectImage').value = project.image;
  viewCardModal.dataset.id = project.id;
  viewCardModal.querySelector('#projectName').readOnly = true;
  viewCardModal.querySelector('#projectDescription').readOnly = true;
  viewCardModal.querySelector('#projectImage').readOnly = true;
  viewCardModal.style.display = 'block';
  document.getElementById('saveButton').style.display = 'none';
  document.getElementById('editButton').style.display = 'inline-block';
}

function closeViewCardModal() {
  document.getElementById('viewCardModal').style.display = 'none';
}

// Event listener for adding a new card
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('addCardForm').addEventListener('submit', addCard);
  document.getElementById('editButton').addEventListener('click', editDetails);
  document.getElementById('saveButton').addEventListener('click', saveDetails);
});

function openAddCardModal() {
  document.getElementById('addCardForm').reset();
  document.getElementById('addCardModal').style.display = 'block';
}

function closeAddCardModal() {
  document.getElementById('addCardForm').reset();
  document.getElementById('addCardModal').style.display = 'none';
}

function addCard(event) {
  event.preventDefault();

  const projectName = document.getElementById('projectName').value.trim();
  const projectDescription = document
    .getElementById('projectDescription')
    .value.trim();
  const projectImage = document.getElementById('projectImage').value.trim();

  // Input validation

  if (!projectName || !projectDescription || !projectImage) {
    alert('Project name, description, and image are required.');
    return;
  }

  if (projectImage && !isValidURL(projectImage)) {
    alert('Please enter a valid URL for the project image.');
    return;
  }

  const newProject = {
    id: `project-${Date.now()}`, // Unique ID for the project
    title: projectName,
    desc: projectDescription,
    image: projectImage,
    progress: 0, // Initialize progress to 0
  };

  projects.push(newProject);
  localStorage.setItem('projects', JSON.stringify(projects));

  const card = document.createElement('project-card');
  card.data = newProject;
  document.getElementById('project-cards-parent').appendChild(card);

  closeAddCardModal();
}

function updateProgress(button) {
  const card = button.closest('project-card');
  card.updateProgress();
}

function deleteCard(button) {
  const card = button.closest('project-card');
  const cardId = card.dataset.id;

  projects = projects.filter(project => project.id !== cardId);
  localStorage.setItem('projects', JSON.stringify(projects));

  card.remove();
}

function closeViewCardModal() {
  document.getElementById('viewCardModal').style.display = 'none';
}

function editDetails() {
  const viewCardModal = document.getElementById('viewCardModal');
  viewCardModal.querySelector('#projectName').readOnly = false;
  viewCardModal.querySelector('#projectDescription').readOnly = false;
  viewCardModal.querySelector('#projectImage').readOnly = false;

  document.getElementById('editButton').style.display = 'none';
  document.getElementById('saveButton').style.display = 'inline-block';
}

function saveDetails() {
  const viewCardModal = document.getElementById('viewCardModal');
  const projectId = viewCardModal.dataset.id;
  const project = projects.find(p => p.id === projectId);

  const projectNameInput = viewCardModal.querySelector('#projectName');
  const projectDescInput = viewCardModal.querySelector('#projectDescription');
  const projectImageInput = viewCardModal.querySelector('#projectImage');

  const projectName = projectNameInput.value.trim();
  const projectDescription = projectDescInput.value.trim();
  const projectImage = projectImageInput.value.trim();

  // Input validation
  if (!projectName || !projectDescription || !projectImage) {
    alert('Project name, description, and image are required.');
    return;
  }

  if (projectImage && !isValidURL(projectImage)) {
    alert('Please enter a valid URL for the project image.');
    return;
  }

  project.title = projectName;
  project.desc = projectDescription;
  project.image = projectImage;

  localStorage.setItem('projects', JSON.stringify(projects));

  const card = document.querySelector(`project-card[data-id='${projectId}']`);
  if (card) card.data = project;

  closeViewCardModal();
}
// Helper function to validate URLs
function isValidURL(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}
