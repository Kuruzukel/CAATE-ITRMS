/* Attendance specific JavaScript */

// Sample enrolled courses
const enrolledCourses = [
    { id: 1, name: 'Beauty Care (Skin Care) NC II', hours: '307 hours', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=250&fit=crop' },
    { id: 2, name: 'Beauty Care (Nail Care) NC II', hours: '307 hours', image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=250&fit=crop' },
    { id: 3, name: 'Aesthetic Services Level II', hours: '264 hours', image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=250&fit=crop' }
];

let selectedCourseId = 1; // Default to first course

// Select course - updated to work with new card structure
function selectCourse(courseId, courseName, cardElement) {
    selectedCourseId = courseId;
    document.getElementById('selectedCourseTitle').textContent = courseName;
    document.getElementById('attendanceForm').style.display = 'block';

    // Update active card styling
    document.querySelectorAll('.course-card').forEach(card => {
        card.classList.remove('active');
        // Remove inline styles from all cards
        card.style.border = '';
        card.style.boxShadow = '';
        card.style.transform = '';

        // Reset title color
        const titleElement = card.querySelector('.card-title');
        if (titleElement) {
            titleElement.style.color = '';
            titleElement.style.fontWeight = '';
        }

        // Reset image border to original blue
        const imageElement = card.querySelector('img');
        if (imageElement) {
            imageElement.style.border = '3px solid #3691bf';
        }

        // Reset time icon color
        const timeIcon = card.querySelector('.bx-time-five');
        if (timeIcon) {
            timeIcon.style.color = '';
        }

        // Reset hours text color
        const hoursText = card.querySelector('.text-muted');
        if (hoursText) {
            hoursText.style.color = '';
        }
    });

    if (cardElement) {
        cardElement.classList.add('active');
        // Apply inline styles for maximum specificity - GREEN THEME
        cardElement.style.border = '3px solid #10b981';
        cardElement.style.boxShadow = '0 0 15px rgba(16, 185, 129, 1), 0 0 30px rgba(16, 185, 129, 0.8), 0 0 45px rgba(5, 150, 105, 0.6), 0 4px 20px rgba(5, 150, 105, 0.4)';
        cardElement.style.transform = 'scale(1.02)';

        // Change title color to green
        const titleElement = cardElement.querySelector('.card-title');
        if (titleElement) {
            titleElement.style.color = '#10b981';
            titleElement.style.fontWeight = '600';
        }

        // Change image border to green
        const imageElement = cardElement.querySelector('img');
        if (imageElement) {
            imageElement.style.border = '3px solid #10b981';
        }

        // Change time icon color to green
        const timeIcon = cardElement.querySelector('.bx-time-five');
        if (timeIcon) {
            timeIcon.style.color = '#10b981';
        }

        // Change hours text color to green
        const hoursText = cardElement.querySelector('.text-muted');
        if (hoursText) {
            hoursText.style.color = '#10b981';
        }
    }

    // Don't scroll to form automatically - let user stay where they are
}

// Image upload handling
function handleImageUpload(file) {
    if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const imagePreview = document.getElementById('imagePreview');
        const noImageText = document.getElementById('noImageText');
        const imageActionButtons = document.getElementById('imageActionButtons');

        imagePreview.src = e.target.result;
        imagePreview.style.display = 'block';
        noImageText.style.display = 'none';
        imageActionButtons.style.display = 'flex';
    };
    reader.readAsDataURL(file);
}

// Remove image preview
function removeImagePreview() {
    const imagePreview = document.getElementById('imagePreview');
    const noImageText = document.getElementById('noImageText');
    const imageActionButtons = document.getElementById('imageActionButtons');
    const imageInput = document.getElementById('imageInput');

    imagePreview.src = '';
    imagePreview.style.display = 'none';
    noImageText.style.display = 'block';
    imageActionButtons.style.display = 'none';
    imageInput.value = '';
}

// Show image in modal
function showImageModal() {
    const imagePreview = document.getElementById('imagePreview');
    const modalImagePreview = document.getElementById('modalImagePreview');

    if (imagePreview.src) {
        modalImagePreview.src = imagePreview.src;
        const modal = new bootstrap.Modal(document.getElementById('imagePreviewModal'));
        modal.show();
    }
}

// Show confirmation modal
function showConfirmationModal(date, time) {
    const selectedCourse = enrolledCourses.find(course => course.id === selectedCourseId);
    const courseName = selectedCourse ? selectedCourse.name : 'Unknown Course';

    // Update modal content
    document.getElementById('modalCourseName').textContent = courseName;
    document.getElementById('modalDate').textContent = new Date(date).toLocaleDateString();
    document.getElementById('modalTime').textContent = time;

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('confirmationModal'));
    modal.show();
}

// Submit attendance
function submitAttendance(date, time) {
    // Show success message
    alert(`Attendance submitted successfully!\nCourse ID: ${selectedCourseId}\nDate: ${date}\nTime: ${time}`);

    // Reset form
    document.getElementById('attendanceFormElement').reset();

    // Reset image preview
    removeImagePreview();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    // Set default course selection and show form immediately
    const firstCard = document.querySelector('.course-card[data-course-id="1"]');
    if (firstCard) {
        selectedCourseId = 1;
        document.getElementById('selectedCourseTitle').textContent = 'Beauty Care (Skin Care) NC II';
        document.getElementById('attendanceForm').style.display = 'block';
    }

    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');
    const imagePreview = document.getElementById('imagePreview');

    uploadArea.addEventListener('click', () => imageInput.click());

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
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleImageUpload(files[0]);
        }
    });

    imageInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleImageUpload(e.target.files[0]);
        }
    });

    // Remove image button
    document.getElementById('removeImageBtn').addEventListener('click', () => {
        removeImagePreview();
    });

    // View image button
    document.getElementById('viewImageBtn').addEventListener('click', () => {
        showImageModal();
    });

    // Form submission
    document.getElementById('attendanceFormElement').addEventListener('submit', (e) => {
        e.preventDefault();
        const date = document.getElementById('attendanceDate').value;
        const time = document.getElementById('attendanceTime').value;
        const notes = document.getElementById('notes').value;

        if (!date || !time) {
            alert('Please fill in all required fields');
            return;
        }

        // Show confirmation modal
        showConfirmationModal(date, time);
    });

    // Confirmation modal submit
    document.getElementById('confirmSubmitBtn').addEventListener('click', () => {
        const date = document.getElementById('attendanceDate').value;
        const time = document.getElementById('attendanceTime').value;

        // Hide modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('confirmationModal'));
        modal.hide();

        // Submit attendance
        submitAttendance(date, time);
    });
});