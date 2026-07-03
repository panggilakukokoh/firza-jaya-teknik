/* ==========================================================
   PT. FIRZA JAYA TEKNIK – Main JavaScript
   Version: 1.0.0
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------
     1. STICKY NAVBAR – Add 'scrolled' class on scroll
  -------------------------------------------------------- */
  const navbar = document.getElementById('navbar');

  const handleNavbarScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // run once on load


  /* --------------------------------------------------------
     2. HAMBURGER / MOBILE MENU TOGGLE
  -------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
  });

  // Close mobile menu when a link is clicked
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    });
  });


  /* --------------------------------------------------------
     3. SMOOTH SCROLL – Active nav link highlight
  -------------------------------------------------------- */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link[data-section]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  }, {
    rootMargin: `-${parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-h')) + 20}px 0px -60% 0px`,
    threshold: 0,
  });

  sections.forEach(sec => observer.observe(sec));


  /* --------------------------------------------------------
     4. SCROLL REVEAL ANIMATION
  -------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObserver.observe(el));


  /* --------------------------------------------------------
     5. ANIMATED COUNTER (Hero Stats)
  -------------------------------------------------------- */
  const counters = document.querySelectorAll('.stat-number[data-target]');
  let countersStarted = false;

  const startCounters = () => {
    if (countersStarted) return;
    countersStarted = true;

    counters.forEach(counter => {
      const target = parseInt(counter.dataset.target, 10);
      const duration = 1800;
      const step = Math.ceil(target / (duration / 16));
      let current = 0;

      const tick = () => {
        current = Math.min(current + step, target);
        counter.textContent = current;
        if (current < target) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  };

  // Start counter when hero stats come into view
  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        startCounters();
        statsObserver.disconnect();
      }
    }, { threshold: 0.5 });
    statsObserver.observe(heroStats);
  }


  /* --------------------------------------------------------
     6. PORTFOLIO FILTER
  -------------------------------------------------------- */
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item[data-category]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active state
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Filter items with animation
      portfolioItems.forEach(item => {
        const match = filter === 'all' || item.dataset.category === filter;
        if (match) {
          item.classList.remove('hidden');
          item.style.animation = 'fadeSlide 0.4s ease forwards';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });


  /* --------------------------------------------------------
     7. TESTIMONIAL SLIDER
  -------------------------------------------------------- */
  const cards      = document.querySelectorAll('.testimonial-card');
  const dots       = document.querySelectorAll('.testi-dot');
  let currentTesti = 0;
  let testiTimer;

  const showTesti = (index) => {
    cards.forEach((c, i) => c.classList.toggle('active', i === index));
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
    currentTesti = index;
  };

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      clearInterval(testiTimer);
      showTesti(parseInt(dot.dataset.index, 10));
      startTestiTimer();
    });
  });

  const startTestiTimer = () => {
    testiTimer = setInterval(() => {
      showTesti((currentTesti + 1) % cards.length);
    }, 5000);
  };
  startTestiTimer();


  /* --------------------------------------------------------
     8. CONTACT FORM VALIDATION & SUBMIT
  -------------------------------------------------------- */
  const contactForm    = document.getElementById('contact-form');
  const formSuccess    = document.getElementById('form-success');
  const submitBtn      = document.getElementById('submit-form-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let valid = true;

      // Validate Name
      const nameInput = document.getElementById('contact-name');
      const fgName    = document.getElementById('fg-name');
      const errName   = document.getElementById('err-name');
      if (!nameInput.value.trim()) {
        fgName.classList.add('error');
        errName.textContent = 'Nama lengkap wajib diisi.';
        errName.style.display = 'block';
        valid = false;
      } else {
        fgName.classList.remove('error');
        errName.style.display = 'none';
      }

      // Validate Email
      const emailInput = document.getElementById('contact-email');
      const fgEmail    = document.getElementById('fg-email');
      const errEmail   = document.getElementById('err-email');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        fgEmail.classList.add('error');
        errEmail.textContent = 'Masukkan alamat email yang valid.';
        errEmail.style.display = 'block';
        valid = false;
      } else {
        fgEmail.classList.remove('error');
        errEmail.style.display = 'none';
      }

      // Validate Message
      const msgInput  = document.getElementById('contact-message');
      const fgMsg     = document.getElementById('fg-message');
      const errMsg    = document.getElementById('err-message');
      if (!msgInput.value.trim() || msgInput.value.trim().length < 10) {
        fgMsg.classList.add('error');
        errMsg.textContent = 'Pesan minimal 10 karakter.';
        errMsg.style.display = 'block';
        valid = false;
      } else {
        fgMsg.classList.remove('error');
        errMsg.style.display = 'none';
      }

      if (!valid) return;

      // Simulate form submit with loading state
      const btnText = submitBtn.querySelector('.btn-text');
      btnText.textContent = 'Mengirim...';
      submitBtn.disabled = true;

      setTimeout(() => {
        // Show success message
        formSuccess.classList.add('show');
        submitBtn.querySelector('.btn-text').textContent = 'Kirim Pesan';
        submitBtn.disabled = false;
        contactForm.reset();

        // Auto hide after 6s
        setTimeout(() => formSuccess.classList.remove('show'), 6000);
      }, 1500);
    });

    // Real-time clear error on input
    ['contact-name', 'contact-email', 'contact-message'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', function () {
        const fg = this.closest('.form-group');
        if (fg) {
          fg.classList.remove('error');
          const err = fg.querySelector('.form-error');
          if (err) err.style.display = 'none';
        }
      });
    });
  }


  /* --------------------------------------------------------
     9. SCROLL TO TOP BUTTON
  -------------------------------------------------------- */
  const scrollTopBtn = document.getElementById('scroll-top-btn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      scrollTopBtn.style.display = 'flex';
    } else {
      scrollTopBtn.style.display = 'none';
    }
  }, { passive: true });

  scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* --------------------------------------------------------
     10. FOOTER – Dynamic Year
  -------------------------------------------------------- */
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* --------------------------------------------------------
     11. SMOOTH SCROLL for anchor links
  -------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navbarHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-h')) || 80;
        const top = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 8;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* --------------------------------------------------------
     12. CLIENT MARQUEE – Pause on hover (already via CSS)
         Extra: keyboard accessible
  -------------------------------------------------------- */
  const marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) {
    marqueeTrack.addEventListener('focusin', () => {
      marqueeTrack.style.animationPlayState = 'paused';
    });
    marqueeTrack.addEventListener('focusout', () => {
      marqueeTrack.style.animationPlayState = 'running';
    });
  }


  /* --------------------------------------------------------
     13. PARALLAX – Hero image subtle parallax
  -------------------------------------------------------- */
  const heroImg = document.querySelector('.hero-img');
  if (heroImg) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      if (scrollTop < window.innerHeight) {
        heroImg.style.transform = `translateY(${scrollTop * 0.25}px)`;
      }
    }, { passive: true });
  }


  /* --------------------------------------------------------
     14. RENTAL – Equipment card tilt effect on mouse move
  -------------------------------------------------------- */
  const equipmentCards = document.querySelectorAll('.equipment-card');
  equipmentCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -10;
      card.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${y}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });


  /* --------------------------------------------------------
     15. SERVICE CARD – Hover icon glow
  -------------------------------------------------------- */
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.setProperty('--card-glow', 'rgba(249,115,22,0.15)');
    });
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--card-glow', 'transparent');
    });
  });

}); // end DOMContentLoaded
