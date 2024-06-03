/**
 * Filename: ViewProject.js
 * Description:  Functionality relating to the the view card modal. 
 */

/**
 * Opens a modal to view the details of a project identified by its ID. 
 *
 * @param {number|string} projectId The ID of the project to display. This ID is converted to a number internally.
 */
function openViewCardModal(projectId) {
  projectId = Number(projectId);
  const project = projects.find(p => p.id === projectId); // Find project
  if (!project) {
    console.error('Project not found');
    return;
  }

  // If project found, populate the view card model with the project information.
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
  renderTasks(projectId);  // Render tasts for the project 
}

// Close view card modal 
function closeViewCardModal() {
document.getElementById('viewCardModal').style.display = 'none';
}

/**
* Enables editing of the project details by making the name, description, and image fields editable.
* Hides the 'Edit' button and shows the 'Save' button to allow for saving the edited details.
*/
function editDetails() {
  // Allow for editing
  const viewCardModal = document.getElementById('viewCardModal');
  viewCardModal.querySelector('#projectName').readOnly = false;
  viewCardModal.querySelector('#projectDescription').readOnly = false;
  viewCardModal.querySelector('#projectImage').readOnly = false;

  // Hide edit button and show save button. 
  document.getElementById('editButton').style.display = 'none';
  document.getElementById('saveButton').style.display = 'inline-block';
}

/**
* Saves the edited project details from the modal input fields to the project data structure.
* Updates the project details in the projects array and saves the updated array to localStorage.
*/
function saveDetails() {
  // Find the project based on the dataset-id of the view card modal
  const viewCardModal = document.getElementById('viewCardModal');
  const projectId = viewCardModal.dataset.id;
  const project = projects.find(p => p.id === Number(projectId));

  // Retrieved edited input
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

  // Update projects array and save to localStorage
  project.title = projectName;
  project.desc = projectDescription;
  project.image = projectImage;
  saveProjects();
  
  // Update homepage UI 
  const card = document.querySelector(`project-card[data-id='${projectId}']`);
  if (card) card.data = project;

  closeViewCardModal();
}

function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  document.getElementById(tabId).classList.add('active');
}
