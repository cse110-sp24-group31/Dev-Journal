class ProjectCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    const article = document.createElement('article');
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(`
      .project-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(240, 240, 240, 0.9));
        border-radius: 10px;
        box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.2);
        height: 300px;
        margin-bottom: 20px;
        padding: 15px 25px;
        width: 25%;
        transition: width 0.2s ease, transform 0.2s ease;
        position: relative;
      }

      .project-card:hover {
        transform: translateY(-10px);
        box-shadow: 0px 15px 20px rgba(0, 0, 0, 0.3);
      }

      .project-card .name {
        color: #333;
        font-size: 1.8em;
        font-weight: bold;
        text-align: center;
        transition: font-size 0.2s ease, color 0.2s ease;
        margin-bottom: 10px;
        position: relative;
      }

      .project-card .name:hover {
        font-size: 2em;
        color: #00796b;
      }

      .project-card .project-image {
        align-self: center;
        object-fit: cover;
        border-radius: 10px;
        height: 60%;
        width: 100%;
        transition: transform 0.3s ease;
        position: relative;
      }

      .project-card .project-image:hover {
        transform: scale(1.05);
      }

      .project-card .progress-bar-container {
        width: 100%;
        margin-top: auto;
        position: relative;
      }

      .project-card .progress-bar {
        width: 100%;
        height: 20px;
        background-color: #ddd;
        border-radius: 5px;
        overflow: hidden;
      }

      .project-card .progress-bar-fill {
        width: 0%;
        height: 100%;
        background-color: #00796b;
        text-align: center;
        color: white;
        transition: width 0.2s ease;
      }

      .project-card button {
        background-color: #ffcc00;
        border: none;
        border-radius: 10px;
        color: black;
        padding: 5px 15px;
        margin-right: 5px;
        margin-bottom: 2px;
        cursor: pointer;
        transition: background-color 0.2s ease, transform 0.2s ease;
        font-size: 0.9em;
        position: relative;
      }

      .project-card button:hover {
        background-color: #ffa500;
        transform: scale(1.05);
      }

      @media (max-width: 1460px) {
        .project-card {
          width: 40%;
          height: 250px;
          padding: 10px 15px;
        }

        .project-card .project-image {
          height: 50%;
        }

        .project-card .name {
          font-size: 1.4em;
        }

        .project-card .name:hover {
          font-size: 1.6em;
        }

        .project-card button {
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 0.8em;
        }
      }

      @media (max-width: 800px) {
        .project-card {
          width: 80%;
          height: auto;
          padding: 5px 10px;
        }

        .project-card .project-image {
          height: 40%;
        }

        .project-card .progress-bar-container {
          margin-top: 5px;
        }

        .project-card .progress-bar {
          height: 15px;
        }

        .project-card button {
          font-size: small;
          padding: 4px 10px;
          border-radius: 5px;
          margin-bottom: 2px;
        }

        .project-card .name {
          font-size: 1.2em;
        }

        .progress-bar > .progress-bar-fill {
          font-size: 0.9em;
        }
      }

      @media (max-width: 400px) {
        .project-card {
          width: 100%;
          height: auto;
          padding: 5px;
        }

        .project-card .project-image {
          height: 30%;
        }

        .project-card .progress-bar-container {
          margin-top: 2px;
        }

        .project-card .progress-bar {
          height: 10px;
        }

        .project-card button {
          font-size: smaller;
          padding: 2px 5px;
          border-radius: 3px;
          margin-bottom: 2px;
        }

        .project-card .name {
          font-size: 1em;
        }

        .progress-bar > .progress-bar-fill {
          font-size: 0.8em;
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
          <div class="progress-bar-fill" style="width: ${data.progress || 0}%;">${data.progress || 0}%</div>
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
document.addEventListener("DOMContentLoaded", () => {
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
  const projectDescription = document.getElementById('projectDescription').value.trim();
  const projectImage = document.getElementById('projectImage').value.trim();

  // Input validation

  if (!projectName || !projectDescription || !projectImage) {
    alert("Project name, description, and image are required.");
    return;
  }

  if (projectImage && !isValidURL(projectImage)) {
    alert("Please enter a valid URL for the project image.");
    return;
  }
  
  const newProject = {
    id: `project-${Date.now()}`, // Unique ID for the project
    title: projectName,
    desc: projectDescription,
    image: projectImage,
    progress: 0 // Initialize progress to 0
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
    alert("Project name, description, and image are required.");
    return;
  }

  if (projectImage && !isValidURL(projectImage)) {
    alert("Please enter a valid URL for the project image.");
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
