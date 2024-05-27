/**
 * Filename: TaskManager.js
 * Description:  Functionality relating to the task manager of the view card modal.
 */

/**
 * getter and setter for task
 */
/**
 * get all tasks by the project ID, return empty array if invalid
 * @param {*} projectID the project ID
 * @returns an array of tasks
 */
function getTasksByProjectID(projectID) {
  return projects.find(p => p.id === projectID).tasks;
}
/**
 * get all completed tasks of this project, including due and undue tasks
 * @param {*} projectID the project ID
 * @returns an array of completed projects
 */

function getCompletedTasksByProjectID(projectID) {
  const ts = getTasksByProjectID(projectID);
  return ts.filter(t => t.completed === true);
}
/**
 * return % completed, 0-100; if project does not exist return 0
 * @param {*} projectID the project ID
 */
function getProgressByProjectID(projectID) {
  const ts = getTasksByProjectID(projectID);
  const cs = getCompletedTasksByProjectID(projectID);
  const res = cs.length / ts.length;
  if (Number.isNaN(res)) {
    return 0;
  }
  return Math.round(res * 100);
}
/**
 * Interpolates between two RGB colors based on a given factor.
 *
 * @param {number[]} color1 The first RGB color as an array of three numbers.
 * @param {number[]} color2 The second RGB color as an array of three numbers.
 * @param {number} [factor=0.5] The interpolation factor between the two colors. Defaults to 0.5.
 * @returns {number[]} The interpolated RGB color as an array of three numbers.
 */
function interpolateColor(color1, color2, factor) {
  if (arguments.length < 3) {
    factor = 0.5;
  }
  var result = color1.slice();
  for (var i = 0; i < 3; i++) {
    result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
  }
  return result;
}

/**
 * Determines the color representation based on the number of days left.
 * Colors represent urgency: green for no immediate urgency, yellow for approaching deadline,
 * and red for past due or immediate action required.
 *
 * @param {number} daysLeft The number of days left until the event or deadline.
 * @returns {number[]} An RGB color array representing the urgency based on the number of days left:
 *                      green (> 14 days), yellow (between 7 and 14 days), or red (< 7 days).
 */
function getColorForDays(daysLeft) {
  const green = [0, 128, 0];
  const yellow = [255, 255, 0];
  const red = [255, 0, 0];

  if (daysLeft < 0) {
    return red;
  } else if (daysLeft <= 7) {
    return interpolateColor(yellow, red, (7 - daysLeft) / 7);
  } else if (daysLeft <= 14) {
    return interpolateColor(green, yellow, (14 - daysLeft) / 7);
  } else {
    return green;
  }
}

/**
 * Renders all tasks related to a specific project into the HTML element with the ID 'tasksContainer'.
 *
 * @param {number|string} projectId The ID of the project whose tasks are to be displayed.
 *                                   The ID is converted to a number inside the function.
 */
function renderTasks(projectId) {
  const tasksContainer = document.getElementById('tasksContainer');
  tasksContainer.innerHTML = '';
  projectId = Number(projectId);
  const projectTasks = projects.find(p => p.id === projectId).tasks;
  projectTasks.forEach(task => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const inputDate = new Date(task.dueDate);
    const timeDiff = inputDate - currentDate;
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

    const taskDiv = document.createElement('div'); // Encapsulating div.
    taskDiv.classList.add('task');
    taskDiv.style.backgroundColor = `rgb(${getColorForDays(daysDiff).join(
      ','
    )})`;

    // Editable elements
    const nameField = document.createElement('input');
    nameField.type = 'text';
    nameField.value = task.name;
    nameField.readOnly = true;
    nameField.className = 'taskName';

    const dateField = document.createElement('input');
    dateField.type = 'date';
    dateField.value = task.dueDate;
    dateField.readOnly = true;
    dateField.className = 'taskDate';

    // Create a delete button for each task
    const deleteButton = document.createElement('button');
    deleteButton.className = 'deleteButton';
    deleteButton.innerHTML =
      '<img src="assets/icons/deleteIcon.png" alt="Edit" style="width: 20px; height: 20px;">';
    deleteButton.onclick = function () {
      deleteTask(task.id);
      taskDiv.remove();
    };

    // Create an edit button for each task
    const editButton = document.createElement('button');
    editButton.className = 'editButton';
    editButton.innerHTML =
      '<img src="assets/icons/gearIcon.png" alt="Edit" style="width: 20px; height: 20px;">';
    let isEditing = false;
    editButton.onclick = function () {
      if (isEditing) {
        nameField.readOnly = true;
        dateField.readOnly = true;
        editButton.innerHTML =
          '<img src="assets/icons/gearIcon.png" alt="Edit" style="width: 20px;">';
        // Update display colors or other changes based on new date
        const newDateDiff =
          (new Date(dateField.value) - new Date()) / (1000 * 60 * 60 * 24);
        taskDiv.style.backgroundColor = `rgb(${getColorForDays(
          newDateDiff
        ).join(',')})`;
        saveTaskEdits(task.id, nameField.value, dateField.value);
      } else {
        nameField.readOnly = false;
        dateField.readOnly = false;
        editButton.textContent = 'Save';
      }
      isEditing = !isEditing;
    };

    // Checkbox to mark the task as completed
    const checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.className = 'taskCheckbox';
    if (task.completed) {
      taskDiv.style.backgroundColor = `rgba(0, 0, 0, 0.5)`;
      editButton.style.display = 'none';
      checkBox.completed = true;
    }
    checkBox.onchange = function () {
      toggleTaskCompletion(task.id);
      taskDiv.style.textDecoration = this.completed ? 'line-through' : 'none';
      if (this.completed) {
        taskDiv.style.backgroundColor = `rgba(0, 0, 0, 0.5)`;
        editButton.style.display = 'none';
      } else {
        const newDateDiff =
          (new Date(dateField.value) - new Date()) / (1000 * 60 * 60 * 24);
        taskDiv.style.backgroundColor = `rgb(${getColorForDays(
          newDateDiff
        ).join(',')})`;
        editButton.style.display = 'inline-block';
      }
    };

    // Append all elements to the task div
    taskDiv.appendChild(checkBox);
    taskDiv.appendChild(nameField);
    taskDiv.appendChild(dateField);
    taskDiv.appendChild(editButton);
    taskDiv.appendChild(deleteButton);

    taskDiv.dataset.dueDate = inputDate.toISOString();

    insertTaskSorted(taskDiv);
  });
}

