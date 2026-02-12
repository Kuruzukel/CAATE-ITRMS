/* Accounts Page Script */
document.addEventListener('DOMContentLoaded', function () {
    // Menu toggle is handled by main.js - no need to duplicate here

    // Password Toggle for View Modal
    const toggleViewPassword = document.getElementById('toggleViewPassword');
    const viewPasswordInput = document.getElementById('viewTraineePassword');
    const viewPasswordIcon = document.getElementById('viewPasswordIcon');

    if (toggleViewPassword && viewPasswordInput && viewPasswordIcon) {
        toggleViewPassword.addEventListener('click', function () {
            // Toggle password visibility
            if (viewPasswordInput.type === 'password') {
                viewPasswordInput.type = 'text';
                viewPasswordIcon.classList.remove('bx-hide');
                viewPasswordIcon.classList.add('bx-show');
            } else {
                viewPasswordInput.type = 'password';
                viewPasswordIcon.classList.remove('bx-show');
                viewPasswordIcon.classList.add('bx-hide');
            }
        });
    }

    // Password Toggle for Add Modal
    const toggleAddPassword = document.getElementById('toggleAddPassword');
    const addPasswordInput = document.getElementById('addTraineePassword');
    const addPasswordIcon = document.getElementById('addPasswordIcon');

    if (toggleAddPassword && addPasswordInput && addPasswordIcon) {
        toggleAddPassword.addEventListener('click', function () {
            // Toggle password visibility
            if (addPasswordInput.type === 'password') {
                addPasswordInput.type = 'text';
                addPasswordIcon.classList.remove('bx-hide');
                addPasswordIcon.classList.add('bx-show');
            } else {
                addPasswordInput.type = 'password';
                addPasswordIcon.classList.remove('bx-show');
                addPasswordIcon.classList.add('bx-hide');
            }
        });
    }

    // Password Toggle for Edit Modal
    const toggleEditPassword = document.getElementById('toggleEditPassword');
    const editPasswordInput = document.getElementById('editTraineePassword');
    const editPasswordIcon = document.getElementById('editPasswordIcon');

    if (toggleEditPassword && editPasswordInput && editPasswordIcon) {
        toggleEditPassword.addEventListener('click', function () {
            // Toggle password visibility
            if (editPasswordInput.type === 'password') {
                editPasswordInput.type = 'text';
                editPasswordIcon.classList.remove('bx-hide');
                editPasswordIcon.classList.add('bx-show');
            } else {
                editPasswordInput.type = 'password';
                editPasswordIcon.classList.remove('bx-show');
                editPasswordIcon.classList.add('bx-hide');
            }
        });
    }

    // Populate Edit Trainee Modal with data
    const editTraineeModal = document.getElementById('editTraineeModal');
    if (editTraineeModal) {
        editTraineeModal.addEventListener('show.bs.modal', function (event) {
            // Button that triggered the modal
            const button = event.relatedTarget;

            // Get the closest table row
            const row = button.closest('tr');

            if (row) {
                // Extract data from the row
                const id = row.querySelector('td:nth-child(1) strong').textContent;
                const name = row.querySelector('td:nth-child(2) strong').textContent;
                const email = row.querySelector('td:nth-child(3)').textContent;
                const phone = row.querySelector('td:nth-child(4)').textContent;
                const statusBadge = row.querySelector('td:nth-child(5) .badge');
                const status = statusBadge ? statusBadge.textContent : '';

                // Populate the modal fields
                document.getElementById('editTraineeId').value = id;
                document.getElementById('editTraineeName').value = name;
                document.getElementById('editTraineeEmail').value = email;
                document.getElementById('editTraineePhone').value = phone;
                document.getElementById('editTraineeStatus').value = status;

                // Set a default password or leave empty for security
                document.getElementById('editTraineePassword').value = '';
            }
        });
    }
});