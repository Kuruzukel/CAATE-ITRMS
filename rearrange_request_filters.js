const fs = require('fs');

const filePath = 'admin/src/pages/requests.html';
let content = fs.readFileSync(filePath, 'utf8');

// Define the new filter bar structure
const newFilterBar = `                                            <div class="card card-body bg-light">
                                                <div class="row g-3">
                                                    <div class="col-md-3">
                                                        <label class="form-label">Search</label>
                                                        <input type="text" class="form-control"
                                                            placeholder="Name or Email">
                                                    </div>
                                                    <div class="col-md-2">
                                                        <label class="form-label">Service Category</label>
                                                        <select class="form-select" id="filterServiceCategory">
                                                            <option value="">All Categories</option>
                                                            <option value="skincare">Skin Care</option>
                                                            <option value="haircare">Hair Care</option>
                                                            <option value="nailcare">Nail Care</option>
                                                            <option value="bodytreatment">Body Treatment</option>
                                                            <option value="aesthetic">Aesthetic Services</option>
                                                        </select>
                                                    </div>
                                                    <div class="col-md-2">
                                                        <label class="form-label">Service Type</label>
                                                        <select class="form-select" id="filterServiceType">
                                                            <option value="">All Service Types</option>
                                                        </select>
                                                    </div>
                                                    <div class="col-md-2">
                                                        <label class="form-label">Registration Type</label>
                                                        <select class="form-select">
                                                            <option value="">All Types</option>
                                                            <option value="online">Online</option>
                                                            <option value="walk-in">Walk-In</option>
                                                        </select>
                                                    </div>
                                                    <div class="col-md-2">
                                                        <label class="form-label">Status</label>
                                                        <select class="form-select">
                                                            <option value="">All Status</option>
                                                            <option value="pending">Pending</option>
                                                            <option value="confirmed">Confirmed</option>
                                                            <option value="cancelled">Cancelled</option>
                                                        </select>
                                                    </div>
                                                    <div class="col-md-2">
                                                        <label class="form-label">Date</label>
                                                        <input type="date" class="form-control" id="requestDateFilter"
                                                            style="color-scheme: dark;">
                                                    </div>
                                                    <div class="col-md-1 d-flex align-items-end">
                                                        <button type="button" class="btn btn-outline-secondary w-100">
                                                            <i class="bx bx-reset"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>`;

// Find the filter bar section
const startMarker = '<div class="card card-body bg-light">';
const endMarker = '</div>\n                                        </div>\n                                        <div class="table-responsive';

const startIndex = content.indexOf(startMarker, content.indexOf('<!-- Filter Panel -->'));
const endIndex = content.indexOf(endMarker, startIndex);

if (startIndex !== -1 && endIndex !== -1) {
    const before = content.substring(0, startIndex);
    const after = content.substring(endIndex);
    content = before + newFilterBar + '\n                                        ' + after.substring(endMarker.indexOf('</div>'));

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Successfully rearranged filters in requests.html');
} else {
    console.log('Could not find the filter bar section');
    console.log('startIndex:', startIndex);
    console.log('endIndex:', endIndex);
}
