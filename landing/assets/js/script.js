const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

const mobileMenuToggle = document.getElementById("mobileMenuToggle");
const mobileMenu = document.getElementById("mobileMenu");

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

document.addEventListener("click", (e) => {
  if (!mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
    mobileMenu.classList.remove("active");
    const icon = mobileMenuToggle.querySelector("i");
    icon.classList.remove("fa-times");
    icon.classList.add("fa-bars");
  }
});

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (scrollY >= sectionTop - 200) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

const carousel = document.getElementById("coursesCarousel");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const dots = document.querySelectorAll(".carousel-dot");

let currentIndex = 0;
const cardWidth = 350 + 24;
const cardsPerView =
  Math.floor(carousel.parentElement.clientWidth / cardWidth) || 1;
const maxIndex = Math.ceil(12 / cardsPerView) - 1;

function updateCarousel() {
  const scrollAmount = currentIndex * cardWidth * cardsPerView;
  carousel.scrollTo({
    left: scrollAmount,
    behavior: "smooth",
  });

  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentIndex);
  });
}

prevBtn.addEventListener("click", () => {
  currentIndex = Math.max(0, currentIndex - 1);
  updateCarousel();
});

nextBtn.addEventListener("click", () => {
  currentIndex = Math.min(maxIndex, currentIndex + 1);
  updateCarousel();
});

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    currentIndex = index;
    updateCarousel();
  });
});

let touchStartX = 0;
let touchEndX = 0;

carousel.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

carousel.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartX - touchEndX;

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      currentIndex = Math.min(maxIndex, currentIndex + 1);
    } else {
      currentIndex = Math.max(0, currentIndex - 1);
    }
    updateCarousel();
  }
}

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

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));

    if (target) {
      const headerOffset = 5;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  });
});

const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  const data = Object.fromEntries(formData);
  console.log("Form submitted:", data);
  alert("Thank you for your message! We will get back to you soon.");
  this.reset();
});

window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const orbs = document.querySelectorAll(".orb");

  orbs.forEach((orb, index) => {
    const speed = 0.1 + index * 0.05;
    orb.style.transform = `translateY(${scrolled * speed}px)`;
  });
});

const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.1,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
    }
  });
}, observerOptions);

revealElements.forEach((element) => {
  observer.observe(element);
});

function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);
  const suffix = element.textContent.includes("%") ? "%" : "+";

  function updateCounter() {
    start += increment;
    if (start < target) {
      element.textContent = Math.floor(start) + suffix;
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target + suffix;
    }
  }

  updateCounter();
}

const heroSection = document.querySelector(".hero");
let statsAnimated = false;

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;
        const statNumbers = document.querySelectorAll(".stat-number");
        statNumbers.forEach((stat) => {
          const text = stat.textContent;
          if (text.includes("+")) {
            const number = parseInt(text);
            stat.textContent = "0+";
            animateCounter(stat, number);
          } else if (text.includes("%")) {
            const number = parseInt(text);
            stat.textContent = "0%";
            animateCounter(stat, number);
          }
        });
      }
    });
  },
  { threshold: 0.5 },
);

statsObserver.observe(heroSection);

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    currentIndex = 0;
    updateCarousel();
  }, 250);
});
