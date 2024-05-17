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
    createProjectCard(item);
  });
}
/**
 * onclick function of open button
 * @param {*} btn 
 */
function projectCard_onOpenButtonClicked(btn) {
  console.log('call open modal function');
}
function projectCard_onOptionButtonClicked(btn) {
  console.log('options for ' + btn.parentElement.parentElement);
}
function projectCard_onDebugProgressButtonClicked(btn) {
  const card = btn.parentElement.parentElement;
  const pbf = card.querySelector('.progress-bar > .progress-bar-fill');
  var progress = Number(pbf.innerText);
  if (progress >= 100) {
    progress = 0;
  } else {
    progress = progress + Math.floor(Math.random() * 10);
  }
  pbf.style.width = progress + '%';
  pbf.innerText = progress;
}
