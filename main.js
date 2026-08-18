document.addEventListener('DOMContentLoaded', () => {
  
  /* ==========================================================================
     STICKY HEADER & ACTIVE LINK ON SCROLL
     ========================================================================== */
  const header = document.querySelector('.main-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  const handleScroll = () => {
    // Toggle header background on scroll
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Highlight active nav link
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 120; // offset to match scroll padding

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll);
  // Run once on load to set initial state
  handleScroll();


  /* ==========================================================================
     MOBILE NAVIGATION MENU
     ========================================================================== */
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  const toggleMobileNav = () => {
    mobileNavToggle.classList.toggle('open');
    mobileNavOverlay.classList.toggle('open');
    // Prevent scrolling when mobile menu is open
    document.body.style.overflow = mobileNavOverlay.classList.contains('open') ? 'hidden' : 'initial';
  };

  mobileNavToggle.addEventListener('click', toggleMobileNav);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileNavToggle.classList.remove('open');
      mobileNavOverlay.classList.remove('open');
      document.body.style.overflow = 'initial';
    });
  });


  /* ==========================================================================
     INTERSECTION OBSERVER (SCROLL REVEAL)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.hero-content, .hero-image-wrapper, .banner-item, .about-image-wrapper, .about-content, .service-card, .studio-content, .studio-image-wrapper, .contact-info, .contact-form-wrapper');
  
  // Add reveal class dynamically to elements
  revealElements.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Stop observing once it has been revealed
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });


  /* ==========================================================================
     CONTACT FORM VALIDATION & SIMULATION
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  const submitButton = contactForm.querySelector('button[type="submit"]');

  const fields = {
    name: {
      input: document.getElementById('name'),
      error: document.getElementById('name-error'),
      validate: (value) => value.trim().length >= 2
    },
    email: {
      input: document.getElementById('email'),
      error: document.getElementById('email-error'),
      validate: (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value.trim());
      }
    },
    phone: {
      input: document.getElementById('phone'),
      error: document.getElementById('phone-error'),
      validate: (value) => {
        if (!value.trim()) return true; // Phone is optional
        const phoneRegex = /^\+?[0-9\s\-()]{8,15}$/;
        return phoneRegex.test(value.trim());
      }
    },
    message: {
      input: document.getElementById('message'),
      error: document.getElementById('message-error'),
      validate: (value) => value.trim().length >= 10
    },
    privacy: {
      input: document.getElementById('privacy'),
      error: document.getElementById('privacy-error'),
      validate: (value, element) => element.checked
    }
  };

  // Add real-time validation on input change
  Object.keys(fields).forEach(key => {
    const field = fields[key];
    const eventType = field.input.type === 'checkbox' || field.input.tagName === 'SELECT' ? 'change' : 'input';
    
    field.input.addEventListener(eventType, () => {
      const isValid = field.validate(field.input.value, field.input);
      if (isValid) {
        field.input.classList.remove('invalid');
        field.error.classList.remove('visible');
      }
    });
  });

  // Submit handler
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isFormValid = true;

    // Validate all fields
    Object.keys(fields).forEach(key => {
      const field = fields[key];
      const isValid = field.validate(field.input.value, field.input);
      
      if (!isValid) {
        field.input.classList.add('invalid');
        field.error.classList.add('visible');
        isFormValid = false;
      } else {
        field.input.classList.remove('invalid');
        field.error.classList.remove('visible');
      }
    });

    if (isFormValid) {
      // Simulate form submission
      submitButton.disabled = true;
      const originalBtnText = submitButton.textContent;
      submitButton.textContent = 'Invio in corso...';

      setTimeout(() => {
        // Success path
        formSuccess.classList.add('visible');
        contactForm.reset();
        submitButton.disabled = false;
        submitButton.textContent = originalBtnText;

        // Hide success message after 5 seconds
        setTimeout(() => {
          formSuccess.classList.remove('visible');
        }, 5000);
      }, 1200);
    } else {
      // Scroll to first invalid field
      const firstInvalid = contactForm.querySelector('.invalid');
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstInvalid.focus();
      }
    }
  });

});
