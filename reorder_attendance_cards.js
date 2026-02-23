const fs = require('fs');

const filePath = 'admin/src/pages/attendance.html';
let content = fs.readFileSync(filePath, 'utf8');

// Find the statistics cards section and reorder them
const oldPattern = /<!-- Attendance Statistics Cards -->[\s\S]*?<\/div>\s*<\/div>\s*\n\s*<!-- Attendance Table -->/;

const newCards = `<!-- Attendance Statistics Cards -->
                        <div class="row">
                            <div class="col-lg-3 col-md-6 col-6 mb-4">
                                <div class="card">
                                    <div class="card-body">
                                        <div class="card-title d-flex align-items-start justify-content-between">
                                            <div class="avatar flex-shrink-0">
                                                <i class="bx bx-bar-chart-alt-2"
                                                    style="font-size: 2rem; color: #3b82f6;"></i>
                                            </div>
                                        </div>
                                        <span class="fw-semibold d-block mb-1">Attendance Rate</span>
                                        <h3 class="card-title mb-2">92.4%</h3>
                                        <small class="text-success fw-semibold"><i class="bx bx-up-arrow-alt"></i>
                                            +3.5%</small>
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
                                        <span class="fw-semibold d-block mb-1">Present Today</span>
                                        <h3 class="card-title mb-2">342</h3>
                                        <small class="text-success fw-semibold"><i class="bx bx-up-arrow-alt"></i>
                                            +5.2%</small>
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
                                        <span class="fw-semibold d-block mb-1">Absent Today</span>
                                        <h3 class="card-title mb-2">28</h3>
                                        <small class="text-danger fw-semibold"><i class="bx bx-down-arrow-alt"></i>
                                            -2.1%</small>
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
                                        <span class="d-block mb-1">Late Today</span>
                                        <h3 class="card-title text-nowrap mb-2">15</h3>
                                        <small class="text-warning fw-semibold"><i class="bx bx-right-arrow-alt"></i>
                                            Monitor</small>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Attendance Table -->`;

if (oldPattern.test(content)) {
    content = content.replace(oldPattern, newCards);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Successfully reordered attendance cards - Attendance Rate is now first');
} else {
    console.log('Pattern not found in attendance.html');
}
