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
                                <strong><u><h3>${contact.name}</h3></u></strong>
                                <a href="mailto:${contact.email}">Email</a>
                                <a href="${contact.github}">Github</a>
                                <a href="${contact.linkedin}">LinkedIn</a>
                                <strong>Phone #: </strong>${contact.phone}
                                <strong>Role: </strong>${contact.role}<br>`;
        contactCard.appendChild(infoContainer);


        const buttonDiv = document.createElement('div');
        buttonDiv.className = 'button-container';
        

        // Create a delete button for each task
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML ='<img class="buttons" src="assets/icons/deleteIcon.png" alt="delete button">';
        deleteButton.onclick = function () {
            deleteContact(contact.id);
            contactCard.remove();
        };
        buttonDiv.appendChild(deleteButton);
        
        // View more button 
        const viewOther = document.createElement('button');
        viewOther.className = "view-more-btn";
        viewOther.innerHTML ='<img class="buttons" src="assets/icons/more.png" alt="more button">';
        viewOther.setAttribute('other-info', contact.other);
        viewOther.addEventListener('click', function() {
            const moreInfo = this.getAttribute('other-info');
            openModalWithText(moreInfo);
        });
        buttonDiv.appendChild(viewOther);

        // Edit button 
        const edit = document.createElement('button');
        edit.className = "edit-btn";
        edit.textContent = "Edit";
        edit.innerHTML ='<img class="buttons" src="assets/icons/edit.png" alt="edit button">';
        edit.addEventListener('click', function() {
            document.getElementById('name').value = contact.name;
            document.getElementById('gender').value = contact.gender;
            document.getElementById('github').value = contact.github;
            document.getElementById('linkedin').value = contact.linkedin;
            document.getElementById('email').value = contact.value;
            document.getElementById('phone').value = contact.phone;
            document.getElementById('role').value = contact.role;
            document.getElementById('other').value = contact.other;
            deleteContact(contact.id);
            contactCard.remove();
        });
        buttonDiv.appendChild(edit);

        contactCard.appendChild(buttonDiv);

        contactContainer.appendChild(contactCard);
        document.getElementById('contact-form').reset()
    }); 
}

function openModalWithText(text) {
    document.getElementById('moreText').textContent = "";
    document.getElementById('moreText').textContent = text;
    document.getElementById('viewMoreModal').style.display = "block";
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

    const modal = document.getElementById('viewMoreModal');
    const closeBtn = document.querySelector('.modal .close');

    closeBtn.onclick = function() {
        modal.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.visibility = "none";
        }
    };
});