// Navbar scroll effect
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});

// Mobile menu toggle
const mobileMenuToggle = document.getElementById("mobileMenuToggle");
const mobileMenu = document.getElementById("mobileMenu");

if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener("click", () => {
        mobileMenu.classList.toggle("active");
        const icon = mobileMenuToggle.querySelector("i");
        if (mobileMenu.classList.contains("active")) {
            icon.classList.remove("fa-bars");
            icon.classList.add("fa-times");
        } else {
            icon.classList.remove("fa-times");
            icon.classList.add("fa-bars");
        }
    });

    // Close mobile menu when clicking a link
    const mobileMenuLinks = mobileMenu.querySelectorAll(".nav-link");
    mobileMenuLinks.forEach((link) => {
        link.addEventListener("click", () => {
            mobileMenu.classList.remove("active");
            const icon = mobileMenuToggle.querySelector("i");
            icon.classList.remove("fa-times");
            icon.classList.add("fa-bars");
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
        if (!mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            mobileMenu.classList.remove("active");
            const icon = mobileMenuToggle.querySelector("i");
            icon.classList.remove("fa-times");
            icon.classList.add("fa-bars");
        }
    });

    // Reveal animations
    const revealElements = document.querySelectorAll(".reveal");

    function reveal() {
        revealElements.forEach((element) => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;
            const revealPoint = 150;

            if (elementTop < windowHeight - revealPoint) {
                element.classList.add("active");
            }
        });
    }

    window.addEventListener("scroll", reveal);
    reveal();

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            const href = this.getAttribute("href");

            if (!href || href === "#") {
                return;
            }

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth",
                });
            }
        });
    });

    // Page load animation
    window.addEventListener("load", () => {
        document.body.classList.add("loaded");
    });

}
