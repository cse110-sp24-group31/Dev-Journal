document.addEventListener('DOMContentLoaded', function() {
    const infoBox = document.getElementById('info-box');
    infoBox.style.display = 'none';

    loadEntriesFromLocalStorage();

    // Avatar Options
    document.getElementById('avatar-options').addEventListener('click', function(event) {
        if (event.target.classList.contains('avatar-option')) {
            document.querySelector('.avatar-option.selected')?.classList.remove('selected');
            event.target.classList.add('selected');
            document.getElementById('selected-avatar').value = event.target.src;
            document.getElementById('selected-category').value = event.target.dataset.category;
        }
    });

    document.querySelector('form').addEventListener('submit', function(e) {
        e.preventDefault();
        if (validatePhoneNumber()) {
            submitEntry();
        } else {
            alert('Please enter a valid phone number in the format xxx-xxx-xxxx or leave it blank.');
        }
    });

    infoBox.addEventListener('click', function(event) {
        const entry = event.target.closest('.person-entry');
        if (!entry) return;

        if (event.target.textContent === 'Edit') {
            editEntry(entry);
        } else if (event.target.textContent === 'Save') {
            saveEdit(entry);
        } else if (event.target.textContent === 'Delete') {
            deleteEntry(entry);
        }
    });

    // Filter checkboxes
    document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            filterEntries();
        });
    });
});

// Function to submit entries when you are done inputting the information
function submitEntry() {
    const data = {
        id: Date.now(),
        name: document.getElementById('name').value.trim() || 'N/A',
        gender: document.getElementById('gender').value,
        avatar: document.getElementById('selected-avatar').value,
        category: document.getElementById('selected-category').value,
        github: document.getElementById('github').value.trim() || 'N/A',
        linkedin: document.getElementById('linkedin').value.trim() || 'N/A',
        email: document.getElementById('email').value.trim() || 'N/A',
        phone: document.getElementById('phone').value.trim() || 'N/A',
        color: document.getElementById('color').value,
        other: document.getElementById('other').value.trim() || 'N/A'
    };

    if (!data.name || !data.avatar) {
        alert('Please enter a name and pick an avatar.');
        return;
    }

    createPersonEntry(data);
    saveEntryToLocalStorage(data);
    clearForm();
}

// Function to validate phone number
function validatePhoneNumber() {
    const phoneInput = document.getElementById('phone');
    const phonePattern = /^\d{3}-\d{3}-\d{4}$/;
    return phoneInput.value === '' || phonePattern.test(phoneInput.value);
}

// New Person Entry
function createPersonEntry(data) {
    const infoBox = document.getElementById('info-box');
    if (infoBox.style.display === 'none') {
        infoBox.style.display = 'flex';
    }
    const entry = document.createElement('div');
    entry.classList.add('person-entry');
    entry.dataset.id = data.id;
    entry.dataset.category = data.category;
    entry.style.background = getColorGradient(data.color);
    entry.innerHTML = entryTemplate(data);
    infoBox.appendChild(entry);
}

// Function to get the color gradient based on the selected color
function getColorGradient(color) {
    switch (color) {
        case 'pink':
            return 'radial-gradient(circle at center, #ffccf9 40%, #ff99f3 60%, #ff66e6 90%)';
        case 'blue':
            return 'radial-gradient(circle at center, #9ccddc 40%, #5591a9 60%, #054569 90%)';
        case 'green':
            return 'radial-gradient(circle at center, #ccffd4 40%, #99ffab 60%, #66ff7a 90%)';
        case 'purple':
            return 'radial-gradient(circle at center, #e0ccff 40%, #c499ff 60%, #a366ff 90%)';
        default:
            return 'radial-gradient(circle at center, #9ccddc 40%, #5591a9 60%, #054569 90%)'; // Default blue gradient
    }
}

// Generate HTML for a person entry
function entryTemplate(data) {
    function formatUrl(url) {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        return url;
    }

    return `
        <div class="entry-avatar">
            <img src="${data.avatar}" alt="Avatar" class="avatar-image">
        </div>
        <div class="entry-content">
            <h2>${data.name}</h2>
            <p><strong>Gender:</strong> ${data.gender}</p>
            ${data.github !== 'N/A' ? `<p><strong>Github:</strong> <a href="${formatUrl(data.github)}" target="_blank">${data.github}</a></p>` : '<p><strong>Github:</strong> N/A</p>'}
            ${data.linkedin !== 'N/A' ? `<p><strong>LinkedIn:</strong> <a href="${formatUrl(data.linkedin)}" target="_blank">${data.linkedin}</a></p>` : '<p><strong>LinkedIn:</strong> N/A</p>'}
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone Number:</strong> ${data.phone}</p>
            <p><strong>Other Information:</strong> ${data.other}</p>
            <button>Edit</button>
            <button>Delete</button>
        </div>
    `;
}