/**
 * Inserts a task into the tasks container in chronological order based on its due date.
 *
 * @param {HTMLElement} taskDiv The HTML element representing the task to be inserted.
 *                               This element must have a 'data-dueDate' attribute set to a valid ISO date string.
 */
function insertTaskSorted(taskDiv) {
  const tasksContainer = document.getElementById('tasksContainer');
  const existingTasks = tasksContainer.children;
  let inserted = false;

  for (let i = 0; i < existingTasks.length; i++) {
    const existingTaskDueDate = new Date(existingTasks[i].dataset.dueDate);
    const newTaskDueDate = new Date(taskDiv.dataset.dueDate);
    if (newTaskDueDate < existingTaskDueDate) {
      tasksContainer.insertBefore(taskDiv, existingTasks[i]);
      inserted = true;
      break;
    }
  }

  // If the new task is later than all existing tasks or if there are no tasks yet
  if (!inserted) {
    tasksContainer.appendChild(taskDiv);
  }
}

// Adds task to the selected project.
function addTaskToProject() {
  // Retrieve input and ensure validity.
  const taskNameInput = document.getElementById('taskName');
  const dueDateInput = document.getElementById('taskDueDate');
  const taskName = taskNameInput.value;
  const dueDate = dueDateInput.value;
  const modal = document.getElementById('viewCardModal');
  if (!taskName || !dueDate) {
    alert('Please fill in both the task name and the due date.');
    return;
  }

  // Reset input fields
  taskNameInput.value = '';
  dueDateInput.value = '';
  document.getElementById('taskDueDate').style.backgroundColor = '#11ffee00';

  // Determine which project is currently in the view modal.
  const project = projects.find(p => p.id === Number(modal.dataset.id));
  if (project) {
    // If project found, add the new task to its tasks array
    project.taskIdCounter++;
    const newTask = {
      id: project.taskIdCounter, // Use the counter attribute for the new task ID
      name: taskName,
      dueDate: dueDate,
      completed: false,
    };
    project.tasks.push(newTask);
    project.progress = getProgressByProjectID(project.id);
    saveProjects(); // Save the updated projects array to localStorage
    renderTasks(Number(modal.dataset.id));
  }
}

// Updates the background color of the input date of the new task
function updateDateColor() {
  this.style.backgroundColor = `rgb(${getColorForDays(
    (new Date(this.value) - new Date()) / (1000 * 60 * 60 * 24)
  ).join(',')})`;
}

/**
 * Deletes a task from a project's task list and updates the project storage and UI.
 *
 * @param {number} taskId - The ID of the task to be deleted. Assumed to be a unique identifier.
 */
function deleteTask(taskId) {
  // Filter out the task to be deleted
  const project = projects.find(
    p => p.id === Number(document.getElementById('viewCardModal').dataset.id)
  );
  project.tasks = project.tasks.filter(task => task.id !== taskId);
  project.progress = getProgressByProjectID(project.id);
  saveProjects(); // Save the updated array to localStorage
  renderTasks(Number(document.getElementById('viewCardModal').dataset.id)); // Update the UI
}

/**
 * Saves edits made to a specific task within a project. Updates the task's name and due date,
 * then saves the updated projects array to localStorage and re-renders the tasks for the project.
 *
 * @param {number} taskId - The ID of the task being edited.
 * @param {string} newName - The new name for the task.
 * @param {string} newDueDate - The new due date for the task, in YYYY-MM-DD format.
 */
function saveTaskEdits(taskId, newName, newDueDate) {
  const project = projects.find(
    p => p.id === Number(document.getElementById('viewCardModal').dataset.id)
  );
  const modal = document.getElementById('viewCardModal');
  const task = project.tasks.find(t => t.id === taskId);
  if (task) {
    task.name = newName;
    task.dueDate = newDueDate;
    project.progress = getProgressByProjectID(project.id);
    saveProjects(); // Save the updated projects array to localStorage
    renderTasks(Number(modal.dataset.id));
  }
}

/**
 * Toggles the completion status of a specific task in a project and updates the local storage and UI.
 *
 * @param {number} taskId - The ID of the task whose completion status is to be toggled.
 */
function toggleTaskCompletion(taskId) {
  const project = projects.find(
    p => p.id === Number(document.getElementById('viewCardModal').dataset.id)
  );
  const modal = document.getElementById('viewCardModal');
  const task = project.tasks.find(t => t.id === taskId);
  if (task) {
    task.completed = !task.completed; // Toggle the completion status
    project.progress = getProgressByProjectID(project.id);
    saveProjects(); // Save the updated projects array to localStorage
    renderTasks(Number(modal.dataset.id));
  }
}
