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
  projectCard_addProgress(card, Math.floor(Math.random() * 10));
}

function projectCard_onDeleteButtonClicked(btn) {
  //delete this card
  const card = btn.parentElement.parentElement;
  card.remove();
}

/**
 * add progress for this card
 * @param {*} card the project card wrapper, either shadowroot for JS or <div class = "project-card"> for HTML
 * @param {*} delta project progress, integer (will be round to)
 */
function projectCard_addProgress(card, delta) {
  if (isNaN(delta)) {
    console.error(delta + ' is not a number, or is not a number in [0,100]');
    return;
  }
  delta = Math.round(delta);
  const pbf = card.querySelector('.progress-bar > .progress-bar-fill');
  var progress = Number(pbf.innerText);
  projectCard_setProgress(card, progress + delta);
}
/**
 * set the progress for this card
 * @param {*} card the project card wrapper, either shadowroot for JS or <div class = "project-card"> for HTML
 * @param {*} newProgress project progress, integer (will be round to) between 0-100. overflow will be set to 0
 */
function projectCard_setProgress(card, newProgress) {
  if (isNaN(newProgress) || newProgress < 0) {
    console.error(
      newProgress + ' is not a number, or is not a positive number'
    );
    return;
  }
  if (newProgress > 100) {
    newProgress = 0;
  }
  temp = Math.round(newProgress);
  const pbf = card.querySelector('.progress-bar > .progress-bar-fill');
  pbf.style.width = temp + '%';
  pbf.innerText = temp;
}

/**
 * update the project card info
 * @param {HTMLElement} card the project card wrapper, either shadowroot for JS or <div class = "project-card"> for HTML
 * @param {string} title title of the project, string
 * @param {string} desc description of project, string
 * @param {string} imgURL URL of image, string
 * @param {integer} progress project progress, integer between 0-100
 */
function projectCard_update(card, title, desc, imgURL, progress) {
  if (card == undefined) {
    console.log('card is undefined');
    return;
  }
  card.querySelector('.name').innerText = title;
  card.querySelector('.desc').innerText = desc;
  card.querySelector('.project-image').src = imgURL;
  projectCard_setProgress(card, progress);
}
