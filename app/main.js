/**
 * FRESHMAN.TV — MAIN SCRIPT
 * Dependencies: GSAP 3.x + ScrollTrigger (loaded via CDN in HTML)
 */

'use strict';

// ════════════════════════════════════════════════════════════
//  WAIT FOR GSAP
// ════════════════════════════════════════════════════════════
window.addEventListener('load', () => {
  if (typeof gsap === 'undefined') {
    console.warn('GSAP not loaded — animations disabled.');
    document.body.classList.remove('is-loading');
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  initApp();
});

// ════════════════════════════════════════════════════════════
//  APP ENTRY
// ════════════════════════════════════════════════════════════
function initApp() {
  initPreloader();
  initCursor();
  initHeader();
  initMobileMenu();
  initHeroVideo();
  initScrollAnimations();
  initDirectorsHover();
  initStatCounters();
}

// ════════════════════════════════════════════════════════════
//  HERO VIDEO
// ════════════════════════════════════════════════════════════
function initHeroVideo() {
  const heroVideo = document.querySelector('.hero__video');
  if (!heroVideo) return;

  heroVideo.playbackRate = 0.5;
}

// ════════════════════════════════════════════════════════════
//  PRELOADER
// ════════════════════════════════════════════════════════════
function initPreloader() {
  const preloader  = document.getElementById('preloader');
  const counter    = document.getElementById('counter');
  const bar        = document.getElementById('progressBar');

  if (!preloader) return;

  let count = 0;
  const totalMs = 2200;
  const stepMs  = totalMs / 100;

  const tick = setInterval(() => {
    count = Math.min(count + 1, 100);
    counter.textContent = count;
    bar.style.width = `${count}%`;

    if (count >= 100) {
      clearInterval(tick);
      revealSite();
    }
  }, stepMs);

  function revealSite() {
    const tl = gsap.timeline({
      onComplete: () => {
        preloader.style.display = 'none';
        document.body.classList.remove('is-loading');
        initHeroEntrance();
      },
    });

    tl.to('.preloader__inner', { opacity: 0, duration: 0.3, ease: 'power2.out' })
      .to('.preloader__brand', { opacity: 1, duration: 0.5, ease: 'power2.out' }, '<')
      .to('.preloader__brand', { opacity: 0, duration: 0.4, ease: 'power2.in' }, '+=0.4')
      .to(preloader, {
        yPercent: -100,
        duration: 1.1,
        ease: 'power4.inOut',
      }, '-=0.2');
  }
}

// ════════════════════════════════════════════════════════════
//  HERO ENTRANCE
// ════════════════════════════════════════════════════════════
function initHeroEntrance() {
  const inners   = document.querySelectorAll('.headline__inner');
  const eyebrow  = document.querySelector('.hero__eyebrow');
  const meta     = document.querySelector('.hero__meta');
  const scroll   = document.querySelector('.hero__scroll');
  const ticker   = document.querySelector('.hero__ticker');

  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  tl.from(inners, {
    yPercent: 110,
    duration: 1.3,
    stagger: 0.1,
  })
  .from([eyebrow, meta], {
    opacity: 0,
    y: 22,
    duration: 0.9,
    stagger: 0.1,
    ease: 'power2.out',
  }, '-=0.7')
  .from([scroll, ticker], {
    opacity: 0,
    y: 16,
    duration: 0.7,
    stagger: 0.08,
    ease: 'power2.out',
  }, '-=0.5');
}

// ════════════════════════════════════════════════════════════
//  CURSOR
// ════════════════════════════════════════════════════════════
function initCursor() {
  const cursor = document.getElementById('cursor');
  if (!cursor || window.innerWidth <= 1024) return;

  const dot  = cursor.querySelector('.cursor__dot');
  const ring = cursor.querySelector('.cursor__ring');

  let ringX = 0;
  let ringY = 0;
  let mouseX = 0;
  let mouseY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    gsap.set(dot, { x: mouseX, y: mouseY });
  });

  // Lag ring behind dot
  const animateRing = () => {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    gsap.set(ring, { x: ringX, y: ringY });
    requestAnimationFrame(animateRing);
  };
  animateRing();

  // Hover state
  const interactives = document.querySelectorAll('a, button, .work-card, .director__link');
  interactives.forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-hovering'));
  });

  document.addEventListener('mouseleave', () => cursor.classList.add('is-hidden'));
  document.addEventListener('mouseenter', () => cursor.classList.remove('is-hidden'));
}

// ════════════════════════════════════════════════════════════
//  HEADER — hide while scrolling, show when scrolling stops
// ════════════════════════════════════════════════════════════
function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  let lastY = window.scrollY;
  let revealTimer = null;

  window.addEventListener(
    'scroll',
    () => {
      const y = window.scrollY;
      const isVerticalScroll = Math.abs(y - lastY) > 1;

      if (isVerticalScroll && y > 8) {
        header.classList.add('is-hidden');
      } else if (y <= 8) {
        header.classList.remove('is-hidden');
      }

      window.clearTimeout(revealTimer);
      revealTimer = window.setTimeout(() => {
        header.classList.remove('is-hidden');
      }, 160);

      lastY = y;
    },
    { passive: true }
  );
}

