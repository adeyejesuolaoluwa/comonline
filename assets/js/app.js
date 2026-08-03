document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const themeToggle = document.getElementById('themeToggle');
  const searchToggle = document.getElementById('searchToggle');
  const search = document.getElementById('search');
  const searchClose = document.getElementById('searchClose');
  const searchInput = document.getElementById('searchInput');
  const progressBar = document.querySelector('.scroll-progress');
  const backToTop = document.getElementById('backToTop');
  const cursorGlow = document.querySelector('.cursor-glow');
  const revealItems = document.querySelectorAll('.reveal');
  const counters = document.querySelectorAll('.count');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const bookCards = document.querySelectorAll('.book-card');
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const testimonialPrev = document.getElementById('testimonialPrev');
  const testimonialNext = document.getElementById('testimonialNext');
  const countdown = document.getElementById('countdown');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = Number(entry.target.dataset.target || 0);
        let current = 0;
        const step = Math.max(1, Math.ceil(target / 70));
        const timer = window.setInterval(() => {
          current += step;
          if (current >= target) {
            entry.target.textContent = target;
            window.clearInterval(timer);
          } else {
            entry.target.textContent = current;
          }
        }, 18);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  counters.forEach((counter) => counterObserver.observe(counter));

  const updateProgress = () => {
    const percent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    if (progressBar) progressBar.style.width = `${Number.isFinite(percent) ? percent : 0}%`;
    backToTop?.classList.toggle('visible', window.scrollY > 480);
  };
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });

  menuToggle?.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    mobileMenu?.classList.toggle('hidden');
  });

  const currentTheme = localStorage.getItem('lwb_theme') || 'dark';
  if (currentTheme === 'light') body.classList.add('theme-light');
  themeToggle?.addEventListener('click', () => {
    const isLight = body.classList.toggle('theme-light');
    localStorage.setItem('lwb_theme', isLight ? 'light' : 'dark');
    themeToggle.setAttribute('aria-pressed', String(isLight));
  });

  const openSearch = () => {
    search?.removeAttribute('hidden');
    search?.setAttribute('aria-hidden', 'false');
    searchToggle?.setAttribute('aria-expanded', 'true');
    searchInput?.focus();
  };
  const closeSearch = () => {
    search?.setAttribute('hidden', '');
    search?.setAttribute('aria-hidden', 'true');
    searchToggle?.setAttribute('aria-expanded', 'false');
  };
  searchToggle?.addEventListener('click', () => {
    const open = searchToggle.getAttribute('aria-expanded') === 'true';
    if (open) closeSearch(); else openSearch();
  });
  searchClose?.addEventListener('click', closeSearch);
  document.addEventListener('keydown', (event) => {
    if (event.key === '/' && document.activeElement !== searchInput) {
      event.preventDefault();
      openSearch();
    }
    if (event.key === 'Escape') closeSearch();
  });

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      const filter = button.dataset.filter || 'all';
      bookCards.forEach((card) => {
        const matches = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('is-hidden', !matches);
      });
    });
  });

  let testimonialIndex = 0;
  const showTestimonial = (index) => {
    testimonialCards.forEach((card, idx) => card.classList.toggle('active', idx === index));
  };
  const cycleTestimonials = (direction = 1) => {
    testimonialIndex = (testimonialIndex + direction + testimonialCards.length) % testimonialCards.length;
    showTestimonial(testimonialIndex);
  };
  testimonialPrev?.addEventListener('click', () => cycleTestimonials(-1));
  testimonialNext?.addEventListener('click', () => cycleTestimonials(1));
  window.setInterval(() => cycleTestimonials(1), 7000);

  const eventDate = new Date('2026-09-14T19:00:00');
  const tickCountdown = () => {
    const diff = eventDate - new Date();
    if (diff <= 0) {
      countdown.textContent = 'Now live';
      return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    countdown.textContent = `${days}d ${hours}h ${minutes}m until the salon`;
  };
  tickCountdown();
  window.setInterval(tickCountdown, 60000);

  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  document.addEventListener('mousemove', (event) => {
    if (cursorGlow) {
      cursorGlow.style.left = `${event.clientX}px`;
      cursorGlow.style.top = `${event.clientY}px`;
    }
  });

  document.querySelectorAll('form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const button = form.querySelector('button');
      if (button) {
        button.textContent = 'Submitted';
        button.disabled = true;
      }
    });
  });
});
