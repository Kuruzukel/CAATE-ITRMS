/* Schedule Page Script */
document.addEventListener('DOMContentLoaded', function () {
    // Menu toggle is handled by main.js - no need to duplicate here

    // Function to update avatar alignment based on count
    function updateAvatarAlignment() {
        const dayCells = document.querySelectorAll('.fc-daygrid-day-events');
        dayCells.forEach(cell => {
            const eventCount = cell.querySelectorAll('.fc-daygrid-event-harness').length;
            // Center align if 1-2 avatars, left align if 3 or more
            if (eventCount > 0 && eventCount <= 2) {
                cell.classList.add('center-avatars');
            } else {
                cell.classList.remove('center-avatars');
            }
        });
    }

    // Initialize Calendar with fallback
    const calendarEl = document.getElementById('calendar');
    if (calendarEl) {
        // Add a loading message
        calendarEl.innerHTML = '<div class="text-center p-4"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div><p class="mt-2">Loading calendar...</p></div>';

        // Wait a bit for FullCalendar to load
        setTimeout(async function () {
            try {
                // Check if FullCalendar is loaded or failed to load
                if (typeof FullCalendar === 'undefined' || window.FullCalendarLoadFailed) {
                    console.error('FullCalendar library not loaded or failed to load');
                    createFallbackCalendar(calendarEl);
                    return;
                }

                // Fetch appointments from API
                const appointments = await fetchAppointments();

                const calendar = new FullCalendar.Calendar(calendarEl, {
                    initialView: 'dayGridMonth',
                    headerToolbar: {
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    },
                    height: 'auto',
                    dayMaxEvents: false, // Show all events, no limit
                    displayEventTime: true, // Show event times in week/day view
                    displayEventEnd: false,
                    events: function (info, successCallback, failureCallback) {
                        // Fetch appointments dynamically when calendar changes
                        fetchAppointments().then(appointments => {
                            const events = convertToCalendarEvents(appointments);
                            console.log('Loaded events:', events.length, 'for date range:', info.startStr, 'to', info.endStr);
                            successCallback(events);
                        }).catch(error => {
                            console.error('Error loading events:', error);
                            failureCallback(error);
                        });
                    },
                    eventClick: function (info) {
                        showAppointmentDetails(info.event);
                    },
                    dateClick: function (info) {
                        // Date clicked
                    },
                    eventDidMount: function (info) {
                        // Add avatar to event - only show avatar, no name
                        const initials = info.event.extendedProps.initials;
                        if (initials) {
                            // Find the event title element
                            const eventTitle = info.el.querySelector('.fc-event-title');
                            const eventMain = info.el.querySelector('.fc-event-main');

                            if (eventTitle) {
                                // Only show the avatar icon
                                eventTitle.innerHTML = `
                                    <div style="background: linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 100%); 
                                                backdrop-filter: blur(10px) saturate(180%); 
                                                -webkit-backdrop-filter: blur(10px) saturate(180%); 
                                                border: 1px solid rgba(255, 255, 255, 0.4); 
                                                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3); 
                                                color: white; 
                                                display: inline-flex; 
                                                align-items: center; 
                                                justify-content: center; 
                                                border-radius: 50%; 
                                                width: 28px; 
                                                height: 28px; 
                                                font-weight: 600; 
                                                font-size: 11px;
                                                margin: 2px;">
                                        ${initials}
                                    </div>
                                `;
                            } else if (eventMain) {
                                // Fallback: if no title element, add to main
                                eventMain.innerHTML = `
                                    <div style="background: linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 100%); 
                                                backdrop-filter: blur(10px) saturate(180%); 
                                                -webkit-backdrop-filter: blur(10px) saturate(180%); 
                                                border: 1px solid rgba(255, 255, 255, 0.4); 
                                                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3); 
                                                color: white; 
                                                display: inline-flex; 
                                                align-items: center; 
                                                justify-content: center; 
                                                border-radius: 50%; 
                                                width: 28px; 
                                                height: 28px; 
                                                font-weight: 600; 
                                                font-size: 11px;
                                                margin: 2px;">
                                        ${initials}
                                    </div>
                                `;
                            }
                        }

                        // Apply status-based styling
                        const status = info.event.extendedProps.status;
                        if (status === 'pending') {
                            info.el.style.backgroundColor = 'transparent';
                            info.el.style.borderColor = 'transparent';
                        } else if (status === 'approved' || status === 'confirmed') {
                            info.el.style.backgroundColor = 'transparent';
                            info.el.style.borderColor = 'transparent';
                        } else if (status === 'cancelled') {
                            info.el.style.backgroundColor = 'transparent';
                            info.el.style.borderColor = 'transparent';
                            info.el.style.opacity = '0.5';
                        }
                    },
                    viewDidMount: function () {
                        // After calendar renders, check each day cell and center if 1-2 avatars
                        updateAvatarAlignment();
                    },
                    datesSet: function () {
                        // When dates change (month/week/day navigation), update alignment
                        setTimeout(updateAvatarAlignment, 100);
                    }
                });

                calendar.render();

                // Update statistics
                updateStatistics(appointments);
            } catch (error) {
                console.error('Error initializing calendar:', error);
                createFallbackCalendar(calendarEl);
            }
        }, 1000);
    }

    // Fetch appointments from API
    async function fetchAppointments() {
        try {
            const response = await fetch('/CAATE-ITRMS/backend/public/api/v1/appointments');
            const result = await response.json();

            if (result.success && result.data) {
                return result.data;
            }
            return [];
        } catch (error) {
            console.error('Error fetching appointments:', error);
            return [];
        }
    }

    // Convert appointments to calendar events
    function convertToCalendarEvents(appointments) {
        return appointments.map(appointment => {
            // Build full name
            const fullName = [
                appointment.firstName,
                appointment.secondName,
                appointment.middleName,
                appointment.lastName,
                appointment.suffix
            ].filter(Boolean).join(' ');

            // Get initials for avatar
            const firstName = appointment.firstName || '';
            const lastName = appointment.lastName || '';
            const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || 'NA';

            // Format service category
            const categoryMap = {
                'skincare': 'Skin Care',
                'haircare': 'Hair Care',
                'nailcare': 'Nail Care',
                'bodytreatment': 'Body Treatment',
                'aesthetic': 'Aesthetic Services'
            };
            const serviceCategory = categoryMap[appointment.serviceCategory] || appointment.serviceCategory || '';

            // Format service type
            const serviceType = appointment.serviceType
                ? appointment.serviceType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
                : '';

            // Combine date and time for start
            const startDateTime = appointment.preferredDate && appointment.preferredTime
                ? `${appointment.preferredDate}T${appointment.preferredTime}:00`
                : null;

            // Calculate end time (add 1 hour by default)
            let endDateTime = null;
            if (startDateTime) {
                const start = new Date(startDateTime);
                const end = new Date(start.getTime() + 60 * 60 * 1000); // Add 1 hour
                endDateTime = end.toISOString().slice(0, 19);
            }

            // Determine status color
            let backgroundColor, borderColor;
            const status = appointment.status ? appointment.status.toLowerCase() : 'pending';

            if (status === 'approved' || status === 'confirmed') {
                backgroundColor = '#10b981';
                borderColor = '#10b981';
            } else if (status === 'pending') {
                backgroundColor = '#f59e0b';
                borderColor = '#f59e0b';
            } else if (status === 'cancelled') {
                backgroundColor = '#ef4444';
                borderColor = '#ef4444';
            } else {
                backgroundColor = '#6c757d';
                borderColor = '#6c757d';
            }

            return {
                id: appointment._id,
                title: '', // Empty title - only avatar will show
                start: startDateTime,
                end: endDateTime,
                backgroundColor: 'transparent',
                borderColor: 'transparent',
                extendedProps: {
                    client: fullName,
                    initials: initials,
                    service: `${serviceCategory}${serviceType ? ' (' + serviceType + ')' : ''}`,
                    status: appointment.status || 'Pending',
                    phone: appointment.contactNumber || 'N/A',
                    email: appointment.email || 'N/A',
                    notes: appointment.specialNotes || 'No special notes',
                    adminNotes: appointment.adminNotes || 'No admin notes'
                }
            };
        }).filter(event => event.start); // Only include events with valid dates
    }

    // Update statistics cards
    function updateStatistics(appointments) {
        const total = appointments.length;
        const confirmed = appointments.filter(a => a.status && (a.status.toLowerCase() === 'approved' || a.status.toLowerCase() === 'confirmed')).length;
        const pending = appointments.filter(a => a.status && a.status.toLowerCase() === 'pending').length;
        const cancelled = appointments.filter(a => a.status && a.status.toLowerCase() === 'cancelled').length;

        const statsCards = document.querySelectorAll('.card-body h3');
        if (statsCards.length >= 4) {
            statsCards[0].textContent = total;
            statsCards[1].textContent = confirmed;
            statsCards[2].textContent = pending;
            statsCards[3].textContent = cancelled;
        }
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
                    </td>`;
                    day++;
                }
            }
            html += '</tr>';
            if (day > daysInMonth) break;
        }
        return html;
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
            const initials = event.extendedProps.initials || 'NA';
            const service = event.extendedProps.service || 'N/A';
            const status = event.extendedProps.status || 'N/A';
            const phone = event.extendedProps.phone || 'N/A';
            const email = event.extendedProps.email || 'N/A';
            const notes = event.extendedProps.notes || 'No additional notes';
            const adminNotes = event.extendedProps.adminNotes || 'No admin notes';

            modalBody.innerHTML = `
                <div class="row">
                    <div class="col-md-12">
                        <div class="d-flex align-items-center mb-3">
                            <div style="background: linear-gradient(135deg, rgba(54, 145, 191, 0.1) 0%, rgba(50, 85, 150, 0.1) 100%); 
                                        backdrop-filter: blur(10px) saturate(180%); 
                                        -webkit-backdrop-filter: blur(10px) saturate(180%); 
                                        border: 1px solid rgba(54, 145, 191, 0.4); 
                                        box-shadow: 0 4px 12px rgba(22, 56, 86, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3); 
                                        color: white; 
                                        display: flex; 
                                        align-items: center; 
                                        justify-content: center; 
                                        border-radius: 50%; 
                                        width: 48px; 
                                        height: 48px; 
                                        font-weight: 600; 
                                        font-size: 18px; 
                                        margin-right: 15px;">
                                ${initials}
                            </div>
                            <div>
                                <h5 class="mb-0">${client}</h5>
                                <small class="text-muted">${email}</small>
                            </div>
                        </div>
                        <hr />
                        <h6 class="mb-3">Contact Information</h6>
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
                        <h6 class="mb-3">Notes</h6>
                        <div class="alert alert-secondary mb-2">
                            <small class="text-muted d-block mb-1"><i class="bx bx-note"></i> Client Notes</small>
                            <p class="mb-0">${notes}</p>
                        </div>
                        <div class="alert alert-info mb-0">
                            <small class="text-muted d-block mb-1"><i class="bx bx-user-circle"></i> Admin Notes</small>
                            <p class="mb-0">${adminNotes}</p>
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
            case 'approved':
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
            // TODO: Implement search filtering
            console.log('Search term:', searchTerm);
        });
    }

    // Update copyright year
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
});
