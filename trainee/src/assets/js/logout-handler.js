// Logout Handler with Notification
async function handleLogout(event) {
    if (event) {
        event.preventDefault();
    }

    // Add logout notification
    if (window.notificationManager) {
        await window.notificationManager.notifyLogout();
    }

    // Clear session
    sessionStorage.removeItem('loginNotified');

    // Small delay to ensure notification is saved
    setTimeout(() => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '../../../auth/src/pages/login.html';
    }, 500);
}

// Attach to all logout links
document.addEventListener('DOMContentLoaded', function () {
    const logoutLinks = document.querySelectorAll('a[href*="login.html"]');
    logoutLinks.forEach(link => {
        // Only attach to logout links (those with power-off icon or "Log Out" text)
        const hasLogoutIcon = link.querySelector('.bx-power-off');
        const hasLogoutText = link.textContent.includes('Log Out');

        if (hasLogoutIcon || hasLogoutText) {
            link.addEventListener('click', handleLogout);
        }
    });
});
