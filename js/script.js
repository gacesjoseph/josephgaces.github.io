// 0. EmailJS Configuration
const PUBLIC_KEY = "-vaaIsihEB7r2eKNW";
const SERVICE_ID = "service_4ctt1nk";
const TEMPLATE_ID = "template_ed4sdmn";

// Initialize EmailJS immediately
emailjs.init(PUBLIC_KEY);

document.addEventListener('DOMContentLoaded', () => {

    // 1. Reveal sections on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(section => {
        section.classList.add('reveal');
        observer.observe(section);
    });

    // 2. Smooth Scroll
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPos = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPos,
                    behavior: 'smooth'
                });
                history.pushState(null, null, targetId);
            }
        });
    });

    // 3. Active Nav Link Highlighting on Scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // When a section is about 40% from the top of the viewport, mark its link as active.
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                // Remove active class from all links
                navLinks.forEach(link => {
                    link.classList.remove('active-link');
                });

                // Add active class to the link corresponding to the visible section
                const activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active-link');
                }
            }
        });
    }, { 
        rootMargin: '-40% 0px -60% 0px'
    });

    sections.forEach(section => {
        navObserver.observe(section);
    });

    // 4. Dark Mode Toggle
    const toggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        toggleBtn.textContent = currentTheme === 'light' ? '🌙' : '☀️';
    } else {
        toggleBtn.textContent = '☀️'; // Default to Sun (target: Light Mode)
    }

    toggleBtn.addEventListener('click', (e) => {
        const toggleTheme = () => {
            let theme = document.documentElement.getAttribute('data-theme');
            let newTheme = theme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            toggleBtn.textContent = newTheme === 'light' ? '🌙' : '☀️';
        };

        // Fallback for browsers that don't support View Transitions
        if (!document.startViewTransition) {
            toggleTheme();
            return;
        }

        // Get the click position or default to the button center
        const x = e.clientX;
        const y = e.clientY;
        const endRadius = Math.hypot(
            Math.max(x, innerWidth - x),
            Math.max(y, innerHeight - y)
        );

        const transition = document.startViewTransition(() => {
            toggleTheme();
        });

        transition.ready.then(() => {
            const clipPath = [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`,
            ];
            document.documentElement.animate(
                { clipPath: clipPath },
                {
                    duration: 500,
                    easing: 'ease-in-out',
                    pseudoElement: '::view-transition-new(root)',
                }
            );
        });
    });

    // 5. Form Status
    const contactForm = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');
    let statusTimeout;

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;
            
            // Reset status styles/text
            status.textContent = "";
            status.className = ""; 
            status.removeAttribute('style');
            clearTimeout(statusTimeout);

            const templateParams = {
                sender_name: document.getElementById('name').value,
                sender_email: document.getElementById('email').value,
                sender_message: document.getElementById('message').value,
            };

            emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)
                .then(() => {
                    status.textContent = "Message sent successfully!";
                    status.classList.add('success');
                    contactForm.reset();

                    // Hide after 5 seconds
                    statusTimeout = setTimeout(() => {
                        status.textContent = "";
                        status.classList.remove('success');
                    }, 5000);
                })
                .catch((error) => {
                    status.textContent = "Failed to send message. Please try again.";
                    status.classList.add('error');
                    console.error('EmailJS Error:', error);

                    // Hide after 5 seconds
                    statusTimeout = setTimeout(() => {
                        status.textContent = "";
                        status.classList.remove('error');
                    }, 5000);
                })
                .finally(() => {
                    submitBtn.innerText = 'Send Message';
                    submitBtn.disabled = false;
                });
        });
    }

    // 6. Load Calendly Widget Script
    const calendlyWidget = document.querySelector('.calendly-inline-widget');
    if (calendlyWidget) {
        const script = document.createElement('script');
        script.src = "https://assets.calendly.com/assets/external/widget.js";
        script.async = true;
        document.body.appendChild(script);
    }

    // 7. Hero Text Rotator
    const rotatingText = document.getElementById('rotating-text');
    if (rotatingText) {
        const phrases = ["web developer", "web designer", "problem solver"];
        let index = 0;

        setInterval(() => {
            // Flip out (upwards)
            rotatingText.classList.add('flip-out');

            setTimeout(() => {
                index = (index + 1) % phrases.length;
                rotatingText.textContent = phrases[index];

                // Prepare flip in (from downwards)
                rotatingText.style.transition = 'none';
                rotatingText.style.transform = 'rotateX(-90deg)';
                rotatingText.style.opacity = '0';

                // Force reflow
                void rotatingText.offsetWidth;

                // Animate in
                rotatingText.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease';
                rotatingText.style.transform = '';
                rotatingText.style.opacity = '';
                rotatingText.classList.remove('flip-out');
            }, 500); // Wait for flip-out to complete
        }, 3000);
    }

    // 8. Project Modal Logic
    const modal = document.getElementById('project-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const projectButtons = document.querySelectorAll('.view-project-btn');

    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalTech = document.getElementById('modal-tech');
    const modalImg = document.getElementById('modal-img');

    if (modal) {
        projectButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Find the closest card parent
                const card = e.target.closest('.project-card');
                
                // Populate modal
                modalTitle.textContent = card.dataset.title;
                modalDesc.textContent = card.dataset.desc;
                modalTech.textContent = card.dataset.tech;
                modalImg.src = card.dataset.img;
                modalImg.alt = card.dataset.title;

                // Open modal
                modal.showModal();
            });
        });

        closeModalBtn.addEventListener('click', () => {
            modal.close();
        });

        // Close when clicking backdrop
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.close();
            }
        });
    }

    // 9. Back to Top Button Visibility
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
    }
});