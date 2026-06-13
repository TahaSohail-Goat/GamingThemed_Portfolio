    // ===== PRELOADER =====
    window.addEventListener('load', () => {
      const preloader = document.getElementById('preloader');
      setTimeout(() => {
        preloader.classList.add('loaded');
        document.body.classList.add('loaded');
        // Trigger hero text split animation
        splitTextAnimate();
      }, 2400);
    });

    // ===== TEXT SPLIT ANIMATION =====
    function splitTextAnimate() {
      const heroTitle = document.querySelector('.glitch-text');
      if (!heroTitle || heroTitle.dataset.split) return;
      heroTitle.dataset.split = 'true';
      const text = heroTitle.textContent;
      heroTitle.innerHTML = '';
      // Remove pseudo-element glitch when split is active
      heroTitle.classList.add('split-active');
      [...text].forEach((char, i) => {
        const span = document.createElement('span');
        span.className = 'split-char';
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.animationDelay = `${2.6 + i * 0.04}s`;
        heroTitle.appendChild(span);
      });
    }

    // ===== SHARED MOUSE COORDINATES =====
    let mouseX = 0, mouseY = 0;

    // Single consolidated mousemove handler
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    // ===== CUSTOM CURSOR + SPOTLIGHT =====
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    const spotlight = document.getElementById('cursorSpotlight');
    let outlineX = 0, outlineY = 0;
    let spotX = 0, spotY = 0;

    function animateCursor() {
      outlineX += (mouseX - outlineX) * 0.15;
      outlineY += (mouseY - outlineY) * 0.15;
      spotX += (mouseX - spotX) * 0.06;
      spotY += (mouseY - spotY) * 0.06;
      cursorDot.style.transform = `translate3d(${mouseX - 4}px, ${mouseY - 4}px, 0)`;
      cursorOutline.style.transform = `translate3d(${outlineX - 20}px, ${outlineY - 20}px, 0)`;
      spotlight.style.transform = `translate3d(${spotX - 300}px, ${spotY - 300}px, 0)`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.querySelectorAll('a, button, .tilt-card, .magnetic-btn').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorDot.classList.add('cursor-hover');
        cursorOutline.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', () => {
        cursorDot.classList.remove('cursor-hover');
        cursorOutline.classList.remove('cursor-hover');
      });
    });

    // (Canvas particles removed — replaced by CSS starfield for better performance)

    // ===== TYPEWRITER EFFECT =====
    const typewriterEl = document.getElementById('typewriter');
    const words = ['Software Developer', 'C++ Expert', 'Python Developer', 'Web Developer', 'Problem Solver'];
    let wordIndex = 0, charIndex = 0, isDeleting = false;

    function typeWriter() {
      const current = words[wordIndex];
      typewriterEl.textContent = isDeleting
        ? current.substring(0, --charIndex)
        : current.substring(0, ++charIndex);
      let delay = isDeleting ? 40 : 80;
      if (!isDeleting && charIndex === current.length) { delay = 2200; isDeleting = true; }
      else if (isDeleting && charIndex === 0) { isDeleting = false; wordIndex = (wordIndex + 1) % words.length; delay = 400; }
      setTimeout(typeWriter, delay);
    }
    setTimeout(typeWriter, 3000);

    // ===== COUNTER ANIMATION =====
    function animateCounters() {
      document.querySelectorAll('[data-count]').forEach(counter => {
        if (counter.dataset.animated) return;
        counter.dataset.animated = 'true';
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const start = performance.now();
        function updateCounter(timestamp) {
          const progress = Math.min((timestamp - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 4);
          counter.textContent = Math.floor(target * eased);
          if (progress < 1) requestAnimationFrame(updateCounter);
        }
        requestAnimationFrame(updateCounter);
      });
    }

    // ===== SKILL BAR ANIMATION =====
    function animateSkillBars() {
      document.querySelectorAll('.skill-fill').forEach(bar => {
        if (bar.dataset.animated) return;
        bar.dataset.animated = 'true';
        const width = bar.getAttribute('data-width');
        bar.style.width = width + '%';
      });
    }

    // ===== SCROLL REVEAL =====
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute('data-delay') || 0;
          setTimeout(() => entry.target.classList.add('revealed'), parseInt(delay));
          if (entry.target.querySelector('[data-count]')) animateCounters();
          if (entry.target.querySelector('.skill-fill')) animateSkillBars();
          if (entry.target.closest('.about')) { animateCounters(); animateSkillBars(); }
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

    // ===== TEXT HIGHLIGHT ON SCROLL =====
    const textHighlightObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('text-visible');
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('.about-text p, .hero-description, .contact-header p').forEach(el => {
      el.classList.add('text-reveal-line');
      textHighlightObserver.observe(el);
    });

    // ===== 3D TILT CARDS WITH GLOSS =====
    if (window.innerWidth > 768) {
      document.querySelectorAll('.tilt-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width;
          const y = (e.clientY - rect.top) / rect.height;
          const rotateX = (y - 0.5) * -8;
          const rotateY = (x - 0.5) * 8;
          card.style.transition = 'transform 0.1s ease';
          card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`;
          card.style.setProperty('--gloss-x', `${x * 100}%`);
          card.style.setProperty('--gloss-y', `${y * 100}%`);
        });
        card.addEventListener('mouseleave', () => {
          card.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
          card.style.transform = '';
        });
      });
    }

    // ===== MAGNETIC BUTTONS =====
    if (window.innerWidth > 768) {
      document.querySelectorAll('.magnetic-btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          btn.style.transition = 'transform 0.15s ease';
          btn.style.transform = `translate3d(${x * 0.25}px, ${y * 0.25}px, 0)`;
        });
        btn.addEventListener('mouseleave', () => {
          btn.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
          btn.style.transform = '';
        });
      });
    }

    // ===== NAVBAR =====
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-menu ul li');
    const sections = document.querySelectorAll('section');
    let scrollTicking = false;

    window.addEventListener('scroll', () => {
      if (!scrollTicking) {
        requestAnimationFrame(() => {
          navbar.classList.toggle('scrolled', window.scrollY > 80);

          sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 150 && rect.bottom >= 150) {
              navLinks.forEach(li => li.classList.remove('active'));
              if (navLinks[index]) navLinks[index].classList.add('active');
            }
          });

          const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
          document.querySelector('.scroll-progress').style.width = scrollPercent + '%';

          document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 500);

          const homeImg = document.querySelector('.home-img');
          if (homeImg) homeImg.style.transform = `translate3d(0, ${window.scrollY * 0.12}px, 0)`;

          scrollTicking = false;
        });
        scrollTicking = true;
      }
    }, { passive: true });

    // Smooth scroll links — leverage native CSS scroll-behavior: smooth
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          // Use native scrollTo for smoother, more consistent scrolling
          const top = target.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top, behavior: 'smooth' });
          // Update URL hash without scrolling
          history.pushState(null, null, href);
          closeMobileMenu();
        }
      });
    });

    // ===== HAMBURGER MENU =====
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    function closeMobileMenu() {
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('active');
    }
    hamburger.addEventListener('click', () => {
      const isExpanded = hamburger.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
      mobileMenu.classList.toggle('active');
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && mobileMenu.classList.contains('active')) {
        closeMobileMenu();
      }
    });

    // ===== THEME TOGGLE =====
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.body.classList.add('light-mode');
      themeIcon.classList.replace('bx-moon', 'bx-sun');
    }
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      if (document.body.classList.contains('light-mode')) {
        themeIcon.classList.replace('bx-moon', 'bx-sun');
        localStorage.setItem('theme', 'light');
      } else {
        themeIcon.classList.replace('bx-sun', 'bx-moon');
        localStorage.setItem('theme', 'dark');
      }
    });

    // ===== FORM LABEL ANIMATION =====
    document.querySelectorAll('.input-group input, .input-group textarea').forEach(input => {
      input.addEventListener('focus', () => input.parentElement.classList.add('focused'));
      input.addEventListener('blur', () => { if (!input.value) input.parentElement.classList.remove('focused'); });
    });

    // ===== CONTACT FORM SUBMISSION =====
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    if (contactForm && formStatus) {
      contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (!contactForm.checkValidity()) {
          contactForm.reportValidity();
          formStatus.textContent = 'Please complete all required fields correctly.';
          formStatus.className = 'form-status error';
          return;
        }

        const formData = new FormData(contactForm);
        const submitButton = contactForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        formStatus.textContent = 'Sending your message...';
        formStatus.className = 'form-status';

        try {
          const response = await fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: {
              Accept: 'application/json'
            }
          });

          if (!response.ok) {
            throw new Error('Form submission failed');
          }

          formStatus.textContent = 'Thank you! Your message has been sent successfully.';
          formStatus.className = 'form-status success';
          contactForm.reset();
          contactForm.querySelectorAll('.input-group').forEach(group => group.classList.remove('focused'));
        } catch (error) {
          formStatus.textContent = 'Sorry, something went wrong. Please try again or contact me directly via WhatsApp.';
          formStatus.className = 'form-status error';
        } finally {
          submitButton.disabled = false;
        }
      });
    }

    // ===== PARALLAX SHAPES =====
    // (Removed — floating shapes replaced by CSS aurora globs)

    // ===== STAGGER NAV REVEAL =====
    navLinks.forEach((li, i) => {
      li.style.opacity = '0';
      li.style.transform = 'translateY(-15px)';
      setTimeout(() => {
        li.style.transition = 'all 0.5s ease';
        li.style.opacity = '1';
        li.style.transform = 'translateY(0)';
      }, 2600 + i * 100);
    });

    // ===== ANIMATED GRADIENT BORDERS =====
    if (window.innerWidth > 768) {
      document.querySelectorAll('.glass-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          card.style.setProperty('--mouse-x', `${x}px`);
          card.style.setProperty('--mouse-y', `${y}px`);
        }, { passive: true });
      });
    }
    
