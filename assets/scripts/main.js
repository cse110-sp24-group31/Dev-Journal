// Bind the init() function to run once the page loads
window.addEventListener('DOMContentLoaded', init);

/** Initializes every function, they all stem from here */
async function init() {
  // Attempt to fetch the project items
  try {
    await fetchItems();
  } catch (err) {
    console.log(`Error fetching items: ${err}`);
    return; // Return if fetch fails
  }

  // Populate the page with project cards
  populatePage();
}

/**
 * Fetches all of the project-cards from localStorage and stores them
 * inside the global projects variable.
 * @returns {Promise} Resolves if the items are found in localStorage
 */
async function fetchItems() {
  return new Promise((resolve) => {
    const localProjects = localStorage.getItem('projects');
    if (localProjects) {
      projects = JSON.parse(localProjects);
    } else {
      // Initialize projects as an empty array if not found in localStorage
      projects = [];
    }
    resolve();
  });
}

/**
 * Adds
    * Adds the fetched project items to the webpage
    */
 function populatePage() {
  if (!projects) return;
  const container = document.getElementById('project-cards-parent');
  container.innerHTML = '';
  projects.forEach(item => {
    const card = document.createElement('project-card');
    card.data = item;
    container.appendChild(card);
  });
}