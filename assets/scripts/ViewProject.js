<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Developer Journal</title>
  <link rel="stylesheet" href="assets/styles/homepage.css">
  <link rel="stylesheet" href="assets/styles/projectView.css">
  <link rel="stylesheet" href="assets/styles/taskManager.css">
  <link rel="stylesheet" href="assets/styles/contactPage.css">
  <link rel="icon" href="assets/icons/favicon.png" type="image/png">
  <script src="assets/scripts/AddProject.js" defer></script>
  <script src="assets/scripts/ViewProject.js" defer></script>
  <script src="assets/scripts/TaskManager.js" defer></script>
  <script src="assets/scripts/ProjectCard.js" defer></script>
  <script src="assets/scripts/ContactPage.js" defer></script>
  <style>
    .tab-content {
      display: none;
    }

    .tab-content.active {
      display: block;
    }

    .main-nav .nav-links a {
      cursor: pointer;
    }
  </style>
</head>

<body>
  <!-- NAVIGATION -->
  <div class="main-nav">
    <div class="brand">Developer Journal</div>
    <div class="nav-links">
      <a onclick="showTab('home')">Home</a>
      <a onclick="showTab('about')">About</a>
      <a onclick="showTab('contacts')">Contacts</a>
    </div>
    <div class="search-bar">
      <input type="text" placeholder="Search...">
      <button>Search</button>
    </div>
  </div>

  <!-- MAIN -->
  <div id="home" class="tab-content active">
    <div class="main">
      <div class="project-cards" id="project-cards-parent">
        <div id="project-cards-wrap">
          <!-- PROJECT CARDS ARE ADDED HERE DYNAMICALLY -->
        </div>
      </div>

      <div class="sidebar">
        <div class="sidebar-sec calendar">
          <!--  CHARLOTTE AND ZHAMILYA WORK HERE  -->
        </div>
        <div class="sidebar-sec accomplishments">
          <!-- Accomplishments Section  TODO -->
        </div>
      </div>
    </div>
  </div>

  <div id="about" class="tab-content">
    <!-- About content here -->
  </div>

  <div id="contacts" class="tab-content">
    <div class="header-bubble">
      <h1>Contacts Page</h1>
    </div>
    <div class="flex-container">
      <aside>
        <div class="key">
          <h1>Avatar Key</h1>
          <label><input type="checkbox" class="filter-checkbox" data-category="team-lead"> Team Leads: <img src="assets/icons/alien1.png"
              alt="Avatar 1"></label><br>
          <label><input type="checkbox" class="filter-checkbox" data-category="planner"> Planners: <img src="assets/icons/alien2.png"
              alt="Avatar 2"></label><br>
          <label><input type="checkbox" class="filter-checkbox" data-category="programmer"> Programmers: <img
              src="assets/icons/alien3.png" alt="Avatar 3"></label><br>
        </div>
      </aside>
      <div class="sun-container">
        <div class="sun"></div>
        <form>
          <fieldset>
            <legend style="font-size:20px;">Add Contact Information</legend>
            <label for="name">Name:</label><br>
            <input type="text" id="name" name="name" required><br>
            <label for="gender">Gender:</label><br>
            <select id="gender" name="gender"><br>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select> <br>
            <label for="avatar">Avatar:</label><br>
            <div id="avatar-options">
              <img src="assets/icons/alien1.png" alt="Avatar 1" class="avatar-option" data-category="team-lead">
              <img src="assets/icons/alien2.png" alt="Avatar 2" class="avatar-option" data-category="planner">
              <img src="assets/icons/alien3.png" alt="Avatar 3" class="avatar-option" data-category="programmer">
            </div>
            <input type="hidden" id="selected-avatar" name="avatar">
            <input type="hidden" id="selected-category" name="category">
            <label for="github">Github:</label><br>
            <input type="text" id="github" name="github"><br>
            <label for="linkedin">LinkedIn:</label><br>
            <input type="text" id="linkedin" name="linkedin"><br>
            <label for="email">Email:</label><br>
            <input type="text" id="email" name="email"><br>
            <label for="phone">Phone Number:</label><br>
            <input type="text" id="phone" name="phone" pattern="\d{3}-\d{3}-\d{4}" placeholder="xxx-xxx-xxxx"><br>
            <label for="color">Background Color:</label><br>
            <select id="color" name="color"><br>
              <option value="pink">Pink</option>
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="purple">Purple</option>
            </select> <br>
            <label for="other">Other Information:</label><br>
            <textarea id="other" name="other" rows="4" cols="40" placeholder="Enter any additional information here"></textarea><br>
            <input type="submit" value="Submit">
          </fieldset>
        </form>
      </div>
    </div>
    <div class="container">
      <div class="info-box" id="info-box"></div>
    </div>
  </div>

  <!-- Add Card Modal -->
  <div id="addCardModal" class="modal">
    <div class="modal-content">
      <span class="close-modal" onclick="closeAddCardModal()">x</span>
      <h2>Add New Project</h2>
      <form id="addCardForm">
        <label for="projectName">Project Name:</label>
        <input type="text" id="projectName" name="projectName">
        <label for="projectDescription">Description:</label>
        <textarea id="projectDescription" name="projectDescription"></textarea>
        <label for="projectImage">Image URL:</label>
        <input type="text" id="projectImage" name="projectImage">
        <button type="submit" id="submitButton">Add Project</button>
      </form>
    </div>
  </div>

  <!-- View Card Modal -->
  <div id="viewCardModal" class="modal" style="display: none;">
    <div class="modal-content">
      <span class="close-modal" onclick="closeViewCardModal()">x</span>
      <h2>View Project</h2>
      <form id="viewCardForm">
        <label for="projectName">Project Name:</label>
        <input type="text" id="projectName" name="projectName" readonly>
        <label for="projectDescription">Description:</label>
        <textarea id="projectDescription" name="projectDescription" readonly></textarea>
        <label for="projectImage">Image URL:</label>
        <input type="text" id="projectImage" name="projectImage" readonly>
        <button type="button" id="editButton">Edit Details</button>
        <button type="button" id="saveButton" style="display: none;">Save Details</button>
      </form>
    </div>
  </div>

  <script>
    function showTab(tabId) {
      document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
      });
      document.getElementById(tabId).classList.add('active');
    }

    function closeAddCardModal() {
      document.getElementById('addCardModal').style.display = 'none';
    }

    function closeViewCardModal() {
      document.getElementById('viewCardModal').style.display = 'none';
    }
  </script>
</body>

</html>
