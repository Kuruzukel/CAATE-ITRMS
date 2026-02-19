/* Courses Page Functionality */

// API Configuration
const API_BASE_URL = 'http://localhost/CAATE-ITRMS/backend/public/api/v1';

// State
let courses = [];
let currentCourseId = null;
let currentCourseCard = null;
let editImageFile = null;
let originalCourseData = {}; // Store original course data for comparison

document.addEventListener('DOMContentLoaded', function () {
    // Load courses from database
    loadCourses();

    // Initialize image upload functionality for edit modal
    initializeEditImageUpload();

    // Reset modal when closed
    const editModal = document.getElementById('editCourseModal');
    editModal.addEventListener('hidden.bs.modal', function () {
        // Reset form
        document.getElementById('editCourseForm').reset();

        // Reset image state
        editImageFile = null;
        resetEditImagePreview();

        // Clear file input
        document.getElementById('editImageInput').value = '';

        // Reset current course tracking
        currentCourseId = null;
        currentCourseCard = null;
    });

    // When edit button is clicked, populate modal with course data
    document.addEventListener('click', function (e) {
        if (e.target.closest('.edit-course-btn')) {
            const btn = e.target.closest('.edit-course-btn');
            currentCourseCard = btn.closest('.card');
            currentCourseId = btn.dataset.id;

            // Store original values for comparison
            originalCourseData = {
                badge: btn.dataset.badge,
                title: btn.dataset.title,
                description: btn.dataset.description,
                hours: btn.dataset.hours,
                image: btn.dataset.image || ''
            };

            document.getElementById('editCourseBadge').value = originalCourseData.badge;
            document.getElementById('editCourseTitle').value = originalCourseData.title;
            document.getElementById('editCourseDescription').value = originalCourseData.description;
            document.getElementById('editCourseHours').value = originalCourseData.hours;

            // Load existing image if available
            const imageUrl = originalCourseData.image;
            if (imageUrl && imageUrl !== '') {
                loadExistingImage(imageUrl);
            } else {
                resetEditImagePreview();
            }
        }
    });

    // Save changes
    document.getElementById('saveCourseBtn').addEventListener('click', async function () {
        if (!currentCourseId) return;

        // Validate required fields
        const badge = document.getElementById('editCourseBadge').value.trim();
        const title = document.getElementById('editCourseTitle').value.trim();
        const description = document.getElementById('editCourseDescription').value.trim();
        const hours = document.getElementById('editCourseHours').value.trim();

        if (!badge || !title || !description || !hours) {
            showToast('Please fill in all required fields', 'error');
            return;
        }

        const courseData = {
            badge: badge,
            title: title,
            description: description,
            hours: hours
        };

        // If a new image file was uploaded, convert to base64
        if (editImageFile) {
            const reader = new FileReader();
            reader.onload = async function (e) {
                courseData.image = e.target.result;
                await updateCourse(courseData);
            };
            reader.readAsDataURL(editImageFile);
        } else {
            // Keep the original image value (don't send if unchanged)
            courseData.image = originalCourseData.image;
            await updateCourse(courseData);
        }
    });

    // Menu toggle is handled by main.js - no need to duplicate here
});

