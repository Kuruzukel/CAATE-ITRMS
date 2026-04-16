document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("formAuthentication");

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const submitBtn = form.querySelector('button[type="submit"]');

        // Disable button
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";

        try {
            const response = await fetch(
                "http://localhost/CAATE-ITRMS/backend/public/api/v1/auth/forgot-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email }),
                },
            );

            const data = await response.json();

            if (data.success) {
                // Show success message
                alert(
                    "If an account exists with this email, a password reset link has been sent.",
                );
                // Redirect to login
                window.location.href = "login.html";
            } else {
                alert(data.error || "An error occurred");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = "Send Reset Link";
        }
    });
});
