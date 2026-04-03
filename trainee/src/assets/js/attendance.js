

const enrolledCourses = [
    { id: 1, name: 'Beauty Care (Skin Care) NC II', hours: '307 hours', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=250&fit=crop' },
    { id: 2, name: 'Beauty Care (Nail Care) NC II', hours: '307 hours', image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=250&fit=crop' },
    { id: 3, name: 'Aesthetic Services Level II', hours: '264 hours', image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=250&fit=crop' }
];

let selectedCourseId = 1;

function selectCourse(courseId, courseName, cardElement) {
    selectedCourseId = courseId;
    document.getElementById('selectedCourseTitle').textContent = courseName;
    document.getElementById('attendanceForm').style.display = 'block';

    document.querySelectorAll('.course-card').forEach(card => {
        card.classList.remove('active');
        card.style.border = '';
        card.style.boxShadow = '';
        card.style.transform = '';

        const titleElement = card.querySelector('.card-title');
        if (titleElement) {
            titleElement.style.color = '';
            titleElement.style.fontWeight = '';
        }

        const imageElement = card.querySelector('img');
        if (imageElement) {
            imageElement.style.border = '3px solid #3691bf';
        }

        const timeIcon = card.querySelector('.bx-time-five');
        if (timeIcon) {
            timeIcon.style.color = '';
        }

        const hoursText = card.querySelector('.text-muted');
        if (hoursText) {
            hoursText.style.color = '';
        }
    });

    if (cardElement) {
        cardElement.classList.add('active');
        cardElement.style.border = '3px solid #10b981';
        cardElement.style.boxShadow = '0 0 15px rgba(16, 185, 129, 1), 0 0 30px rgba(16, 185, 129, 0.8), 0 0 45px rgba(5, 150, 105, 0.6), 0 4px 20px rgba(5, 150, 105, 0.4)';
        cardElement.style.transform = 'scale(1.02)';

        const titleElement = cardElement.querySelector('.card-title');
        if (titleElement) {
            titleElement.style.color = '#10b981';
            titleElement.style.fontWeight = '600';
        }

        const imageElement = cardElement.querySelector('img');
        if (imageElement) {
            imageElement.style.border = '3px solid #10b981';
        }

        const timeIcon = cardElement.querySelector('.bx-time-five');
        if (timeIcon) {
            timeIcon.style.color = '#10b981';
        }

        const hoursText = cardElement.querySelector('.text-muted');
        if (hoursText) {
            hoursText.style.color = '#10b981';
        }
    }

}

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

function showImageModal() {
    const imagePreview = document.getElementById('imagePreview');
    const modalImagePreview = document.getElementById('modalImagePreview');

    if (imagePreview.src) {
        modalImagePreview.src = imagePreview.src;
        const modal = new bootstrap.Modal(document.getElementById('imagePreviewModal'));
        modal.show();
    }
}

function showConfirmationModal(date, time) {
    const selectedCourse = enrolledCourses.find(course => course.id === selectedCourseId);
    const courseName = selectedCourse ? selectedCourse.name : 'Unknown Course';

    document.getElementById('modalCourseName').textContent = courseName;
    document.getElementById('modalDate').textContent = new Date(date).toLocaleDateString();
    document.getElementById('modalTime').textContent = time;

    const modal = new bootstrap.Modal(document.getElementById('confirmationModal'));
    modal.show();
}

function submitAttendance(date, time) {
    alert(`Attendance submitted successfully!\nCourse ID: ${selectedCourseId}\nDate: ${date}\nTime: ${time}`);

    document.getElementById('attendanceFormElement').reset();

    removeImagePreview();
}

document.addEventListener('DOMContentLoaded', function () {
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

    document.getElementById('removeImageBtn').addEventListener('click', () => {
        removeImagePreview();
    });

    document.getElementById('viewImageBtn').addEventListener('click', () => {
        showImageModal();
    });

    document.getElementById('attendanceFormElement').addEventListener('submit', (e) => {
        e.preventDefault();
        const date = document.getElementById('attendanceDate').value;
        const time = document.getElementById('attendanceTime').value;
        const notes = document.getElementById('notes').value;

        if (!date || !time) {
            alert('Please fill in all required fields');
            return;
        }

        showConfirmationModal(date, time);
    });

    document.getElementById('confirmSubmitBtn').addEventListener('click', () => {
        const date = document.getElementById('attendanceDate').value;
        const time = document.getElementById('attendanceTime').value;

        const modal = bootstrap.Modal.getInstance(document.getElementById('confirmationModal'));
        modal.hide();

        submitAttendance(date, time);
    });
});
