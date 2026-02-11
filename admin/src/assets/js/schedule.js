/* Schedule Page Script */
document.addEventListener('DOMContentLoaded', function () {
    // Menu Toggle Functionality
    const menuToggleBtn = document.querySelector('.menu-toggle-btn');
    const layoutMenu = document.getElementById('layout-menu');
    const layoutOverlay = document.querySelector('.layout-overlay');
    const layoutContainer = document.querySelector('.layout-container');

    if (menuToggleBtn && layoutMenu) {
        menuToggleBtn.addEventListener('click', function (e) {
            e.preventDefault();
            layoutMenu.classList.toggle('menu-hidden');

            // Toggle class on layout container to expand content
            if (layoutContainer) {
                layoutContainer.classList.toggle('menu-collapsed');
            }
        });
    }

    // Also toggle when clicking the overlay
    if (layoutOverlay && layoutMenu) {
        layoutOverlay.addEventListener('click', function () {
            layoutMenu.classList.toggle('menu-hidden');

            // Toggle class on layout container
            if (layoutContainer) {
                layoutContainer.classList.toggle('menu-collapsed');
            }
        });
    }

    // Initialize Calendar with fallback
    const calendarEl = document.getElementById('calendar');
    if (calendarEl) {
        // Add a loading message
        calendarEl.innerHTML = '<div class="text-center p-4"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div><p class="mt-2">Loading calendar...</p></div>';

        // Wait a bit for FullCalendar to load
        setTimeout(function () {
            try {
                // Check if FullCalendar is loaded or failed to load
                if (typeof FullCalendar === 'undefined' || window.FullCalendarLoadFailed) {
                    console.error('FullCalendar library not loaded or failed to load');
                    createFallbackCalendar(calendarEl);
                    return;
                }

                const calendar = new FullCalendar.Calendar(calendarEl, {
                    initialView: 'dayGridMonth',
                    headerToolbar: {
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    },
                    height: 'auto',
                    events: getSampleEvents(),
                    eventClick: function (info) {
                        showAppointmentDetails(info.event);
                    },
                    dateClick: function (info) {
                        console.log('Date clicked: ' + info.dateStr);
                    },
                    eventDidMount: function (info) {
                        const status = info.event.extendedProps.status;
                        if (status === 'pending') {
                            info.el.style.backgroundColor = '#f59e0b';
                            info.el.style.borderColor = '#f59e0b';
                        } else if (status === 'confirmed') {
                            info.el.style.backgroundColor = '#10b981';
                            info.el.style.borderColor = '#10b981';
                        } else if (status === 'cancelled') {
                            info.el.style.backgroundColor = '#ef4444';
                            info.el.style.borderColor = '#ef4444';
                            info.el.style.opacity = '0.7';
                        }
                    }
                });

                calendar.render();
            } catch (error) {
                console.error('Error initializing calendar:', error);
                createFallbackCalendar(calendarEl);
            }
        }, 1000);
    }

    // Sample events data
    function getSampleEvents() {
        return [
            {
                id: '1',
                title: 'Beauty Care Consultation',
                start: '2026-02-15T10:00:00',
                end: '2026-02-15T11:00:00',
                backgroundColor: '#10b981',
                borderColor: '#10b981',
                extendedProps: {
                    client: 'Maria Santos',
                    service: 'Beauty Care (Skincare)',
                    status: 'confirmed',
                    phone: '+63 912 345 6789',
                    email: 'maria.santos@email.com',
                    notes: 'First-time client, interested in anti-aging treatments'
                }
            },
            {
                id: '2',
                title: 'Advanced Skincare Session',
                start: '2026-02-16T14:00:00',
                end: '2026-02-16T16:00:00',
                backgroundColor: '#10b981',
                borderColor: '#10b981',
                extendedProps: {
                    client: 'Ana Cruz',
                    service: 'Advanced Skincare',
                    status: 'confirmed',
                    phone: '+63 917 123 4567',
                    email: 'ana.cruz@email.com',
                    notes: 'Regular client, acne treatment follow-up'
                }
            },
            {
                id: '3',
                title: 'Nail Care Appointment',
                start: '2026-02-17T09:00:00',
                end: '2026-02-17T10:30:00',
                backgroundColor: '#f59e0b',
                borderColor: '#f59e0b',
                extendedProps: {
                    client: 'Lisa Garcia',
                    service: 'Beauty Care (Nail Care)',
                    status: 'pending',
                    phone: '+63 905 987 6543',
                    email: 'lisa.garcia@email.com',
                    notes: 'Gel manicure and pedicure service'
                }
            },
            {
                id: '4',
                title: 'Aesthetic Services',
                start: '2026-02-18T13:00:00',
                end: '2026-02-18T15:00:00',
                backgroundColor: '#10b981',
                borderColor: '#10b981',
                extendedProps: {
                    client: 'Carmen Reyes',
                    service: 'Aesthetic Services',
                    status: 'confirmed',
                    phone: '+63 920 456 7890',
                    email: 'carmen.reyes@email.com',
                    notes: 'Facial treatment and skin analysis'
                }
            },
            {
                id: '5',
                title: 'Permanent Makeup Consultation',
                start: '2026-02-19T11:00:00',
                end: '2026-02-19T12:00:00',
                backgroundColor: '#ef4444',
                borderColor: '#ef4444',
                extendedProps: {
                    client: 'Sofia Mendoza',
                    service: 'Permanent Makeup Tattoo',
                    status: 'cancelled',
                    phone: '+63 918 765 4321',
                    email: 'sofia.mendoza@email.com',
                    notes: 'Client cancelled due to scheduling conflict'
                }
            },
            {
                id: '6',
                title: 'Skincare Training Session',
                start: '2026-02-20T10:00:00',
                end: '2026-02-20T12:00:00',
                backgroundColor: '#10b981',
                borderColor: '#10b981',
                extendedProps: {
                    client: 'Jennifer Lopez',
                    service: 'Beauty Care (Skincare)',
                    status: 'confirmed',
                    phone: '+63 915 234 5678',
                    email: 'jennifer.lopez@email.com',
                    notes: 'Hands-on training for skincare techniques'
                }
            },
            {
                id: '7',
                title: 'Nail Art Workshop',
                start: '2026-02-21T14:00:00',
                end: '2026-02-21T17:00:00',
                backgroundColor: '#f59e0b',
                borderColor: '#f59e0b',
                extendedProps: {
                    client: 'Michelle Torres',
                    service: 'Beauty Care (Nail Care)',
                    status: 'pending',
                    phone: '+63 908 876 5432',
                    email: 'michelle.torres@email.com',
                    notes: 'Advanced nail art techniques workshop'
                }
            },
            {
                id: '8',
                title: 'Eyebrow Microblading',
                start: '2026-02-22T09:00:00',
                end: '2026-02-22T11:00:00',
                backgroundColor: '#10b981',
                borderColor: '#10b981',
                extendedProps: {
                    client: 'Rachel Kim',
                    service: 'Permanent Makeup Tattoo',
                    status: 'confirmed',
                    phone: '+63 922 345 6789',
                    email: 'rachel.kim@email.com',
                    notes: 'Eyebrow microblading procedure'
                }
            }
        ];
    }

    // Fallback calendar function
    function createFallbackCalendar(calendarEl) {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        calendarEl.innerHTML = `
            <div class="fc">
                <div class="fc-header-toolbar">
                    <div class="fc-toolbar-chunk">
                        <button class="fc-button" onclick="alert('Previous month')">‹</button>
                        <button class="fc-button" onclick="alert('Next month')">›</button>
                        <button class="fc-button" onclick="alert('Today')">Today</button>
                    </div>
                    <div class="fc-toolbar-chunk">
                        <h2 class="fc-toolbar-title">${getMonthName(currentMonth)} ${currentYear}</h2>
                    </div>
                    <div class="fc-toolbar-chunk">
                        <button class="fc-button fc-button-active">Month</button>
                        <button class="fc-button">Week</button>
                        <button class="fc-button">Day</button>
                    </div>
                </div>
                <table style="width: 100%;">
                    <thead>
                        <tr>
                            <th class="fc-col-header-cell">Sun</th>
                            <th class="fc-col-header-cell">Mon</th>
                            <th class="fc-col-header-cell">Tue</th>
                            <th class="fc-col-header-cell">Wed</th>
                            <th class="fc-col-header-cell">Thu</th>
                            <th class="fc-col-header-cell">Fri</th>
                            <th class="fc-col-header-cell">Sat</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${generateCalendarDays(currentYear, currentMonth)}
                    </tbody>
                </table>
                <div class="mt-3 text-center">
                    <small class="text-muted">Calendar loaded in fallback mode. Refresh page to try loading full calendar.</small>
                </div>
            </div>
        `;
    }

    // Helper function to generate calendar days
    function generateCalendarDays(year, month) {
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        let html = '';
        let day = 1;

        for (let week = 0; week < 6; week++) {
            html += '<tr>';
            for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
                if (week === 0 && dayOfWeek < firstDay) {
                    html += '<td class="fc-daygrid-day" style="height: 100px;"></td>';
                } else if (day > daysInMonth) {
                    html += '<td class="fc-daygrid-day" style="height: 100px;"></td>';
                } else {
                    const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
                    const todayClass = isToday ? 'fc-day-today' : '';
                    html += `<td class="fc-daygrid-day ${todayClass}" style="height: 100px;">
                        <div class="fc-daygrid-day-number">${day}</div>
                        ${getFallbackEvents(day)}
                    </td>`;
                    day++;
                }
            }
            html += '</tr>';
            if (day > daysInMonth) break;
        }
        return html;
    }

    // Helper function to get sample events for specific days
    function getFallbackEvents(day) {
        const events = {
            15: '<div class="fc-event" style="background-color: #10b981; border-color: #10b981;">Beauty Care Consultation</div>',
            16: '<div class="fc-event" style="background-color: #10b981; border-color: #10b981;">Advanced Skincare</div>',
            17: '<div class="fc-event" style="background-color: #f59e0b; border-color: #f59e0b;">Nail Care</div>',
            18: '<div class="fc-event" style="background-color: #10b981; border-color: #10b981;">Aesthetic Services</div>',
            19: '<div class="fc-event" style="background-color: #ef4444; border-color: #ef4444; opacity: 0.7;">Permanent Makeup</div>'
        };
        return events[day] || '';
    }

    // Helper function to get month name
    function getMonthName(month) {
        const months = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        return months[month];
    }

    // Function to show appointment details in modal
    function showAppointmentDetails(event) {
        const modal = document.getElementById('appointmentModal');
        const modalTitle = document.getElementById('appointmentModalTitle');
        const modalBody = document.getElementById('appointmentModalBody');

        if (modal && modalTitle && modalBody) {
            modalTitle.textContent = 'Appointment Details';

            const startTime = event.start.toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            const endTime = event.end ? event.end.toLocaleString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            }) : 'N/A';

            const client = event.extendedProps.client || 'N/A';
            const service = event.extendedProps.service || 'N/A';
            const status = event.extendedProps.status || 'N/A';
            const phone = event.extendedProps.phone || 'N/A';
            const email = event.extendedProps.email || 'N/A';
            const notes = event.extendedProps.notes || 'No additional notes';

            modalBody.innerHTML = `
                <div class="row">
                    <div class="col-md-12">
                        <h6 class="mb-3">Contact Information</h6>
                        <div class="row mb-2">
                            <div class="col-sm-4"><strong>Name:</strong></div>
                            <div class="col-sm-8">${client}</div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-sm-4"><strong>Email:</strong></div>
                            <div class="col-sm-8">${email}</div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-sm-4"><strong>Phone:</strong></div>
                            <div class="col-sm-8">${phone}</div>
                        </div>
                        <hr />
                        <h6 class="mb-3">Appointment Information</h6>
                        <div class="row mb-2">
                            <div class="col-sm-4"><strong>Service:</strong></div>
                            <div class="col-sm-8">${service}</div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-sm-4"><strong>Date & Time:</strong></div>
                            <div class="col-sm-8">${startTime}</div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-sm-4"><strong>End Time:</strong></div>
                            <div class="col-sm-8">${endTime}</div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-sm-4"><strong>Status:</strong></div>
                            <div class="col-sm-8"><span class="badge bg-${getStatusColor(status)}">${status.charAt(0).toUpperCase() + status.slice(1)}</span></div>
                        </div>
                        <hr />
                        <h6 class="mb-3">Admin Notes</h6>
                        <div class="alert alert-secondary mb-2">
                            <small class="text-muted d-block mb-1"><i class="bx bx-time"></i> ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - Admin</small>
                            <p class="mb-0">${notes}</p>
                        </div>
                    </div>
                </div>
            `;

            // Show the modal
            try {
                const bootstrapModal = new bootstrap.Modal(modal);
                bootstrapModal.show();
            } catch (error) {
                console.error('Error showing modal:', error);
                // Fallback: show modal without Bootstrap
                modal.style.display = 'block';
                modal.classList.add('show');
            }
        }
    }

    // Helper function to get status color
    function getStatusColor(status) {
        switch (status) {
            case 'confirmed':
                return 'success';
            case 'pending':
                return 'warning';
            case 'cancelled':
                return 'danger';
            default:
                return 'secondary';
        }
    }

    // Search functionality
    const searchInput = document.getElementById('scheduleSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function (e) {
            const searchTerm = e.target.value.toLowerCase();
            console.log('Searching for:', searchTerm);
        });
    }

    // Update copyright year
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
});