// Update course function
async function updateCourse(courseData) {
    const saveBtn = document.getElementById('saveCourseBtn');
    const originalText = saveBtn.innerHTML;

    try {
        // Show loading state
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin me-2"></i>Saving...';

        const response = await fetch(`${API_BASE_URL}/courses/${currentCourseId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(courseData)
        });

        const result = await response.json();

        if (result.success) {
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('editCourseModal'));
            modal.hide();

            // Reset image state
            editImageFile = null;
            resetEditImagePreview();

            // Show appropriate toast notification based on whether changes were made
            if (result.modified === false) {
                showToast('No changes were made to the course', 'info');
            } else {
                // Only reload courses if changes were actually made
                await loadCourses();
                showToast('Course updated successfully!', 'success');
            }
        } else {
            showToast(result.error || 'Failed to update course', 'error');
        }
    } catch (error) {
        console.error('Error updating course:', error);
        showToast('Error updating course. Please try again.', 'error');
    } finally {
        // Restore button state
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalText;
    }
}

// Load courses from database
async function loadCourses() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    const coursesGrid = document.getElementById('coursesGrid');

    try {
        const response = await fetch(`${API_BASE_URL}/courses`);

        const result = await response.json();

        if (result.success && result.data) {
            courses = result.data;

            renderCourses(courses);

            // Hide loading, show grid
            if (loadingSpinner) loadingSpinner.style.display = 'none';
            if (coursesGrid) coursesGrid.style.display = 'flex';
        } else {
            console.error('API returned error:', result);
            if (loadingSpinner) loadingSpinner.style.display = 'none';
            if (coursesGrid) {
                coursesGrid.style.display = 'block';
                coursesGrid.innerHTML = '<div class="col-12 text-center"><p>No courses found. Please add courses to the database.</p></div>';
            }
            showToast(result.error || 'No courses found', 'error');
        }
    } catch (error) {
        console.error('Error loading courses:', error);
        if (loadingSpinner) loadingSpinner.style.display = 'none';
        if (coursesGrid) {
            coursesGrid.style.display = 'block';
            coursesGrid.innerHTML = '<div class="col-12 text-center"><p class="text-danger">Error loading courses. Check console for details.</p></div>';
        }
        showToast('Error loading courses. Please check your connection.', 'error');
    }
}

// Render courses to the page
// Render courses to the page
function renderCourses(coursesData) {
    const container = document.getElementById('coursesGrid');
    if (!container) return;

    container.innerHTML = '';

    coursesData.forEach(course => {
        const courseId = course._id.$oid || course._id;
        const col = document.createElement('div');
        col.className = 'col';

        // Use badge/hours if available, fallback to course_code/duration
        const badge = course.badge || course.course_code || 'N/A';
        const hours = course.hours || course.duration || 'N/A';

        // Determine badge color based on badge text
        let badgeClass = 'bg-primary';
        if (badge.includes('Level III')) {
            badgeClass = 'bg-info';
        } else if (badge.includes('Level I')) {
            badgeClass = 'bg-secondary';
        } else if (badge.includes('Specialized')) {
            badgeClass = 'bg-warning';
        } else if (badge.includes('NC II')) {
            badgeClass = 'bg-primary';
        }

        // Handle image display - use stored image or default placeholder
        const imageUrl = course.image && course.image.trim() !== ''
            ? course.image
            : '../assets/images/CAATE_META_LOGO.png';

        // Get enrollment status or default to 'Unpublished'
        const enrollmentStatus = course.enrollment_status || 'Unpublished';

        // Determine status badge color
        let statusBadgeClass = 'bg-secondary';
        if (enrollmentStatus === 'Open Enrollment') {
            statusBadgeClass = 'bg-success';
        } else if (enrollmentStatus === 'Closed') {
            statusBadgeClass = 'bg-danger';
        }

        col.innerHTML = `
            <div class="card h-100">
                <div class="position-relative">
                    <img src="${imageUrl}"
                        class="card-img-top" alt="${course.title}"
                        style="height: 200px; object-fit: cover;"
                        onerror="this.src='../assets/images/CAATE_META_LOGO.png'" />
                    <div class="position-absolute top-0 end-0 p-2">
                        <div class="dropdown">
                            <button class="btn btn-sm dropdown-toggle enrollment-status-btn px-2 py-1" 
                                type="button" 
                                data-bs-toggle="dropdown" 
                                aria-expanded="false"
                                data-id="${courseId}"
                                data-status="${enrollmentStatus}"
                                style="border: none; background: transparent;">
                                <span class="badge ${statusBadgeClass}">${enrollmentStatus}</span>
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end">
                                <li><a class="dropdown-item status-option" href="#" data-status="Open Enrollment">
                                    <span class="badge bg-success me-2">Open Enrollment</span>
                                </a></li>
                                <li><a class="dropdown-item status-option" href="#" data-status="Closed">
                                    <span class="badge bg-danger me-2">Closed</span>
                                </a></li>
                                <li><a class="dropdown-item status-option" href="#" data-status="Unpublished">
                                    <span class="badge bg-secondary me-2">Unpublished</span>
                                </a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="card-body d-flex flex-column">
                    <span class="badge ${badgeClass} mb-2 align-self-start">${badge}</span>
                    <h5 class="card-title">${course.title}</h5>
                    <p class="card-text flex-grow-1">${course.description}</p>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <small><i class="fas fa-clock me-1"></i> ${hours}</small>
                        <button class="btn btn-sm btn-outline-primary edit-course-btn"
                            data-bs-toggle="modal" data-bs-target="#editCourseModal"
                            data-id="${courseId}"
                            data-badge="${badge}"
                            data-title="${course.title}"
                            data-description="${course.description}"
                            data-hours="${hours}"
                            data-image="${course.image || ''}">
                            <i class="bx bx-edit"></i> Edit
                        </button>
                    </div>
                </div>
            </div>
        `;

        container.appendChild(col);
    });
}


// Toast notification function
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;

    const icon = type === 'success' ? 'bx-check-circle' :
        type === 'error' ? 'bx-error' :
            type === 'warning' ? 'bx-error' : 'bx-info-circle';

    toast.innerHTML = `
        <div class="toast-icon-wrapper">
            <i class="bx ${icon} toast-icon"></i>
        </div>
        <div class="toast-content">
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="closeToast(this)">
            <i class="bx bx-x"></i>
        </button>
    `;

    container.appendChild(toast);

    // Auto remove after 5 seconds
    setTimeout(() => {
        closeToast(toast.querySelector('.toast-close'));
    }, 5000);
}

// Close toast notification
function closeToast(button) {
    const toast = button.closest('.toast-notification');
    if (toast) {
        toast.classList.add('hiding');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }
}


// Initialize image upload functionality for edit modal
function initializeEditImageUpload() {
    const uploadArea = document.getElementById('editUploadArea');
    const imageInput = document.getElementById('editImageInput');
    const imagePreview = document.getElementById('editImagePreview');
    const noImageText = document.getElementById('editNoImageText');
    const imageActionButtons = document.getElementById('editImageActionButtons');
    const viewImageBtn = document.getElementById('editViewImageBtn');
    const removeImageBtn = document.getElementById('editRemoveImageBtn');

    // Click to upload
    uploadArea.addEventListener('click', () => {
        imageInput.click();
    });

    // File input change
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleEditImageFile(file);
        }
    });

    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleEditImageFile(file);
        }
    });

    // View image button
    viewImageBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const imgSrc = imagePreview.src;
        if (imgSrc) {
            // Set the modal image source
            const modalImagePreview = document.getElementById('editModalImagePreview');
            modalImagePreview.src = imgSrc;

            // Show the modal
            const imagePreviewModalElement = document.getElementById('editImagePreviewModal');
            const imagePreviewModal = new bootstrap.Modal(imagePreviewModalElement);
            imagePreviewModal.show();

            // Handle modal close to restore edit modal state
            imagePreviewModalElement.addEventListener('hidden.bs.modal', function handleModalClose() {
                // Ensure body has modal-open class
                document.body.classList.add('modal-open');

                // Check if backdrop exists, if not create one
                setTimeout(() => {
                    const backdrops = document.querySelectorAll('.modal-backdrop');
                    if (backdrops.length === 0) {
                        const backdrop = document.createElement('div');
                        backdrop.className = 'modal-backdrop fade show';
                        document.body.appendChild(backdrop);
                    } else if (backdrops.length > 1) {
                        // Remove extra backdrops to prevent glitching
                        for (let i = 1; i < backdrops.length; i++) {
                            backdrops[i].remove();
                        }
                    }
                }, 100);
            }, { once: true });
        }
    });

    // Remove image button
    removeImageBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        resetEditImagePreview();
        editImageFile = null;
        imageInput.value = '';
    });
}

// Handle image file for edit modal
function handleEditImageFile(file) {
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
        showToast('Image size must be less than 5MB', 'error');
        return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file', 'error');
        return;
    }

    editImageFile = file;

    // Show file info
    const fileSizeKB = (file.size / 1024).toFixed(2);
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    const sizeText = file.size > 1024 * 1024 ? `${fileSizeMB} MB` : `${fileSizeKB} KB`;

    // Preview image
    const reader = new FileReader();
    reader.onload = (e) => {
        const imagePreview = document.getElementById('editImagePreview');
        const noImageText = document.getElementById('editNoImageText');
        const imageActionButtons = document.getElementById('editImageActionButtons');

        imagePreview.src = e.target.result;
        imagePreview.style.display = 'block';
        noImageText.style.display = 'none';
        imageActionButtons.style.display = 'flex';

        showToast(`Image loaded: ${file.name} (${sizeText})`, 'success');
    };
    reader.readAsDataURL(file);
}

// Load existing image in edit modal
function loadExistingImage(imageUrl) {
    const imagePreview = document.getElementById('editImagePreview');
    const noImageText = document.getElementById('editNoImageText');
    const imageActionButtons = document.getElementById('editImageActionButtons');

    if (imageUrl && imageUrl !== '') {
        imagePreview.src = imageUrl;
        imagePreview.style.display = 'block';
        noImageText.style.display = 'none';
        imageActionButtons.style.display = 'flex';
    } else {
        resetEditImagePreview();
    }
}

// Reset image preview in edit modal
function resetEditImagePreview() {
    const imagePreview = document.getElementById('editImagePreview');
    const noImageText = document.getElementById('editNoImageText');
    const imageActionButtons = document.getElementById('editImageActionButtons');

    imagePreview.src = '';
    imagePreview.style.display = 'none';
    noImageText.style.display = 'block';
    imageActionButtons.style.display = 'none';
}
