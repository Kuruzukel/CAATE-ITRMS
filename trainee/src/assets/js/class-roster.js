// Sample enrolled courses data
const enrolledCourses = [
    { id: 1, name: 'Beauty Care (Skin Care) NC II', hours: '307 hours', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=250&fit=crop' },
    { id: 2, name: 'Beauty Care (Nail Care) NC II', hours: '307 hours', image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=250&fit=crop' },
    { id: 3, name: 'Aesthetic Services Level II', hours: '264 hours', image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=250&fit=crop' }
];

// Sample students data for each course
const courseStudents = {
    1: [
        { id: 1, name: 'Maria Santos', initials: 'MS' },
        { id: 2, name: 'Anna Cruz', initials: 'AC' },
        { id: 3, name: 'Rosa Garcia', initials: 'RG' },
        { id: 4, name: 'Elena Lopez', initials: 'EL' },
        { id: 5, name: 'Sofia Martinez', initials: 'SM' },
        { id: 6, name: 'Isabella Reyes', initials: 'IR' },
        { id: 7, name: 'Carmen Flores', initials: 'CF' },
        { id: 8, name: 'Lucia Morales', initials: 'LM' },
        { id: 9, name: 'Valentina Ruiz', initials: 'VR' },
        { id: 10, name: 'Gabriela Soto', initials: 'GS' },
        { id: 11, name: 'Daniela Vargas', initials: 'DV' },
        { id: 12, name: 'Alejandra Pena', initials: 'AP' },
        { id: 13, name: 'Catalina Diaz', initials: 'CD' },
        { id: 14, name: 'Mariana Gutierrez', initials: 'MG' },
        { id: 15, name: 'Francisca Herrera', initials: 'FH' }
    ],
    2: [
        { id: 1, name: 'Maria Santos', initials: 'MS' },
        { id: 2, name: 'Anna Cruz', initials: 'AC' },
        { id: 3, name: 'Rosa Garcia', initials: 'RG' },
        { id: 4, name: 'Lucia Morales', initials: 'LM' },
        { id: 5, name: 'Valentina Ruiz', initials: 'VR' },
        { id: 6, name: 'Gabriela Soto', initials: 'GS' },
        { id: 7, name: 'Daniela Vargas', initials: 'DV' },
        { id: 8, name: 'Alejandra Pena', initials: 'AP' },
        { id: 9, name: 'Catalina Diaz', initials: 'CD' },
        { id: 10, name: 'Mariana Gutierrez', initials: 'MG' },
        { id: 11, name: 'Francisca Herrera', initials: 'FH' },
        { id: 12, name: 'Isabella Reyes', initials: 'IR' },
        { id: 13, name: 'Carmen Flores', initials: 'CF' },
        { id: 14, name: 'Elena Lopez', initials: 'EL' },
        { id: 15, name: 'Sofia Martinez', initials: 'SM' }
    ],
    3: [
        { id: 1, name: 'Elena Lopez', initials: 'EL' },
        { id: 2, name: 'Sofia Martinez', initials: 'SM' },
        { id: 3, name: 'Maria Santos', initials: 'MS' },
        { id: 4, name: 'Anna Cruz', initials: 'AC' },
        { id: 5, name: 'Isabella Reyes', initials: 'IR' },
        { id: 6, name: 'Carmen Flores', initials: 'CF' },
        { id: 7, name: 'Lucia Morales', initials: 'LM' },
        { id: 8, name: 'Valentina Ruiz', initials: 'VR' },
        { id: 9, name: 'Gabriela Soto', initials: 'GS' },
        { id: 10, name: 'Daniela Vargas', initials: 'DV' },
        { id: 11, name: 'Alejandra Pena', initials: 'AP' },
        { id: 12, name: 'Catalina Diaz', initials: 'CD' },
        { id: 13, name: 'Mariana Gutierrez', initials: 'MG' },
        { id: 14, name: 'Francisca Herrera', initials: 'FH' },
        { id: 15, name: 'Rosa Garcia', initials: 'RG' }
    ]
};

let selectedCourseId = 1; // Default to Beauty Care (Skin Care) NC II

// Avatar color palette
const avatarColors = [
    'linear-gradient(135deg, #3691bf 0%, #325596 100%)',
    'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
    'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
    'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
    'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
    'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    'linear-gradient(135deg, #84cc16 0%, #65a30d 100%)',
    'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
    'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
];

// Attendance status options
const attendanceStatus = ['Present', 'Absent'];

// Function to get random attendance status
function getRandomAttendance() {
    return attendanceStatus[Math.floor(Math.random() * attendanceStatus.length)];
}

// Function to get badge color based on status
function getBadgeColor(status) {
    return status === 'Present' ? 'bg-success' : 'bg-danger';
}

// Initialize courses view
function initializeCourses() {
    const container = document.getElementById('coursesContainer');
    container.innerHTML = '';

    // Show all three courses
    enrolledCourses.forEach((course, index) => {
        const card = document.createElement('div');
        card.className = 'col-md-6 col-lg-4 mb-4';
        card.innerHTML = `
            <div class="card course-card" data-course-id="${course.id}" onclick="viewStudents(${course.id}, '${course.name}', this)">
                <div class="card-body">
                    <div class="d-flex align-items-center mb-3">
                        <img src="${course.image}" alt="${course.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 50%; border: 3px solid #3691bf;" />
                    </div>
                    <h5 class="card-title">${course.name}</h5>
                    <p class="text-muted mb-0">
                        <i class="bx bx-time-five me-1"></i>${course.hours}
                    </p>
                </div>
            </div>
        `;
        container.appendChild(card);
    });

    // Automatically load the first course after cards are created
    setTimeout(() => {
        const firstCard = document.querySelector('.course-card');
        if (firstCard) {
            firstCard.classList.add('active');
            viewStudents(1, enrolledCourses[0].name, firstCard);
        }
    }, 100);
}

// View students for selected course
function viewStudents(courseId, courseName, cardElement) {
    selectedCourseId = courseId;

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

    const students = courseStudents[courseId] || [];
    const studentsList = document.getElementById('studentsList');
    studentsList.innerHTML = '';

    if (students.length === 0) {
        studentsList.innerHTML = '<p class="text-muted">No students enrolled in this course.</p>';
        return;
    }

    students.forEach((student, index) => {
        const studentItem = document.createElement('div');
        studentItem.className = 'student-item';
        const attendanceStatus = getRandomAttendance();
        const badgeColor = getBadgeColor(attendanceStatus);
        const avatarColor = avatarColors[index % avatarColors.length];

        studentItem.innerHTML = `
            <div class="student-avatar" style="background: linear-gradient(135deg, rgba(54, 145, 191, 0.1) 0%, rgba(50, 85, 150, 0.1) 100%); backdrop-filter: blur(10px) saturate(180%); -webkit-backdrop-filter: blur(10px) saturate(180%); border: 1px solid rgba(54, 145, 191, 0.4); box-shadow: 0 4px 12px rgba(22, 56, 86, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3); color: white;">${student.initials}</div>
            <div class="flex-grow-1">
                <h6 class="mb-0">${student.name}</h6>
                <small class="text-muted">Student ID: STU-${String(student.id).padStart(4, '0')}</small>
            </div>
            <span class="badge ${badgeColor}">${attendanceStatus}</span>
        `;
        studentsList.appendChild(studentItem);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    initializeCourses();

    // Force the first card to be active after a short delay
    setTimeout(() => {
        const firstCard = document.querySelector('.course-card');
        if (firstCard) {
            firstCard.classList.add('active');
            viewStudents(1, enrolledCourses[0].name, firstCard);
        }
    }, 200);
});