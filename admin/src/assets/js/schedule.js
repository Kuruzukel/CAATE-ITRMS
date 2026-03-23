document.addEventListener('DOMContentLoaded', function () {


    let calendar = null;

    function updateStatusCounts(calendarInstance) {
        if (!calendarInstance) return;
        const dayCells = document.querySelectorAll('.fc-daygrid-day');
        dayCells.forEach(cell => {
            const dateStr = cell.getAttribute('data-date');
            if (!dateStr) return;

            const events = calendarInstance.getEvents().filter(event => {
                const eventDate = event.start.toISOString().split('T')[0];
                return eventDate === dateStr;
            });

            if (events.length === 0) return;

            let pendingCount = 0;
            let approvedCount = 0;
            let cancelledCount = 0;

            events.forEach(event => {
                const status = event.extendedProps.status ? event.extendedProps.status.toLowerCase() : '';
                if (status === 'pending') {
                    pendingCount++;
                } else if (status === 'approved' || status === 'confirmed') {
                    approvedCount++;
                } else if (status === 'cancelled') {
                    cancelledCount++;
                }
            });

            const eventsContainer = cell.querySelector('.fc-daygrid-day-events');
            if (!eventsContainer) return;

            eventsContainer.innerHTML = '';

            const statusHTML = [];

            if (pendingCount > 0) {
                statusHTML.push(`
                    <span class="status-indicator" data-date="${dateStr}" data-status="pending" style="display: inline-flex; align-items: center; margin: 2px 4px; font-size: 11px; font-weight: 600; cursor: pointer;">
                        <span style="width: 8px; height: 8px; border-radius: 50%; background: #f59e0b; margin-right: 3px;"></span>
                        <span style="color: #f59e0b;">${pendingCount}p</span>
                    </span>
                `);
            }

            if (approvedCount > 0) {
                statusHTML.push(`
                    <span class="status-indicator" data-date="${dateStr}" data-status="approved" style="display: inline-flex; align-items: center; margin: 2px 4px; font-size: 11px; font-weight: 600; cursor: pointer;">
                        <span style="width: 8px; height: 8px; border-radius: 50%; background: #10b981; margin-right: 3px;"></span>
                        <span style="color: #10b981;">${approvedCount}a</span>
                    </span>
                `);
            }

            if (cancelledCount > 0) {
                statusHTML.push(`
                    <span class="status-indicator" data-date="${dateStr}" data-status="cancelled" style="display: inline-flex; align-items: center; margin: 2px 4px; font-size: 11px; font-weight: 600; cursor: pointer;">
                        <span style="width: 8px; height: 8px; border-radius: 50%; background: #ef4444; margin-right: 3px;"></span>
                        <span style="color: #ef4444;">${cancelledCount}c</span>
                    </span>
                `);
            }

            eventsContainer.innerHTML = statusHTML.join('');
        });

        document.querySelectorAll('.status-indicator').forEach(indicator => {
            indicator.addEventListener('click', function (e) {
                e.stopPropagation();
                const date = this.getAttribute('data-date');
                const status = this.getAttribute('data-status');
                showAppointmentsByDateAndStatus(calendarInstance, date, status);
            });
        });
    }

    function updateAvatarAlignment() {
        const dayCells = document.querySelectorAll('.fc-daygrid-day-events');
        dayCells.forEach(cell => {
            const eventCount = cell.querySelectorAll('.fc-daygrid-event-harness').length;

            if (eventCount > 0 && eventCount <= 2) {
                cell.classList.add('center-avatars');
            } else {
                cell.classList.remove('center-avatars');
            }
        });
    }

    const calendarEl = document.getElementById('calendar');
    if (calendarEl) {

        calendarEl.innerHTML = '<div class="text-center p-4"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div><p class="mt-2">Loading calendar...</p></div>';

        setTimeout(async function () {
            try {

                if (typeof FullCalendar === 'undefined' || window.FullCalendarLoadFailed) {
                    console.error('FullCalendar library not loaded or failed to load');
                    createFallbackCalendar(calendarEl);
                    return;
                }

                const appointments = await fetchAppointments();

                calendar = new FullCalendar.Calendar(calendarEl, {
                    initialView: 'dayGridMonth',
                    headerToolbar: {
                        left: 'prev',
                        center: 'title',
                        right: 'next'
                    },
                    height: 'auto',
                    dayMaxEvents: false,
                    displayEventTime: true,
                    displayEventEnd: false,
                    events: function (info, successCallback, failureCallback) {

                        fetchAppointments().then(appointments => {
                            const events = convertToCalendarEvents(appointments);
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

                    },
                    eventDidMount: function (info) {

                        const view = calendar.view.type;
                        if (view === 'dayGridMonth') {
                            info.el.style.display = 'none';
                        }

                    },
                    viewDidMount: function () {

                        const view = calendar.view.type;
                        if (view === 'dayGridMonth') {
                            setTimeout(() => updateStatusCounts(calendar), 100);
                        }
                    },
                    datesSet: function () {

                        const view = calendar.view.type;
                        if (view === 'dayGridMonth') {
                            setTimeout(() => updateStatusCounts(calendar), 100);
                        }
                    },
                    eventsSet: function () {

                        const view = calendar.view.type;
                        if (view === 'dayGridMonth') {
                            setTimeout(() => updateStatusCounts(calendar), 100);
                        }
                    }
                });

                calendar.render();

                updateStatistics(appointments);
            } catch (error) {
                console.error('Error initializing calendar:', error);
                createFallbackCalendar(calendarEl);
            }
        }, 1000);
    }

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

    function convertToCalendarEvents(appointments) {
        return appointments.map(appointment => {

            const fullName = [
                appointment.firstName,
                appointment.secondName,
                appointment.middleName,
                appointment.lastName,
                appointment.suffix
            ].filter(Boolean).join(' ');

            const firstName = appointment.firstName || '';
            const lastName = appointment.lastName || '';
            const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || 'NA';

            const categoryMap = {
                'skincare': 'Skin Care',
                'haircare': 'Hair Care',
                'nailcare': 'Nail Care',
                'bodytreatment': 'Body Treatment',
                'aesthetic': 'Aesthetic Services'
            };
            const serviceCategory = categoryMap[appointment.serviceCategory] || appointment.serviceCategory || '';

            const serviceType = appointment.serviceType
                ? appointment.serviceType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
                : '';

            const startDateTime = appointment.preferredDate && appointment.preferredTime
                ? `${appointment.preferredDate}T${appointment.preferredTime}:00`
                : null;

            let endDateTime = null;
            if (startDateTime) {
                const start = new Date(startDateTime);
                const end = new Date(start.getTime() + 60 * 60 * 1000);
                endDateTime = end.toISOString().slice(0, 19);
            }

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
                title: fullName,
                start: startDateTime,
                end: endDateTime,
                backgroundColor: backgroundColor,
                borderColor: borderColor,
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
        }).filter(event => event.start);
    }

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

    function getMonthName(month) {
        const months = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        return months[month];
    }

    function showAppointmentsByDateAndStatus(calendarInstance, date, status) {
        if (!calendarInstance) return;

        const events = calendarInstance.getEvents().filter(event => {
            const eventDate = event.start.toISOString().split('T')[0];
            const eventStatus = event.extendedProps.status ? event.extendedProps.status.toLowerCase() : '';

            let statusMatch = false;
            if (status === 'approved') {
                statusMatch = eventStatus === 'approved' || eventStatus === 'confirmed';
            } else {
                statusMatch = eventStatus === status;
            }

            return eventDate === date && statusMatch;
        });

        if (events.length === 0) return;

        const modal = document.getElementById('appointmentModal');
        const modalTitle = document.getElementById('appointmentModalTitle');
        const modalBody = document.getElementById('appointmentModalBody');

        if (modal && modalTitle && modalBody) {

            const dateObj = new Date(date + 'T00:00:00');
            const formattedDate = dateObj.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);
            modalTitle.textContent = `${statusLabel} Appointments - ${formattedDate}`;

            let appointmentsHTML = '<div class="list-group">';

            events.forEach(event => {
                const client = event.extendedProps.client || 'N/A';
                const initials = event.extendedProps.initials || 'NA';
                const service = event.extendedProps.service || 'N/A';
                const eventStatus = event.extendedProps.status || 'N/A';
                const phone = event.extendedProps.phone || 'N/A';
                const email = event.extendedProps.email || 'N/A';
                const startTime = event.start.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                });

                appointmentsHTML += `
                    <div class="list-group-item list-group-item-action" data-event-id="${event.id}">
                        <div class="d-flex align-items-center">
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
                                        width: 40px; 
                                        height: 40px; 
                                        font-weight: 600; 
                                        font-size: 14px; 
                                        margin-right: 12px;
                                        flex-shrink: 0;">
                                ${initials}
                            </div>
                            <div class="flex-grow-1">
                                <div class="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h6 class="mb-1">${client}</h6>
                                        <small class="text-muted"><i class="bx bx-time"></i> ${startTime} | ${service}</small>
                                    </div>
                                    <span class="badge bg-${getStatusColor(eventStatus)}">${eventStatus}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });

            appointmentsHTML += '</div>';
            modalBody.innerHTML = appointmentsHTML;

            setTimeout(() => {
                document.querySelectorAll('[data-event-id]').forEach(item => {
                    item.addEventListener('click', function () {
                        const eventId = this.getAttribute('data-event-id');
                        const event = calendarInstance.getEventById(eventId);
                        if (event) {

                            const currentModal = bootstrap.Modal.getInstance(modal);
                            if (currentModal) {
                                currentModal.hide();
                            }
                            setTimeout(() => showAppointmentDetails(event), 300);
                        }
                    });
                });
            }, 100);

            try {
                const bootstrapModal = new bootstrap.Modal(modal);
                bootstrapModal.show();
            } catch (error) {
                console.error('Error showing modal:', error);
                modal.style.display = 'block';
                modal.classList.add('show');
            }
        }
    }

    function showAppointmentsByStatus(calendarInstance, date, status) {
        if (!calendarInstance) return;

        const events = calendarInstance.getEvents().filter(event => {
            const eventDate = event.start.toISOString().split('T')[0];
            const eventStatus = event.extendedProps.status ? event.extendedProps.status.toLowerCase() : '';

            if (eventDate !== date) return false;

            if (status === 'pending' && eventStatus === 'pending') return true;
            if (status === 'approved' && (eventStatus === 'approved' || eventStatus === 'confirmed')) return true;
            if (status === 'cancelled' && eventStatus === 'cancelled') return true;

            return false;
        });

        if (events.length === 0) return;

        const modal = document.getElementById('appointmentModal');
        const modalTitle = document.getElementById('appointmentModalTitle');
        const modalBody = document.getElementById('appointmentModalBody');

        if (modal && modalTitle && modalBody) {

            const dateObj = new Date(date + 'T00:00:00');
            const formattedDate = dateObj.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            const statusDisplay = status.charAt(0).toUpperCase() + status.slice(1);

            modalTitle.textContent = `${statusDisplay} Appointments - ${formattedDate}`;

            let appointmentsHTML = '<div class="list-group">';

            events.forEach((event, index) => {
                const client = event.extendedProps.client || 'N/A';
                const initials = event.extendedProps.initials || 'NA';
                const service = event.extendedProps.service || 'N/A';
                const eventStatus = event.extendedProps.status || 'N/A';
                const phone = event.extendedProps.phone || 'N/A';
                const email = event.extendedProps.email || 'N/A';
                const time = event.start.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                });

                appointmentsHTML += `
                    <div class="list-group-item appointment-item" data-event-index="${index}">
                        <div class="d-flex align-items-center">
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
                                        width: 40px; 
                                        height: 40px; 
                                        font-weight: 600; 
                                        font-size: 14px; 
                                        margin-right: 12px;
                                        flex-shrink: 0;">
                                ${initials}
                            </div>
                            <div class="flex-grow-1">
                                <div class="d-flex justify-content-between align-items-start">
                                    <div>
                                        <h6 class="mb-1">${client}</h6>
                                        <small class="text-muted d-block">${service}</small>
                                        <small class="text-muted"><i class="bx bx-time"></i> ${time}</small>
                                    </div>
                                    <span class="badge bg-${getStatusColor(eventStatus)}">${eventStatus}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });

            appointmentsHTML += '</div>';
            modalBody.innerHTML = appointmentsHTML;

            setTimeout(() => {
                document.querySelectorAll('.appointment-item').forEach((item, index) => {
                    item.addEventListener('click', function () {
                        showAppointmentDetails(events[index]);
                    });
                });
            }, 100);

            try {
                const bootstrapModal = new bootstrap.Modal(modal);
                bootstrapModal.show();
            } catch (error) {
                console.error('Error showing modal:', error);
                modal.style.display = 'block';
                modal.classList.add('show');
            }
        }
    }

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

            try {
                const bootstrapModal = new bootstrap.Modal(modal);
                bootstrapModal.show();
            } catch (error) {
                console.error('Error showing modal:', error);

                modal.style.display = 'block';
                modal.classList.add('show');
            }
        }
    }

    function getStatusColor(status) {
        const statusLower = status ? status.toLowerCase() : '';
        switch (statusLower) {
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

    function getStatusColorHex(status) {
        const statusLower = status ? status.toLowerCase() : '';
        switch (statusLower) {
            case 'approved':
            case 'confirmed':
                return '#10b981';
            case 'pending':
                return '#f59e0b';
            case 'cancelled':
                return '#ef4444';
            default:
                return '#6c757d';
        }
    }

    const searchInput = document.getElementById('scheduleSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function (e) {
            const searchTerm = e.target.value.toLowerCase();

        });
    }

    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
});