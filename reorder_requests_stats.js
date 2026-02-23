const fs = require('fs');

const filePath = 'admin/src/pages/requests.html';
let content = fs.readFileSync(filePath, 'utf8');

// Find the Pending card
const pendingCardStart = content.indexOf('<div class="col-lg-3 col-md-6 col-6 mb-4">\n                                <div class="card">\n                                    <div class="card-body">\n                                        <div class="card-title d-flex align-items-start justify-content-between">\n                                            <div class="avatar flex-shrink-0">\n                                                <i class="bx bx-time-five"');

// Find the Confirmed card
const confirmedCardStart = content.indexOf('<div class="col-lg-3 col-md-6 col-6 mb-4">\n                                <div class="card">\n                                    <div class="card-body">\n                                        <div class="card-title d-flex align-items-start justify-content-between">\n                                            <div class="avatar flex-shrink-0">\n                                                <i class="bx bx-check-circle"');

if (pendingCardStart !== -1 && confirmedCardStart !== -1 && pendingCardStart < confirmedCardStart) {
    // Extract the Pending card
    const pendingCardEnd = content.indexOf('</div>\n                            </div>', pendingCardStart) + '</div>\n                            </div>'.length;
    const pendingCard = content.substring(pendingCardStart, pendingCardEnd);

    // Extract the Confirmed card
    const confirmedCardEnd = content.indexOf('</div>\n                            </div>', confirmedCardStart) + '</div>\n                            </div>'.length;
    const confirmedCard = content.substring(confirmedCardStart, confirmedCardEnd);

    // Remove both cards
    const beforePending = content.substring(0, pendingCardStart);
    const betweenCards = content.substring(pendingCardEnd, confirmedCardStart);
    const afterConfirmed = content.substring(confirmedCardEnd);

    // Reconstruct with swapped order
    content = beforePending + confirmedCard + betweenCards + pendingCard + afterConfirmed;

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Successfully reordered statistics cards in requests.html');
} else {
    console.log('Could not find the cards to swap');
}
