let projects; // The variable we'll use to add our array of projects we fetch
let projectsPath = 'assets/json/projects.json'; // the URL to fetch from

// Bind the init() function to run once the page loads
window.addEventListener('DOMContentLoaded', init);
/** Initializes every function, they all stem from here */
async function init() {
  // Attempt to fetch the project items
  try {
    await fetchItems();
  } catch (err) {
    console.log(`Error fetch items: ${err}`);
    return; // Return if fetch fails
  }

  // Event listener for edit button
  document.getElementById('editButton').addEventListener('click', editButton);

    // Event listener for save button
  document.getElementById('saveButton').addEventListener('click', saveButton);
  //populatePage(); // use JS to populate project cards
}

/**
 * Fetches all of the project-cards from projectsPath top and stores them
 * inside the global items variable.
 * @returns {Promise} Resolves if the items are found it localStorage or if they
 *                    are fetched correctly
 */
async function fetchItems() {
  return new Promise((resolve, reject) => {
    const localProjects = localStorage.getItem('projects');
    if (projects) {
      projects = JSON.parse(localProjects);
      resolve();
    } else {
      //if nothing in the local storage, that means it is the first fetch from JSON
      fetch(projectsPath)
        // Grab the response first, catch any errors here
        .then(response => response.json())
        .catch(err => reject(err))
        // Grab the data next, cach errors here as well
        .then(data => {
          if (data) {
            localStorage.setItem('projects', JSON.stringify(data));
            projects = data;
            resolve();
          }
        })
        .catch(err => reject(err));
    }
  });
}

/**
 * Adds the Fetched projects items to the webpage
 */
function populatePage() {
  if (!projects) return;
  // Iterate over each of the items in the array
  projects.forEach(item => {
    //createProjectCard('warmup', 'https://picsum.photos/id/3/415/160', 'a warmup project', 79);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById('addCardForm').addEventListener('submit', addCard);
});

function openAddCardModal() {
  document.getElementById('addCardForm').reset();
  document.getElementById('addCardModal').style.display = 'block';
}

function closeAddCardModal() {
  document.getElementById('addCardForm').reset();
  document.getElementById('addCardModal').style.display = 'none';
}

function editButton() {
  const viewCardModal = document.getElementById('viewCardModal');
  // Remove readonly attributes to allow editing
  viewCardModal.querySelector('#projectName').removeAttribute('readonly');
  viewCardModal.querySelector('#projectDescription').removeAttribute('readonly');
  viewCardModal.querySelector('#projectImage').removeAttribute('readonly');

  // Show save button and hide edit button
  viewCardModal.querySelector('#saveButton').style.display = 'inline-block';
  viewCardModal.querySelector('#editButton').style.display = 'none';
}

function saveButton() {
  const viewCardModal = document.getElementById('viewCardModal');
  // Re-add readonly attributes to prevent further editing
  viewCardModal.querySelector('#projectName').setAttribute('readonly', 'readonly');
  viewCardModal.querySelector('#projectDescription').setAttribute('readonly', 'readonly');
  viewCardModal.querySelector('#projectImage').setAttribute('readonly', 'readonly');

  // Hide save button and show edit button
  viewCardModal.querySelector('#saveButton').style.display = 'none';
  viewCardModal.querySelector('#editButton').style.display = 'inline-block';

  // Optionally, save changes to the actual project card and/or update local storage here
  //here is where it should actualt change the object BUT WE NEED TO CREATE IT IN LOCAL STORAGE STILL
}



function openViewCardModal(button) {
  const card = button.closest('.project-card');

    // Extract data from the card
    const projectName = card.querySelector('.name').textContent;
    const projectDescription = card.querySelector('.desc').textContent;
    const projectImage = card.querySelector('.project-image').src;

    // Populate the modal with the extracted data
    document.getElementById('viewCardModal').querySelector('#projectName').value = projectName;
    document.getElementById('viewCardModal').querySelector('#projectDescription').value = projectDescription;
    document.getElementById('viewCardModal').querySelector('#projectImage').value = projectImage;

  document.getElementById('viewCardModal').style.display = 'block';
}

function closeViewCardModal() {
  document.getElementById('viewCardModal').style.display = 'none';
}

function addCard(event) {
  event.preventDefault();

  const projectName = document.getElementById('projectName').value;
  const projectDescription = document.getElementById('projectDescription').value;
  const projectImage = document.getElementById('projectImage').value || './design/initialSketches/dateView.png';

  const newCard = document.createElement('div');
  newCard.classList.add('project-card');
  newCard.innerHTML = `
      <p class="name">${projectName}</p>
      <img src="${projectImage}" alt="${projectName}" class="project-image">
      <div class="desc">${projectDescription}</div>
      <div class="progress-bar-container">
          <div class="progress-bar">
              <div class="progress-bar-fill" style="width: 0%;">0%</div>
          </div>
      </div>
      <div class="actions">
          <button onclick="updateProgress(this)">Update Progress</button>
          <button onclick="deleteCard(this)">Delete</button>
          <button onclick="openViewCardModal(this)">view</button>
      </div>
  `;

  document.getElementById('project-cards-parent').appendChild(newCard);
  closeAddCardModal();
  document.getElementById('addCardForm').reset();
  let project = {
    title: projectName, 
    image: projectImage, 
    desc: projectDescription,
  };
  //projects.appendChild(project);
}

function updateProgress(button) {
  const progressBar = button.parentElement.previousElementSibling.firstElementChild;
  let progress = parseInt(progressBar.style.width);
  progress = (progress + 10) % 110;
  progressBar.style.width = `${progress}%`;
  progressBar.textContent = `${progress}%`;
}

function deleteCard(button) {
  button.parentElement.parentElement.remove();
}