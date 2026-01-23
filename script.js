document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    lucide.createIcons();

    // Smooth scroll for navbar links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const navLinks = document.querySelector('.nav-links');
                const menuToggle = document.querySelector('.menu-toggle');
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
            }
        });
    });

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
    let hasBeenInitialized = false;
    if (journeySection) {
        const journeyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasBeenInitialized) {
                    // Initialize at last panel (2567) if not already there
                    if (currentIndex !== totalPanels - 1) {
                        updateTimeline(totalPanels - 1);
                    } else {
                        // Even if at index, ensure counters run
                        startCounter();
                    }
                    hasBeenInitialized = true;
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
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
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

    // Ecosystem Slider Logic
    const sliderTrack = document.querySelector('.ecosystem-slider-track');
    const sliderContainer = document.querySelector('.ecosystem-slider-container');
    const prevBtnEco = document.getElementById('ecosystemPrev');
    const nextBtnEco = document.getElementById('ecosystemNext');

    if (sliderTrack && sliderContainer) {
        // Clone items for seamless infinite loop
        const originalItems = Array.from(document.querySelectorAll('.ecosystem-item'));
        const totalOriginalItems = originalItems.length;

        // Clone all items and append to the track
        originalItems.forEach(item => {
            const clone = item.cloneNode(true);
            sliderTrack.appendChild(clone);
        });

        let isDown = false;
        let startX;
        let scrollLeft;
        let currentIndex = 0;
        let isAnimating = false;

        const gap = 40; // 2.5rem = 40px
        let itemWidth = originalItems[0].offsetWidth + gap;

        function updateSlider(animate = true) {
            if (animate) {
                sliderTrack.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            } else {
                sliderTrack.style.transition = 'none';
            }
            sliderTrack.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
        }

        function handleInfiniteLoop() {
            // Check if we've moved into the cloned section
            if (currentIndex >= totalOriginalItems) {
                currentIndex = 0;
                updateSlider(false);
            } else if (currentIndex < 0) {
                currentIndex = totalOriginalItems - 1;
                updateSlider(false);
            }
            isAnimating = false;
        }

        // Handle teleportation after transition
        sliderTrack.addEventListener('transitionend', handleInfiniteLoop);

        if (prevBtnEco) {
            prevBtnEco.addEventListener('click', () => {
                if (isAnimating) return;
                isAnimating = true;
                currentIndex--;
                updateSlider();
            });
        }

        if (nextBtnEco) {
            nextBtnEco.addEventListener('click', () => {
                if (isAnimating) return;
                isAnimating = true;
                currentIndex++;
                updateSlider();
            });
        }

        // Mouse/Touch Drag
        sliderContainer.addEventListener('mousedown', (e) => {
            if (isAnimating) return;
            isDown = true;
            startX = e.pageX - sliderContainer.offsetLeft;
            scrollLeft = currentIndex * itemWidth;
            sliderContainer.style.cursor = 'grabbing';
            sliderTrack.style.transition = 'none';
        });

        const finishDrag = (e) => {
            if (!isDown) return;
            isDown = false;
            sliderContainer.style.cursor = 'grab';
            sliderTrack.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';

            const movedBy = e ? (startX - (e.pageX - sliderContainer.offsetLeft)) : 0;

            // Snap to nearest item
            if (Math.abs(movedBy) > itemWidth / 6) {
                if (movedBy > 0) {
                    currentIndex++;
                } else {
                    currentIndex--;
                }
            }
            updateSlider();
        };

        sliderContainer.addEventListener('mouseleave', () => finishDrag());
        sliderContainer.addEventListener('mouseup', (e) => finishDrag(e));

        sliderContainer.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - sliderContainer.offsetLeft;
            const walk = (x - startX);
            sliderTrack.style.transform = `translateX(${-scrollLeft + walk}px)`;
        });

        // Initialize (no need to disable buttons in infinite mode)
        if (prevBtnEco) prevBtnEco.disabled = false;
        if (nextBtnEco) nextBtnEco.disabled = false;

        // Handle window resize
        window.addEventListener('resize', () => {
            itemWidth = originalItems[0].offsetWidth + gap;
            updateSlider(false);
        });
    }
});
