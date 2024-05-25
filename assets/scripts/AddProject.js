/**
 * Filename: AddProject.js
 * Description:  Functionality relating to the add card modal. 
 */

// Unique project identifier. Initialized using initializeCounter().
let projIdCounter;

/**
 * Opens the add card modal and resets the form inside it.
 */
function openAddCardModal() {
    document.getElementById('addCardForm').reset();
    document.getElementById('addCardModal').style.display = 'block';
}

/**
 * Closes the add card modal and resets the form inside it.
 */
function closeAddCardModal() {
    document.getElementById('addCardForm').reset();
    document.getElementById('addCardModal').style.display = 'none';
}

/**
 * Validates if a given string is a proper URL.
 * @param {string} string - The string to validate as a URL.
 * @return {boolean} Returns true if the string is a valid URL, otherwise false.
 */
function isValidURL(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
}

/**
 * Adds a new project after validating the form data. Saves the project to localStorage,
 * updates the UI, and closes the modal.
 * @param {Event} event - The event object from the form submission.
 */
function addProject(event) {
    incrementCounter();       // Ensures unique ID's
    event.preventDefault();
    
    // Get input data
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
  
    // Add project to projects array and update localStorage
    const newProject = {
      id: projIdCounter, // Unique ID for the project
      title: projectName,
      desc: projectDescription,
      image: projectImage,
      taskIdCounter: 0,
      tasks: [],
      progress: 0, // Initialize progress to 0
    };
    projects.push(newProject);
    saveProjects();
    renderProjects();
    closeAddCardModal();
}

/**
 * Initializes the project ID counter from localStorage or sets it to zero if not previously stored.
 */
function initializeCounter() {
    const storedCounter = localStorage.getItem('projIdCounter');
    projIdCounter = storedCounter ? parseInt(storedCounter, 10) : 0;  // reset to 0 if no projects stored
}
 
/**
 * Increments the global project ID counter and updates the value in localStorage.
 */
function incrementCounter() {
    projIdCounter++;
    localStorage.setItem('projIdCounter', projIdCounter.toString());
}