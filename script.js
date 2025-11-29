// Smooth scroll and active nav handling
(function () {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelectorAll('.nav a[href^="#"]');
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
