/* Attendance Page Script */
document.addEventListener('DOMContentLoaded', function () {
    // Menu toggle is handled by main.js - no need to duplicate here

    // Image Upload Handlers for Edit Modal

    // Time In Image Upload
    const editTimeInInput = document.getElementById('editTimeInImage');
    const editTimeInPreview = document.getElementById('editTimeInImagePreview');
    const editTimeInActions = document.getElementById('editTimeInActions');

    if (editTimeInInput) {
        editTimeInInput.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                // Validate file size (5MB max)
                if (file.size > 5 * 1024 * 1024) {
                    alert('File size must be less than 5MB');
                    return;
                }

                const reader = new FileReader();
                reader.onload = function (event) {
                    editTimeInPreview.innerHTML = `<img src="${event.target.result}" alt="Time In Preview" class="img-fluid rounded" style="max-height: 180px; object-fit: contain;">`;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Time Out Image Upload
    const editTimeOutInput = document.getElementById('editTimeOutImage');
    const editTimeOutPreview = document.getElementById('editTimeOutImagePreview');
    const editTimeOutActions = document.getElementById('editTimeOutActions');

    if (editTimeOutInput) {
        editTimeOutInput.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                // Validate file size (5MB max)
                if (file.size > 5 * 1024 * 1024) {
                    alert('File size must be less than 5MB');
                    return;
                }

                const reader = new FileReader();
                reader.onload = function (event) {
                    editTimeOutPreview.innerHTML = `<img src="${event.target.result}" alt="Time Out Preview" class="img-fluid rounded" style="max-height: 180px; object-fit: contain;">`;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // View and Delete button handlers
    setupImageActionButtons();
});

// Setup action buttons for view and delete
function setupImageActionButtons() {
    // Time In - View button
    const timeInViewBtn = document.querySelector('#editTimeInActions .btn-primary');
    if (timeInViewBtn) {
        timeInViewBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            showImageModal('timeIn');
        });
    }

    // Time In - Delete button
    const timeInDeleteBtn = document.querySelector('#editTimeInActions .btn-danger');
    if (timeInDeleteBtn) {
        timeInDeleteBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            removeImagePreview('timeIn');
        });
    }

    // Time Out - View button
    const timeOutViewBtn = document.querySelector('#editTimeOutActions .btn-primary');
    if (timeOutViewBtn) {
        timeOutViewBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            showImageModal('timeOut');
        });
    }

    // Time Out - Delete button
    const timeOutDeleteBtn = document.querySelector('#editTimeOutActions .btn-danger');
    if (timeOutDeleteBtn) {
        timeOutDeleteBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            removeImagePreview('timeOut');
        });
    }
}

// Show image in modal
function showImageModal(type) {
    const previewDiv = type === 'timeIn'
        ? document.getElementById('editTimeInImagePreview')
        : document.getElementById('editTimeOutImagePreview');

    const modalImagePreview = type === 'timeIn'
        ? document.getElementById('modalTimeInImagePreview')
        : document.getElementById('modalTimeOutImagePreview');

    const modalId = type === 'timeIn'
        ? 'timeInImagePreviewModal'
        : 'timeOutImagePreviewModal';

    const img = previewDiv.querySelector('img');

    if (img && img.src) {
        modalImagePreview.src = img.src;
        const modal = new bootstrap.Modal(document.getElementById(modalId));
        modal.show();
    }
}

// Remove image preview
function removeImagePreview(type) {
    const previewDiv = type === 'timeIn'
        ? document.getElementById('editTimeInImagePreview')
        : document.getElementById('editTimeOutImagePreview');

    const inputField = type === 'timeIn'
        ? document.getElementById('editTimeInImage')
        : document.getElementById('editTimeOutImage');

    // Clear the preview and show placeholder
    previewDiv.innerHTML = `
        <div class="text-center">
            <i class="bx bx-image-alt" style="font-size: 3rem; color: #64748b; opacity: 0.5;"></i>
            <p class="mt-2 mb-0" style="color: #94a3b8;">No image selected</p>
            <small style="color: #64748b;">Upload an image to see preview</small>
        </div>
    `;

    // Reset input
    inputField.value = '';
}

// Delete Confirmation Handler
const deleteConfirmInput = document.getElementById('deleteConfirmInput');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

if (deleteConfirmInput && confirmDeleteBtn) {
    deleteConfirmInput.addEventListener('input', function () {
        const inputValue = this.value.trim().toLowerCase();
        if (inputValue === 'delete') {
            confirmDeleteBtn.disabled = false;
            confirmDeleteBtn.classList.remove('disabled');
        } else {
            confirmDeleteBtn.disabled = true;
            confirmDeleteBtn.classList.add('disabled');
        }
    });

    // Reset input when modal is closed
    const deleteModal = document.getElementById('deleteModal');
    if (deleteModal) {
        deleteModal.addEventListener('hidden.bs.modal', function () {
            deleteConfirmInput.value = '';
            confirmDeleteBtn.disabled = true;
            confirmDeleteBtn.classList.add('disabled');
        });
    }
}
