(function () {

    const header       = document.querySelector('.site-header');
    const navToggle    = document.querySelector('.nav-toggle');
    const navContainer = document.querySelector('.nav-container');
    const navLinks     = document.querySelectorAll('.nav-container a');

    /* ─── Scroll hide / show ─── */
    let lastScrollY = window.scrollY;
    let ticking     = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const currentY    = window.scrollY;
                const scrollingDown = currentY > lastScrollY && currentY > 80;

                header.classList.toggle('nav-hidden', scrollingDown);

                // Close mobile menu when header hides
                if (scrollingDown) {
                    navContainer.classList.remove('open');
                    navToggle.classList.remove('open');
                    navToggle.setAttribute('aria-expanded', 'false');
                }

                lastScrollY = currentY;
                ticking     = false;
            });
            ticking = true;
        }
    });

    /* ─── Hamburger toggle ─── */
    navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = navContainer.classList.toggle('open');
        navToggle.classList.toggle('open', isOpen);
        navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close when a nav link is tapped
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navContainer.classList.remove('open');
            navToggle.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!header.contains(e.target)) {
            navContainer.classList.remove('open');
            navToggle.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });

    /* ─── Slide-in animations ─── */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.slide-in').forEach(el => observer.observe(el));

})();