// ════════════════════════════════════════════════════════════
//  MOBILE MENU
// ════════════════════════════════════════════════════════════
function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const menu   = document.getElementById('mobileMenu');
  if (!toggle || !menu) return;

  let isOpen = false;

  const open = () => {
    isOpen = true;
    menu.hidden = false;
    // Force reflow so transition fires
    menu.getBoundingClientRect();
    menu.removeAttribute('hidden');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    isOpen = false;
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    // Let CSS transition finish before hiding
    const onEnd = () => {
      if (!isOpen) {
        menu.setAttribute('hidden', '');
      }
      menu.removeEventListener('transitionend', onEnd);
    };
    menu.addEventListener('transitionend', onEnd);
    menu.setAttribute('hidden', '');
  };

  toggle.addEventListener('click', () => (isOpen ? close() : open()));

  menu.querySelectorAll('.mobile-nav__link').forEach((link) =>
    link.addEventListener('click', close)
  );

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) close();
  });
}

// ════════════════════════════════════════════════════════════
//  SCROLL ANIMATIONS
// ════════════════════════════════════════════════════════════
function initScrollAnimations() {
  // Work cards — staggered fade + slide
  gsap.from('.work-card', {
    scrollTrigger: {
      trigger: '#works .works__grid',
      start: 'top 82%',
    },
    opacity: 0,
    y: 60,
    duration: 0.9,
    stagger: 0.08,
    ease: 'power3.out',
  });

  // Manifesto quote
  splitReveal('.manifesto__quote', {
    scrollTrigger: {
      trigger: '#manifesto',
      start: 'top 75%',
    },
  });

  // Stats row
  gsap.from('.stat', {
    scrollTrigger: {
      trigger: '.manifesto__stats',
      start: 'top 88%',
    },
    opacity: 0,
    y: 30,
    duration: 0.7,
    stagger: 0.15,
    ease: 'power2.out',
  });

  // Director rows
  gsap.from('.director', {
    scrollTrigger: {
      trigger: '.directors__list',
      start: 'top 78%',
    },
    opacity: 0,
    x: -50,
    duration: 0.7,
    stagger: 0.1,
    ease: 'power2.out',
  });

  // About headline
  splitReveal('.about__headline', {
    scrollTrigger: {
      trigger: '#about',
      start: 'top 78%',
    },
  });

  // About body copy
  gsap.from('.about__text', {
    scrollTrigger: {
      trigger: '.about__text',
      start: 'top 85%',
    },
    opacity: 0,
    y: 20,
    duration: 0.8,
    ease: 'power2.out',
  });

  // Footer wordmark
  gsap.from('.footer__wordmark', {
    scrollTrigger: {
      trigger: '#contact',
      start: 'top 80%',
    },
    opacity: 0,
    y: 80,
    duration: 1.3,
    ease: 'power3.out',
  });

  // Footer email
  gsap.from('.footer__email', {
    scrollTrigger: {
      trigger: '.footer__contact',
      start: 'top 88%',
    },
    opacity: 0,
    y: 30,
    duration: 0.9,
    ease: 'power2.out',
  });
}

// ── Helper: reveal element with clip-path ─────────────────
function splitReveal(selector, gsapVars) {
  const el = document.querySelector(selector);
  if (!el) return;

  gsap.from(el, {
    opacity: 0,
    y: 45,
    duration: 1.1,
    ease: 'power3.out',
    ...gsapVars,
  });
}

// ════════════════════════════════════════════════════════════
//  DIRECTORS HOVER PREVIEW
// ════════════════════════════════════════════════════════════
function initDirectorsHover() {
  const preview   = document.getElementById('directorPreview');
  const directors = document.querySelectorAll('.director__link');

  if (!preview || !directors.length) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const colors = ['#1a1a1a', '#141414', '#0d0d0d', '#181818', '#111'];
  const inner  = preview.querySelector('.director-preview__inner');
  const image  = preview.querySelector('.director-preview__image');

  directors.forEach((link, i) => {
    link.addEventListener('pointerenter', () => {
      const previewSrc = link.dataset.previewSrc;
      inner.style.background = `linear-gradient(145deg, ${colors[i % colors.length]} 0%, #222 100%)`;

      if (image && previewSrc) {
        image.src = previewSrc;
        image.alt = link.textContent.trim();
        preview.classList.add('has-image');
      } else if (image) {
        image.removeAttribute('src');
        image.alt = '';
        preview.classList.remove('has-image');
      }

      preview.setAttribute('aria-hidden', 'false');
      preview.classList.add('is-visible');
    });
    link.addEventListener('pointerleave', () => {
      preview.classList.remove('is-visible');
      preview.classList.remove('has-image');
      preview.setAttribute('aria-hidden', 'true');
    });
  });

  // Follow cursor with slight lag via GSAP
  let previewX = 0;
  let previewY = 0;
  let mouseX   = 0;
  let mouseY   = 0;

  document.addEventListener('pointermove', (e) => {
    mouseX = e.clientX + 28;
    mouseY = e.clientY - preview.offsetHeight / 2;
  });

  const followMouse = () => {
    previewX += (mouseX - previewX) * 0.1;
    previewY += (mouseY - previewY) * 0.1;
    gsap.set(preview, { x: previewX, y: previewY });
    requestAnimationFrame(followMouse);
  };
  followMouse();
}

// ════════════════════════════════════════════════════════════
//  STAT COUNTERS (animate numbers when in view)
// ════════════════════════════════════════════════════════════
function initStatCounters() {
  const statNumbers = document.querySelectorAll('.stat__number[data-target]');

  statNumbers.forEach((el) => {
    const target = parseInt(el.dataset.target, 10);

    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to(
          { val: 0 },
          {
            val: target,
            duration: 1.8,
            ease: 'power2.out',
            onUpdate() {
              el.textContent = Math.round(this.targets()[0].val);
            },
          }
        );
      },
    });
  });
}
