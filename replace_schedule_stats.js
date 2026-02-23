const fs = require('fs');

const filePath = 'admin/src/pages/schedule.html';
let content = fs.readFileSync(filePath, 'utf8');

// The new statistics cards structure from requests.html
const newStats = `                        <!-- Appointment Statistics Cards -->
                        <div class="row">
                            <div class="col-lg-3 col-md-6 col-6 mb-4">
                                <div class="card">
                                    <div class="card-body">
                                        <div class="card-title d-flex align-items-start justify-content-between">
                                            <div class="avatar flex-shrink-0">
                                                <i class="bx bx-calendar" style="font-size: 2rem; color: #3691bf;"></i>
                                            </div>
                                        </div>
                                        <span class="fw-semibold d-block mb-1">Total Appointments</span>
                                        <h3 class="card-title mb-2">10</h3>
                                        <small class="fw-semibold" style="color: #3691bf;"><i
                                                class="bx bx-calendar-check"></i>
                                            All bookings</small>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-3 col-md-6 col-6 mb-4">
                                <div class="card">
                                    <div class="card-body">
                                        <div class="card-title d-flex align-items-start justify-content-between">
                                            <div class="avatar flex-shrink-0">
                                                <i class="bx bx-time-five" style="font-size: 2rem; color: #f59e0b;"></i>
                                            </div>
                                        </div>
                                        <span class="fw-semibold d-block mb-1">Pending</span>
                                        <h3 class="card-title mb-2">5</h3>
                                        <small class="text-warning fw-semibold"><i class="bx bx-right-arrow-alt"></i>
                                            Awaiting confirmation</small>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-3 col-md-6 col-6 mb-4">
                                <div class="card">
                                    <div class="card-body">
                                        <div class="card-title d-flex align-items-start justify-content-between">
                                            <div class="avatar flex-shrink-0">
                                                <i class="bx bx-check-circle"
                                                    style="font-size: 2rem; color: #10b981;"></i>
                                            </div>
                                        </div>
                                        <span class="fw-semibold d-block mb-1">Confirmed</span>
                                        <h3 class="card-title mb-2">4</h3>
                                        <small class="text-success fw-semibold"><i class="bx bx-up-arrow-alt"></i>
                                            Scheduled</small>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-3 col-md-6 col-6 mb-4">
                                <div class="card">
                                    <div class="card-body">
                                        <div class="card-title d-flex align-items-start justify-content-between">
                                            <div class="avatar flex-shrink-0">
                                                <i class="bx bx-x-circle" style="font-size: 2rem; color: #ef4444;"></i>
                                            </div>
                                        </div>
                                        <span class="fw-semibold d-block mb-1">Cancelled</span>
                                        <h3 class="card-title mb-2">1</h3>
                                        <small class="text-danger fw-semibold"><i class="bx bx-down-arrow-alt"></i>
                                            Not proceeding</small>
                                    </div>
                                </div>
                            </div>
                        </div>`;

// Find and replace the statistics section
const startMarker = '<!-- Appointment Statistics Cards -->';
const endMarker = '</div>\n\n                        <!-- Calendar Card -->';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker, startIndex);

if (startIndex !== -1 && endIndex !== -1) {
    const before = content.substring(0, startIndex);
    const after = content.substring(endIndex);
    content = before + newStats + '\n\n                        ' + after.substring(endMarker.indexOf('<!-- Calendar Card -->'));

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Successfully replaced statistics cards in schedule.html');
} else {
    console.log('Could not find the markers');
}
