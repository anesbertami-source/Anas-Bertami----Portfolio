const toggleBtn = document.getElementById('themeToggle');
const body = document.body;

if (localStorage.getItem('theme') === 'light') {
  body.classList.add('light');
  if (toggleBtn) toggleBtn.textContent = '☀️';
}

if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    body.classList.toggle('light');
    const isLight = body.classList.contains('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    toggleBtn.textContent = isLight ? '☀️' : '🌙';
  });
}

(function highlightNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });
}

const typedEl = document.getElementById('typed-text');
if (typedEl) {
  const phrases = [
    'Future Cybersecurity Specialist',
    'Network Security Enthusiast',
    'Ethical Hacker in Training',
    'CS Student @ Morocco',
  ];
  let pIdx = 0, cIdx = 0, deleting = false;

  function type() {
    const current = phrases[pIdx];
    if (!deleting) {
      typedEl.textContent = current.slice(0, ++cIdx);
      if (cIdx === current.length) {
        deleting = true;
        setTimeout(type, 1800);
        return;
      }
    } else {
      typedEl.textContent = current.slice(0, --cIdx);
      if (cIdx === 0) {
        deleting = false;
        pIdx = (pIdx + 1) % phrases.length;
      }
    }
    setTimeout(type, deleting ? 45 : 80);
  }

  setTimeout(type, 600);
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(fill => {
        const pct = fill.dataset.pct;
        fill.style.width = pct + '%';
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const skillsSection = document.querySelector('.skills-section');
if (skillsSection) skillObserver.observe(skillsSection);

const filterTabs = document.querySelectorAll('.filter-tab');
const projectCards = document.querySelectorAll('.project-card');

filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;

    projectCards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.style.display = 'flex';
        card.style.animation = 'fadeInUp 0.4s ease forwards';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector('button[type="submit"]');
    const msgEl = document.getElementById('formMsg');
    const originalText = btn.textContent;

    btn.textContent = 'Sending…';
    btn.disabled = true;

    const payload = {
      name:    contactForm.name.value.trim(),
      email:   contactForm.email.value.trim(),
      subject: contactForm.subject ? contactForm.subject.value.trim() : 'Portfolio Contact',
      message: contactForm.message.value.trim(),
    };

    try {
      const res = await fetch('../backend/send.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Server error');

      msgEl.textContent = '✓ Message sent! I\'ll get back to you soon.';
      msgEl.className = 'form-msg success';
      msgEl.style.display = 'block';
      contactForm.reset();
    } catch (err) {
      msgEl.textContent = '✕ Something went wrong. Please email me directly at anesbertami@gmail.com';
      msgEl.className = 'form-msg error';
      msgEl.style.display = 'block';
    }

    btn.textContent = originalText;
    btn.disabled = false;

    setTimeout(() => { msgEl.style.display = 'none'; }, 6000);
  });
}

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});