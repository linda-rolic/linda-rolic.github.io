// Nav scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// Mobile hamburger
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Dynamic duration for blog dashboard project card
const durationEl = document.getElementById('blog-project-duration');
if (durationEl) {
  const start = new Date(2026, 0); // January 2026
  const now = new Date();
  const months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth()) + 1;
  durationEl.textContent = months <= 1 ? '1 Month' : `${months} Months`;
}

// Fade-in on scroll
const fadeEls = document.querySelectorAll(
  '.timeline-card, .stat-card, .skill-group, .cert-card, .edu-card, .hero-content, .about-text, .about-cards'
);

fadeEls.forEach(el => el.classList.add('fade-in'));

const observer = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.1 }
);

fadeEls.forEach(el => observer.observe(el));
