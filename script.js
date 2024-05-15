document.addEventListener('DOMContentLoaded', function() {
    const infoBox = document.getElementById('info-box');
    infoBox.style.display = 'none'; 

    //Avatar Options
    document.getElementById('avatar-options').addEventListener('click', function(event) {
        if (event.target.classList.contains('avatar-option')) {
            document.querySelector('.avatar-option.selected')?.classList.remove('selected');
            event.target.classList.add('selected');
            document.getElementById('selected-avatar').value = event.target.src;
        }
    });

    document.querySelector('form').addEventListener('submit', function(e) {
        e.preventDefault();
        submitEntry();
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
});
//Function to submit entries when you are done inputting the information
function submitEntry() {
    const data = {
        name: document.getElementById('name').value.trim(),
        gender: document.getElementById('gender').value,
        avatar: document.getElementById('selected-avatar').value,
        github: document.getElementById('github').value.trim(),
        linkedin: document.getElementById('linkedin').value.trim(),
        other: document.getElementById('other').value.trim()
    };

    //Added this just beacuse we want some basic information at least
    if (!data.name || !data.avatar) {
        alert('Please enter a name and pick an avatar.');
        return;
    }
    createPersonEntry(data);
    clearForm();
}

//New Person Entry
function createPersonEntry(data) {
    const infoBox = document.getElementById('info-box');
    if (infoBox.style.display === 'none') {
        infoBox.style.display = 'flex'; 
    }
    const entry = document.createElement('div');
    entry.classList.add('person-entry');
    entry.dataset.id = Date.now();
    entry.innerHTML = entryTemplate(data);
    infoBox.appendChild(entry);
}
//Generate HTML for a person entry
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
            ${data.github ? `<p><strong>Github:</strong> <a href="${formatUrl(data.github)}" target="_blank">${data.github}</a></p>` : ''}
            ${data.linkedin ? `<p><strong>LinkedIn:</strong> <a href="${formatUrl(data.linkedin)}" target="_blank">${data.linkedin}</a></p>` : ''}
            <p><strong>Other Information:</strong> ${data.other}</p>
            <button>Edit</button>
            <button>Delete</button>
        </div>
    `;
}

//Edit exisitng entry
function editEntry(entry) {
    const currentData = {
        name: entry.querySelector('h2').textContent,
        gender: entry.querySelector('p').textContent.split(':')[1].trim(),
        github: entry.querySelector('a[href*="github"]') ? entry.querySelector('a[href*="github"]').href : '',
        linkedin: entry.querySelector('a[href*="linkedin"]') ? entry.querySelector('a[href*="linkedin"]').href : '',
        other: entry.querySelector('p:last-of-type').textContent.split(':')[1].trim(),
        avatar: entry.querySelector('img').src
    };

    entry.innerHTML = `
        <img src="${currentData.avatar}" alt="Avatar" class="avatar-image" style="display:none;">
        <label>Name:</label><input type="text" value="${currentData.name}" id="edit-name"><br>
        <label>Gender:</label><select id="edit-gender">
            <option value="male" ${currentData.gender === 'Male' ? 'selected' : ''}>Male</option>
            <option value="female" ${currentData.gender === 'Female' ? 'selected' : ''}>Female</option>
        </select><br>
        <label>Github:</label><input type="text" value="${currentData.github}" id="edit-github"><br>
        <label>LinkedIn:</label><input type="text" value="${currentData.linkedin}" id="edit-linkedin"><br>
        <label>Other Information:</label><textarea id="edit-other" rows="4" cols="40">${currentData.other}</textarea><br>
        <button>Save</button>
    `;
}

// Save edited entry to replace initial display and revert back to it with update information
function saveEdit(entry) {
    const updatedData = {
        name: document.getElementById('edit-name').value,
        gender: document.getElementById('edit-gender').value,
        github: document.getElementById('edit-github').value,
        linkedin: document.getElementById('edit-linkedin').value,
        other: document.getElementById('edit-other').value,
        avatar: entry.querySelector('img').src
    };

    // Format and verify URLs
    if (updatedData.github && !updatedData.github.startsWith('http://') && !updatedData.github.startsWith('https://')) {
        updatedData.github = 'https://' + updatedData.github;
    }
    if (updatedData.linkedin && !updatedData.linkedin.startsWith('http://') && !updatedData.linkedin.startsWith('https://')) {
        updatedData.linkedin = 'https://' + updatedData.linkedin;
    }

    entry.innerHTML = entryTemplate(updatedData);
}

//Delete an entry
function deleteEntry(entry) {
    if (confirm('Are you sure you want to delete this contact?')) {
        entry.remove();
        const infoBox = document.getElementById('info-box');
        if (infoBox.children.length === 0) {
            infoBox.style.display = 'none'; // Hide the info box if no entries are left
        }
    }
}

//resets form after every input so you can start fresh
function clearForm() {
    document.getElementById('name').value = '';
    document.getElementById('gender').value = 'male';
    document.getElementById('selected-avatar').value = '';
    document.getElementById('github').value = '';
    document.getElementById('linkedin').value = '';
    document.getElementById('other').value = '';
    document.querySelector('.avatar-option.selected')?.classList.remove('selected');
}
