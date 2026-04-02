/* ═══════════════════════════════════════════
   PORTFOLIO SCRIPT — Pranay Saha
══════════════════════════════════════════ */

'use strict';

/* ── Theme toggle ────────────────────────── */
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;

// Persist theme preference
function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
}

// Initialise from storage or system preference
(function initTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) {
        applyTheme(saved);
    } else {
        // Default to dark; light only if system prefers it
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark ? 'dark' : 'light');
    }
})();

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const current = root.getAttribute('data-theme') || 'dark';
        applyTheme(current === 'dark' ? 'light' : 'dark');
    });
}

/* ── Navbar scroll behaviour ─────────────── */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);

    let current = '';
    sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });

    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ── Smooth click closes mobile menu ──────── */
document.querySelectorAll('.nav-link, .mob-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

/* ── Hamburger / Mobile Menu ─────────────── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

function closeMobileMenu() {
    menuOpen = false;
    mobileMenu.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => {
        s.style.transform = ''; s.style.opacity = '';
    });
}

hamburger.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    const [s0, s1, s2] = hamburger.querySelectorAll('span');
    if (menuOpen) {
        s0.style.transform = 'translateY(7px) rotate(45deg)';
        s1.style.opacity = '0';
        s2.style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
        closeMobileMenu();
    }
});

/* ── Intersection Observer — reveal & timeline ── */
const revealEls = document.querySelectorAll('.timeline-item');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const idx = parseInt(entry.target.dataset.index || 0, 10);
        setTimeout(() => entry.target.classList.add('visible'), idx * 150);
        observer.unobserve(entry.target);
    });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => observer.observe(el));

/* Reveal for non-timeline elements */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

[
    '.section-label', '.section-title', '.about-intro', '.info-card',
    '.skill-tag', '.blog-card', '.contact-title', '.contact-sub',
    '.email-cta', '.social-link', '.skills-section', '.blog-more'
].forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${i * 0.06}s`;
        revealObserver.observe(el);
    });
});

/* ── Emoji tilt on mouse-move ────────────── */
const emojiWrap = document.getElementById('heroEmoji');
if (emojiWrap) {
    document.addEventListener('mousemove', (e) => {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const rotateY = ((e.clientX - cx) / cx) * 10;
        const rotateX = -((e.clientY - cy) / cy) * 10;
        emojiWrap.style.transform =
            `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
    });
    document.addEventListener('mouseleave', () => {
        emojiWrap.style.transform = '';
    });
}

/* ── Contact modal ──────────────────────── */
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const contactForm = document.getElementById('contactForm');

function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
}

if (modalClose) modalClose.addEventListener('click', closeModal);
if (modalOverlay) modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('formName').value;
        const email = document.getElementById('formEmail').value;
        const msg = document.getElementById('formMsg').value;
        const sub = encodeURIComponent(`Portfolio Contact from ${name}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${msg}`);
        window.open(`mailto:pranaysaha61@gmail.com?subject=${sub}&body=${body}`, '_blank');
        closeModal();
        contactForm.reset();
    });
}

/* ── Cursor glow (desktop) ──────────────── */
if (window.matchMedia('(pointer: fine)').matches) {
    const cursor = document.createElement('div');
    cursor.style.cssText = `
    position: fixed; width: 320px; height: 320px; border-radius: 50%;
    background: radial-gradient(circle, rgba(74,142,245,0.06) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
    transition: left 0.12s ease, top 0.12s ease;
    transform: translate(-50%, -50%);
    top: 0; left: 0;
  `;
    document.body.appendChild(cursor);
    document.addEventListener('mousemove', e => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
}

/* ── Typewriter greeting ─────────────────── */
(function typewriter() {
    const el = document.querySelector('.hero-greeting');
    if (!el) return;
    const texts = [
        "Hey, I'm Pranay 👋",
        "Software Engineer 💻",
        "Building ML systems at scale 🏙️",
    ];
    let tIdx = 0, cIdx = 0, deleting = false;

    function tick() {
        const current = texts[tIdx];
        el.textContent = deleting ? current.slice(0, cIdx - 1) : current.slice(0, cIdx + 1);
        deleting ? cIdx-- : cIdx++;

        if (!deleting && cIdx === current.length) {
            deleting = true;
            setTimeout(tick, 2400);
            return;
        }
        if (deleting && cIdx === 0) {
            deleting = false;
            tIdx = (tIdx + 1) % texts.length;
        }
        setTimeout(tick, deleting ? 42 : 78);
    }

    setTimeout(tick, 1100);
})();

/* ── Watercolor blob pointer interaction ── */
// Gently nudge the largest blob toward the cursor for a living feel
const blob1 = document.querySelector('.wc-blob-1');
let bx = 0, by = 0, tx = 0, ty = 0;

if (blob1) {
    document.addEventListener('mousemove', e => {
        tx = (e.clientX / window.innerWidth - 0.5) * 40;
        ty = (e.clientY / window.innerHeight - 0.5) * 40;
    }, { passive: true });
}
