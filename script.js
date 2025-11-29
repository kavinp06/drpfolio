// Smooth scroll and active nav handling
(function () {
  // Mark JS as enabled for CSS fallbacks
  const root = document.documentElement;
  root.classList.remove('no-js');
  root.classList.add('js');

  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelectorAll('.nav a[href^="#"]');
  const header = document.querySelector('.site-header');
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Mobile nav toggle
  if (toggle) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  // Close nav on link click (mobile)
  links.forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

  // IntersectionObserver to highlight current section
  const sections = [...document.querySelectorAll('main[id], section[id]')];
  const byId = Object.fromEntries(links.map(a => [a.getAttribute('href').slice(1), a]));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.getAttribute('id');
        Object.values(byId).forEach(a => a.classList.remove('active'));
        if (byId[id]) byId[id].classList.add('active');
      }
    });
  }, { rootMargin: '-50% 0px -45% 0px', threshold: 0.01 });

  sections.forEach(s => io.observe(s));

  // Scroll reveal animations
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = document.querySelectorAll('.reveal');
  if (prefersReduced) {
    reveals.forEach(el => el.classList.add('in'));
  } else if ('IntersectionObserver' in window) {
    const revealIO = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -15% 0px' });

    // Mark above-the-fold elements immediately
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const rootForRV = document.documentElement;
    reveals.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < vh * 0.7) {
        el.classList.add('in');
      } else {
        revealIO.observe(el);
      }
    });

    // Only now enable the CSS that hides not-yet-revealed elements
    rootForRV.classList.add('rv');
  } else {
    // Fallback: if IO unsupported
    reveals.forEach(el => el.classList.add('in'));
  }

  // Header depth on scroll
  if (header) {
    const applyHeaderDepth = () => {
      if (window.scrollY > 4) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    };
    window.addEventListener('scroll', applyHeaderDepth, { passive: true });
    applyHeaderDepth();
  }

  // Form handling (client-side only)
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (form) {
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      status.textContent = '';

      if (!form.checkValidity()) {
        status.textContent = 'Please fill all required fields correctly.';
        status.style.color = '#dc2626'; // red-600
        return;
      }

      const data = Object.fromEntries(new FormData(form).entries());
      // Placeholder: send via email client
      const body = encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || ''}\n\n${data.message}`);
      window.location.href = `mailto:doctor@example.com?subject=Website Inquiry&body=${body}`;

      status.textContent = 'Opening your email client...';
      status.style.color = '#16a34a'; // green-600
      form.reset();
    });
  }
})();
