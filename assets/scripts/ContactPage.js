let contacts = [];
let contactId; 

// Load entries from local storage
function loadContacts() {
    const storedConts = localStorage.getItem('contacts');
    if (storedConts) {
      contacts = JSON.parse(storedConts);
    }
}

// Save an entry to local storage
function saveContacts() {
    localStorage.setItem('contacts', JSON.stringify(contacts));
}

function initializeCounter() {
    const storedCounter = localStorage.getItem('contIdCounter');
    contactId = storedCounter ? parseInt(storedCounter, 10) : 0;  // reset to 0 if no projects stored
}
 
function incrementCounter() {
    contactId++;
    localStorage.setItem('contIdCounter', contactId.toString());
}

function renderContacts() {
    const contactContainer = document.getElementById('contact-cards');
    contactContainer.innerHTML = '';
    contacts.forEach(contact => {
        var contactCard = document.createElement('div');
        contactCard.className = 'contact-card';

        // Create and append the image element
        var imgElement = document.createElement('img');
        imgElement.className = 'contact-image';
        imgElement.src = `assets/icons/${contact.role}.png`;
        imgElement.alt = `${contact.role}`;
        contactCard.appendChild(imgElement);

        // Info container 
        var infoContainer = document.createElement('div');
        infoContainer.className = 'contact-info';
        infoContainer.innerHTML = `
                                <strong><u><h3>${contact.name}</h3></u></strong><br>
                                <a href="mailto:${contact.email}">Email</a><br>
                                <a href="${contact.github}">Github</a><br>
                                <a href="${contact.linkedin}">LinkedIn</a><br>
                                <strong>Phone #: </strong>${contact.phone}<br>
                                <strong>Role: </strong>${contact.role}<br>
                                <strong>Other: </strong>${contact.other}<br>`;
        contactCard.appendChild(infoContainer);

        // Create a delete button for each task
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML ='&times;';
        deleteButton.onclick = function () {
        deleteContact(contact.id);
        contactCard.remove();
        };
        contactCard.appendChild(deleteButton);

        contactContainer.appendChild(contactCard);
        document.getElementById('contact-form').reset()
    }); 
}

function deleteContact(id) {
    contacts = contacts.filter(cont => cont.id !== id);
    saveContacts();
}

document.addEventListener('DOMContentLoaded', () => {
    initializeCounter();
    loadContacts();
    renderContacts();
    document.getElementById('contact-form').addEventListener('submit', function(event) {
        event.preventDefault(); 
        incrementCounter();
    
        var name = document.getElementById('name').value;
        var gender = document.getElementById('gender').value;
        var github = document.getElementById('github').value;
        var linkedin = document.getElementById('linkedin').value;
        var email = document.getElementById('email').value;
        var phone = document.getElementById('phone').value;
        var role = document.getElementById('role').value;
        var other = document.getElementById('other').value;
    
        const newContact = {
            id: contactId, // Unique ID for the project
            name: name,
            gender: gender, 
            github: github,
            linkedin: linkedin, 
            email: email,
            phone: phone,
            role: role,
            other: other
        };
        contacts.push(newContact);

        saveContacts();
        renderContacts();
    });
});