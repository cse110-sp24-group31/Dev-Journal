// Function to show the modal
function showModal(card) {
    const modal = document.getElementById('projectView');
    const modalContent = modal.querySelector('.modal-content p');
    modalContent.textContent = 'Content for ' + card.innerText; // Set the content dynamically
    modal.style.display = 'block'; // Show the modal
}

// Initialization function to set up event handlers
function init() {


    // Get the element that closes the modal
    const close = document.querySelector('.close');
    close.onclick = function() {
        const modal = document.getElementById('projectView');
        modal.style.display = 'none';
    }

    // Setup event listeners for any existing cards (if any)
    document.querySelectorAll('.card').forEach(card => {
        card.onclick = function() { showModal(card); };
    })

    // Click anywhere outside of the modal to close it
    window.onclick = function(event) {
        const modal = document.getElementById('projectView');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }
}

// Ensures all DOM content is loaded before executing scripts
document.addEventListener('DOMContentLoaded', init);