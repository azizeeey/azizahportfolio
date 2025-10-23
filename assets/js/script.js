document.addEventListener('DOMContentLoaded', function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu li a');

  const observerOptions = {
    root: null, // observes intersections relative to the viewport
    rootMargin: '0px',
    threshold: 0.2 // 20% of the section must be visible
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

  // Smooth scroll for anchor links
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      // Cek jika ini adalah anchor link di halaman yang sama
      if (href.startsWith('#')) {
        e.preventDefault();
        const targetElement = document.querySelector(href);
        if(targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Update URL tanpa reload halaman
          history.pushState(null, null, href);
        }
      }
    });
  });

  // Contact Form Submission
  const contactForm = document.querySelector('.contact-right form');
  if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
          e.preventDefault();

          const form = e.target;
          const formData = new FormData(form);
          const action = form.getAttribute('action');
          const statusDiv = document.createElement('div');
          const submitButton = form.querySelector('button[type="submit"]');
          
          // Tampilkan status
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
});
