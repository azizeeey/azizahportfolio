document.addEventListener('DOMContentLoaded', function () {
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

  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const targetElement = document.querySelector(href);
        if(targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          history.pushState(null, null, href);
        }
      }
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
});
