document.addEventListener('DOMContentLoaded', function () {
  // keep CSS var --header-height in sync with actual header height
  function updateHeaderHeight() {
    const header = document.querySelector('.main-header');
    const h = header ? header.offsetHeight : 70;
    document.documentElement.style.setProperty('--header-height', `${h}px`);
  }
  // initial update (after potential fonts/images)
  updateHeaderHeight();
  // ensure update on resize (and after a short delay for dynamic changes)
  window.addEventListener('resize', () => {
    updateHeaderHeight();
    // small timeout to catch layout shifts on some devices
    setTimeout(updateHeaderHeight, 120);
  });
  // also update after fonts/images load (best-effort)
  window.addEventListener('load', updateHeaderHeight);

  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu li a');

  const observerOptions = {
    root: null, 
    rootMargin: '0px',
    threshold: 0.2 
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    observer.observe(section);
  });

  // smooth scroll with header offset and mobile menu close
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href') || '';

      // handle same-page hash links like "#about"
      if (href.startsWith('#')) {
        e.preventDefault();
        const targetElement = document.querySelector(href);

        // if mobile menu is open, close it first (visual cleanup)
        if (typeof navMenu !== 'undefined' && navMenu && navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          const hb = document.querySelector('.hamburger');
          if (hb) {
            hb.classList.remove('is-active');
            hb.setAttribute('aria-expanded', 'false');
          }
          document.body.classList.remove('no-scroll');
        }

        if (targetElement) {
          // offset so section appears below sticky header
          const header = document.querySelector('.main-header');
          const headerHeight = header ? header.offsetHeight : 0;
          const offset = 8; // small gap
          const targetY = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - offset;
          window.scrollTo({ top: targetY, behavior: 'smooth' });
          history.pushState(null, null, href);
        }
      }
      // other links (external or page+hash) use default browser behavior
    });
  });

  const contactForm = document.querySelector('.contact-right form');
  if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
          e.preventDefault();

          const form = e.target;
          const formData = new FormData(form);
          const action = form.getAttribute('action');
          const statusDiv = document.createElement('div');
          const submitButton = form.querySelector('button[type="submit"]');
          
          statusDiv.style.marginTop = '1rem';
          statusDiv.innerHTML = 'Sending...';
          form.appendChild(statusDiv);
          submitButton.disabled = true;

          fetch(action, {
              method: 'POST',
              body: formData,
              headers: {
                  'Accept': 'application/json'
              }
          }).then(response => {
              if (response.ok) {
                  statusDiv.innerHTML = 'Thanks for your message! I will get back to you shortly.';
                  submitButton.disabled = false;
                  form.reset();
              } else {
                  response.json().then(data => {
                      if (Object.hasOwn(data, 'errors')) {
                          statusDiv.innerHTML = data["errors"].map(error => error["message"]).join(", ");
                      } else {
                          statusDiv.innerHTML = 'Oops! There was a problem submitting your form';
                      }
                      submitButton.disabled = false;
                  })
              }
          }).catch(error => {
              statusDiv.innerHTML = 'Oops! There was a problem submitting your form. Please check your internet connection.';
              submitButton.disabled = false;
          });
      });
  }

  const animatedElements = document.querySelectorAll('.scroll-animate');
  const animationObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;

        // Jika ada override lewat atribut data-animate-delay gunakan itu,
        // jika tidak, hitung index di antara saudara (.scroll-animate) untuk stagger otomatis.
        if (!el.style.transitionDelay) {
          let delay = el.dataset.animateDelay;
          if (!delay) {
            const parent = el.parentNode || document;
            const siblings = Array.from(parent.querySelectorAll('.scroll-animate'));
            const index = Math.max(0, siblings.indexOf(el));
            delay = `${(index || 0) * 0.08}s`;
          }
          el.style.transitionDelay = delay;
        }

        el.classList.add('visible');
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.08 });

  animatedElements.forEach(element => {
    animationObserver.observe(element);
  });

  // ===== Mobile hamburger menu toggle =====
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  if (hamburger && navMenu) {
    const toggleMenu = (open) => {
      const isOpen = open ?? !navMenu.classList.contains('open');
      navMenu.classList.toggle('open', isOpen);
      hamburger.classList.toggle('is-active', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.classList.toggle('no-scroll', isOpen);
      // ensure header-height reflects any change (menu may increase header height on some designs)
      updateHeaderHeight();
    };

    hamburger.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleMenu();
    });

    // (nav link click now handles closing the menu; no duplicate listeners here)
  }
  // update header height once more after DOM-ready microtasks
  setTimeout(updateHeaderHeight, 200);
});
