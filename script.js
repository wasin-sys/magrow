document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        // Navbar scroll effect
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top button visibility
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    // Back to top button click
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Intersection Observer for fade-in animations
    const fadeElems = document.querySelectorAll('.fade-in');

    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    fadeElems.forEach(elem => {
        observer.observe(elem);
    });

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Close menu when link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Hi-Tech Timeline Navigation
    const yearBtns = document.querySelectorAll('.year-btn');
    const timelinePanels = document.querySelectorAll('.timeline-panel');
    const timelineProgress = document.getElementById('timelineProgress');
    const prevBtn = document.getElementById('prevYear');
    const nextBtn = document.getElementById('nextYear');
    const currentIndexSpan = document.getElementById('currentIndex');
    let currentIndex = 7; // Start at last panel (2567)
    const totalPanels = yearBtns.length;

    function updateTimeline(index) {
        // Update buttons
        yearBtns.forEach((btn, i) => {
            btn.classList.toggle('active', i === index);
        });

        // Update panels with animation direction
        timelinePanels.forEach((panel, i) => {
            panel.classList.remove('active');
            if (i === index) {
                setTimeout(() => {
                    panel.classList.add('active');
                }, 50);
            }
        });

        // Update progress bar
        const progressPercent = (index / (totalPanels - 1)) * 100;
        if (timelineProgress) {
            timelineProgress.style.width = `${progressPercent}%`;
        }

        // Update navigation buttons
        if (prevBtn) prevBtn.disabled = index === 0;
        if (nextBtn) nextBtn.disabled = index === totalPanels - 1;

        // Update index indicator
        if (currentIndexSpan) {
            currentIndexSpan.textContent = index + 1;
        }

        currentIndex = index;

        // Start counter if on last panel (MAGROW founding)
        if (index === totalPanels - 1) {
            startCounter();
        }
    }

    // Year button click handlers
    yearBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            updateTimeline(index);
        });
    });

    // Arrow navigation handlers
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                updateTimeline(currentIndex - 1);
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentIndex < totalPanels - 1) {
                updateTimeline(currentIndex + 1);
            }
        });
    }

    // Keyboard navigation for timeline
    document.addEventListener('keydown', (e) => {
        const journeySection = document.getElementById('journey');
        if (!journeySection) return;

        const rect = journeySection.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;

        if (isInView) {
            if (e.key === 'ArrowLeft' && currentIndex > 0) {
                updateTimeline(currentIndex - 1);
            } else if (e.key === 'ArrowRight' && currentIndex < totalPanels - 1) {
                updateTimeline(currentIndex + 1);
            }
        }
    });

    // Auto-play timeline on scroll into view
    const journeySection = document.querySelector('.journey-hitech');
    if (journeySection) {
        const journeyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Initialize at last panel (2567)
                    updateTimeline(totalPanels - 1);
                }
            });
        }, { threshold: 0.3 });

        journeyObserver.observe(journeySection);
    }

    // Counter animation function
    function animateCounter(element, target, duration = 2000) {
        if (element.classList.contains('counted')) return;
        element.classList.add('counted');

        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                element.innerText = target.toLocaleString();
                clearInterval(timer);
            } else {
                element.innerText = Math.floor(current).toLocaleString();
            }
        }, 16);
    }

    function startCounter() {
        const counter = document.getElementById('capital-amount');
        if (!counter) return;
        const target = parseInt(counter.getAttribute('data-target'));
        animateCounter(counter, target);
    }

    // Stat counters observer (for Vision section)
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const target = parseInt(element.getAttribute('data-target'));
                if (target) {
                    animateCounter(element, target, 1500);
                }
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navbarHeight = navbar.offsetHeight;
                window.scrollTo({
                    top: target.offsetTop - navbarHeight - 20,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active nav link highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        const navbarHeight = navbar.offsetHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinksAll.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
});