// Edit existing entry
function editEntry(entry) {
    const paragraphs = entry.querySelectorAll('p');
    let email = 'N/A';
    let phone = 'N/A';
    let other = 'N/A';

    paragraphs.forEach(p => {
        if (p.textContent.includes('Email:')) {
            email = p.textContent.split(':')[1].trim();
        }
        if (p.textContent.includes('Phone Number:')) {
            phone = p.textContent.split(':')[1].trim();
        }
        if (p.textContent.includes('Other Information:')) {
            other = p.textContent.split(':')[1].trim();
        }
    });

    const currentData = {
        id: entry.dataset.id,
        name: entry.querySelector('h2').textContent,
        gender: entry.querySelector('p').textContent.split(':')[1].trim(),
        github: entry.querySelector('a[href*="github"]') ? entry.querySelector('a[href*="github"]').href : 'N/A',
        linkedin: entry.querySelector('a[href*="linkedin"]') ? entry.querySelector('a[href*="linkedin"]').href : 'N/A',
        email: email,
        phone: phone,
        other: other,
        avatar: entry.querySelector('img').src,
        color: entry.dataset.color || 'blue' // Default to blue if no color is set
    };

    entry.innerHTML = `
        <img src="${currentData.avatar}" alt="Avatar" class="avatar-image" style="display:none;">
        <label>Name:</label><input type="text" value="${currentData.name}" id="edit-name"><br>
        <label>Gender:</label><select id="edit-gender">
            <option value="male" ${currentData.gender === 'Male' ? 'selected' : ''}>Male</option>
            <option value="female" ${currentData.gender === 'Female' ? 'selected' : ''}>Female</option>
            <option value="other" ${currentData.gender === 'Other' ? 'selected' : ''}>Other</option>
        </select><br>
        <label>Github:</label><input type="text" value="${currentData.github}" id="edit-github"><br>
        <label>LinkedIn:</label><input type="text" value="${currentData.linkedin}" id="edit-linkedin"><br>
        <label>Email:</label><input type="text" value="${currentData.email}" id="edit-email"><br>
        <label>Phone Number:</label><input type="text" value="${currentData.phone}" id="edit-phone" pattern="\d{3}-\d{3}-\d{4}" placeholder="xxx-xxx-xxxx"><br>
        <label>Background Color:</label><select id="edit-color">
            <option value="pink" ${currentData.color === 'pink' ? 'selected' : ''}>Pink</option>
            <option value="blue" ${currentData.color === 'blue' ? 'selected' : ''}>Blue</option>
            <option value="green" ${currentData.color === 'green' ? 'selected' : ''}>Green</option>
            <option value="purple" ${currentData.color === 'purple' ? 'selected' : ''}>Purple</option>
        </select><br>
        <label>Other Information:</label><textarea id="edit-other" rows="4" cols="40">${currentData.other}</textarea><br>
        <button>Save</button>
    `;
}

// Save edited entry to replace initial display and revert back to it with updated information
function saveEdit(entry) {
    const updatedData = {
        id: entry.dataset.id,
        name: document.getElementById('edit-name').value || 'N/A',
        gender: document.getElementById('edit-gender').value,
        github: document.getElementById('edit-github').value || 'N/A',
        linkedin: document.getElementById('edit-linkedin').value || 'N/A',
        email: document.getElementById('edit-email').value || 'N/A',
        phone: document.getElementById('edit-phone').value || 'N/A',
        color: document.getElementById('edit-color').value,
        other: document.getElementById('edit-other').value || 'N/A',
        avatar: entry.querySelector('img').src
    };

    // Format and verify URLs
    if (updatedData.github !== 'N/A' && !updatedData.github.startsWith('http://') && !updatedData.github.startsWith('https://')) {
        updatedData.github = 'https://' + updatedData.github;
    }
    if (updatedData.linkedin !== 'N/A' && !updatedData.linkedin.startsWith('http://') && !updatedData.linkedin.startsWith('https://')) {
        updatedData.linkedin = 'https://' + updatedData.linkedin;
    }

    entry.innerHTML = entryTemplate(updatedData);
    entry.style.background = getColorGradient(updatedData.color);
    updateEntryInLocalStorage(updatedData);
}

// Delete an entry
function deleteEntry(entry) {
    if (confirm('Are you sure you want to delete this contact?')) {
        entry.remove();
        const infoBox = document.getElementById('info-box');
        if (infoBox.children.length === 0) {
            infoBox.style.display = 'none';
        }
        deleteEntryFromLocalStorage(entry.dataset.id);
    }
}

// Resets form after every input so you can start fresh
function clearForm() {
    document.getElementById('name').value = '';
    document.getElementById('gender').value = 'male';
    document.getElementById('selected-avatar').value = '';
    document.getElementById('github').value = '';
    document.getElementById('linkedin').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('color').value = 'blue'; // Reset color to default
    document.getElementById('other').value = '';
    document.querySelector('.avatar-option.selected')?.classList.remove('selected');
}

// Filter entries based on selected checkboxes
function filterEntries() {
    const selectedCategories = Array.from(document.querySelectorAll('.filter-checkbox:checked')).map(checkbox => checkbox.dataset.category);
    const entries = document.querySelectorAll('.person-entry');

    entries.forEach(entry => {
        if (selectedCategories.includes(entry.dataset.category)) {
            entry.style.display = 'flex';
        } else {
            entry.style.display = 'none';
        }
    });
}

// Load entries from local storage
function loadEntriesFromLocalStorage() {
    const entries = JSON.parse(localStorage.getItem('entries')) || [];
    entries.forEach(data => createPersonEntry(data));
}

// Save an entry to local storage
function saveEntryToLocalStorage(data) {
    const entries = JSON.parse(localStorage.getItem('entries')) || [];
    entries.push(data);
    localStorage.setItem('entries', JSON.stringify(entries));
}

// Update an entry in local storage
function updateEntryInLocalStorage(updatedData) {
    let entries = JSON.parse(localStorage.getItem('entries')) || [];
    entries = entries.map(entry => entry.id == updatedData.id ? updatedData : entry);
    localStorage.setItem('entries', JSON.stringify(entries));
}

// Delete an entry from local storage
function deleteEntryFromLocalStorage(id) {
    let entries = JSON.parse(localStorage.getItem('entries')) || [];
    entries = entries.filter(entry => entry.id != id);
    localStorage.setItem('entries', JSON.stringify(entries));
}
