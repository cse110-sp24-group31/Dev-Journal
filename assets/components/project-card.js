class TaskScript extends HTMLElement {
  constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `
      <link rel="stylesheet" type="text/css" href="style.css" media="screen">
      <link href="https://fonts.googleapis.com/css2?family=Platypi:ital,wght@0,300..800;1,300..800" rel="stylesheet"> 
      <form id="taskForm" action="https://httpbin.org/post" method="POST">
          <input type="text" id="newTaskInput" placeholder="Add a new task...">
          <button type="submit">Add Task</button>
      </form>
      <div id="modal" class="modal">
          <div class="modal-content">
              <span class="close-modal">&times;</span>
              <div class="modal-header">    
                  <h2 class="modal-title"></h2>
              </div>
              <form id="modalForm">
                  <div class="modalLabelsInput">
                      <label for="taskDescription">Description:</label>
                      <textarea id="taskDescription" onfocus="this.value=''" name="taskDescription"></textarea>
                  </div>
                  <div class="modalLabelsInput">
                      <label for="taskDueDate">Due Date:</label>
                      <input type="date" id="taskDueDate">
                  </div>
                  <div class="modalLabelsInput"> 
                      <label for="taskLabel">Label:</label>
                      <select id="taskLabel" name="taskLabel">
                          <option value="Default">Select Label</option>
                          <option value="Work">Work</option>
                          <option value="Personal">Personal</option>
                          <option value="Health and Fitness">Health and Fitness</option>
                          <option value="Finance">Finance</option>
                          <option value="Social">Social</option>
                          <option value="Travel">Travel</option>
                          <option value="School">School</option>
                          <option value="createNew">Create New Label</option>
                      </select>
                      <input type="text" id="newLabelInput" placeholder="New Label" style="display: none;">
                  </div>
                  <div class="modalLabelsInput">
                      <label for="taskColor">Color Label:</label>
                      <input type="color" id="taskColor" name="taskColor">
                  </div>
                  <button class="subButton" type="submit">Submit</button>
              </form>
          </div>
      </div>
      <section class="taskContainer"></section>
  `;
      this.taskContainer = this.shadowRoot.querySelector('.taskContainer');
      this.newTaskInput = this.shadowRoot.getElementById('newTaskInput');
      this.taskDueDate = this.shadowRoot.getElementById('taskDueDate');

      // Event listener for opening modal when submitting task form
      this.shadowRoot.getElementById('taskForm').addEventListener('submit', (event) => {
          event.preventDefault();
          this.openModal();
      });

      // Event listener for closing modal
      this.shadowRoot.querySelector('.close-modal').addEventListener('click', () => {
          this.closeModal();
      });

      // Event listener for submitting modal form
      this.shadowRoot.getElementById('modalForm').addEventListener('submit', (event) => {
          event.preventDefault();
          this.submitModal();
      });            

      // Event listener for showing or hiding the new label input
      this.shadowRoot.getElementById('taskLabel').addEventListener('change', () => {
          const newLabelInput = this.shadowRoot.getElementById('newLabelInput');
          if (this.shadowRoot.getElementById('taskLabel').value === 'createNew') {
              newLabelInput.style.display = 'inline-block';
          } else {
              newLabelInput.style.display = 'none';
          }
      });
  }

  openModal(editName = null) {
      const modal = this.shadowRoot.getElementById('modal');
      modal.style.display = 'block'
      document.body.classList.add('modal-open'); 

      const modalTitle = this.shadowRoot.querySelector('.modal-title');
      if(editName !== null){
          modalTitle.textContent = editName;
          this.newTaskInput.value = editName;
      }
      else{
          modalTitle.textContent = this.newTaskInput.value || 'New Task';
      }
      
  }

  closeModal() {
      const modal = this.shadowRoot.getElementById('modal');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open'); 
  }

  submitModal() {
      const modalForm = this.shadowRoot.getElementById('modalForm');
      const taskDescriptionInput = modalForm.querySelector('#taskDescription');
      const newTaskText = taskDescriptionInput.value.trim();
      const dueDate = this.taskDueDate.value; 
      const newTaskName = this.newTaskInput.value;
      let taskLabel = modalForm.querySelector('#taskLabel').value;
      const taskColor = modalForm.querySelector('#taskColor').value;

      if (newTaskText === '')return;

      
      if (taskLabel === 'createNew'){
          const newLabelInput = modalForm.querySelector('#newLabelInput');
          const newLabel = newLabelInput.value.trim();

          if(newLabel === '') return;
          taskLabel = newLabel;
      }

      const taskId = `task${this.taskContainer.children.length + 1}`;
      const newTask = document.createElement('section');
      newTask.classList.add('taskItem');
      newTask.dataset.label = taskLabel;
      newTask.innerHTML = `
          <div class="taskMain">
              <input type="checkbox" id="${taskId}">
              <label for="${taskId}">${newTaskName}</label>
          </div>
          <div class="taskDesc">
              <label>${newTaskText}</label>
          </div>
          <div class="taskFooter">
              <div class="datelabel">
                  <div class="taskLabel" style="background-color: ${taskColor}; border-radius: 5px; padding: 3px 6px; ${
                      this.calculateTextColor(taskColor)
                  }">${taskLabel}</div>
                  ${dueDate ? `
                      <div class="taskDate">
                          <label>🗓️ ${dueDate}</label>
                      </div>
                  ` : '<div class="taskDate noDate"><label></label></div>'}
              </div>
              <div class="taskButtons">
                  <button class="editBtn">✏️</button>
                  <button class="deleteBtn">🗑️</button>
              </div>
          </div>
      `;

      this.closeModal();
      const editBtn = newTask.querySelector('.editBtn');
      const deleteBtn = newTask.querySelector('.deleteBtn');
      editBtn.addEventListener('click', () => this.editTask(newTask));
      deleteBtn.addEventListener('click', () => this.deleteTask(newTask));

      this.taskContainer.appendChild(newTask);
      this.newTaskInput.value = '';
      this.taskDueDate.value = '';

      const checkbox = newTask.querySelector('input[type="checkbox"]');
      checkbox.addEventListener('change', () => {
          if (checkbox.checked) {
              this.animateConfetti(newTask);
              newTask.style.opacity = '0.5';
              newTask.style.backgroundColor = 'lightgrey';
          } else {
              newTask.style.opacity = '';
              newTask.style.backgroundColor = '';
          }
      });
  }
}