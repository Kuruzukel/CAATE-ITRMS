// Demo Script for Testing Notifications
// This script simulates notifications for testing purposes

function addDemoNotifications() {
    if (!window.notificationManager) {
        console.error('Notification manager not initialized');
        return;
    }

    const nm = window.notificationManager;

    // Demo Registration Notifications
    nm.notifyRegistrationStatus({
        traineeName: 'John Doe',
        status: 'pending'
    });

    setTimeout(() => {
        nm.notifyRegistrationStatus({
            traineeName: 'Jane Smith',
            status: 'approved'
        });
    }, 2000);

    setTimeout(() => {
        nm.notifyRegistrationStatus({
            traineeName: 'Mike Johnson',
            status: 'cancelled'
        });
    }, 4000);

    // Demo Application Notifications
    setTimeout(() => {
        nm.notifyApplicationStatus({
            traineeName: 'Sarah Williams',
            status: 'pending'
        });
    }, 6000);

    setTimeout(() => {
        nm.notifyApplicationStatus({
            traineeName: 'David Brown',
            status: 'approved'
        });
    }, 8000);

    // Demo Admission Notifications
    setTimeout(() => {
        nm.notifyAdmissionStatus({
            traineeName: 'Emily Davis',
            status: 'approved'
        });
    }, 10000);

    setTimeout(() => {
        nm.notifyAdmissionStatus({
            traineeName: 'Robert Miller',
            status: 'pending'
        });
    }, 12000);

    // Demo Appointment Notifications
    setTimeout(() => {
        nm.notifyAppointmentStatus({
            traineeName: 'Lisa Anderson',
            status: 'pending'
        });
    }, 14000);

    setTimeout(() => {
        nm.notifyAppointmentStatus({
            traineeName: 'James Wilson',
            status: 'approved'
        });
    }, 16000);

    setTimeout(() => {
        nm.notifyAppointmentStatus({
            traineeName: 'Maria Garcia',
            status: 'cancelled'
        });
    }, 18000);

    console.log('Demo notifications will be added over the next 20 seconds');
}

// Add a button to trigger demo notifications (for testing)
document.addEventListener('DOMContentLoaded', function () {
    // Uncomment the line below to automatically add demo notifications on page load
    // setTimeout(addDemoNotifications, 2000);
});

// Make function globally available for console testing
window.addDemoNotifications = addDemoNotifications;
