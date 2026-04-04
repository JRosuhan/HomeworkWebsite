(function () {

    const header       = document.querySelector('.site-header');
    const navToggle    = document.querySelector('.nav-toggle');
    const navContainer = document.querySelector('.nav-container');
    const navLinks     = document.querySelectorAll('.nav-container a');

    /* ─── Scroll hide / show ─── */
    let lastScrollY = window.scrollY;
    let ticking     = false;
    const scrollIndicator = document.querySelector('.scroll-down-indicator');

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const currentY      = window.scrollY;
                const scrollingDown = currentY > lastScrollY && currentY > 80;
                header.classList.toggle('nav-hidden', scrollingDown);
                if (scrollingDown) {
                    navContainer.classList.remove('open');
                    navToggle.classList.remove('open');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
                // Fade out scroll indicator as soon as user scrolls
                if (scrollIndicator) {
                    scrollIndicator.style.opacity = currentY > 50 ? '0' : '1';
                    scrollIndicator.style.pointerEvents = currentY > 50 ? 'none' : 'auto';
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

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navContainer.classList.remove('open');
            navToggle.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });

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

    /* ─── Room image carousels (inner per-card) ─── */
    document.querySelectorAll('.img-carousel').forEach(function(carousel) {
        var track  = carousel.querySelector('.img-car-track');
        var imgs   = Array.from(track.querySelectorAll('img'));
        var dotsEl = carousel.querySelector('.img-car-dots');
        var prev   = carousel.querySelector('.img-car-prev');
        var next   = carousel.querySelector('.img-car-next');
        var cur    = 0;

        // Build dots
        imgs.forEach(function(_, i) {
            var d = document.createElement('button');
            d.className = 'img-car-dot' + (i === 0 ? ' active' : '');
            d.setAttribute('aria-label', 'Image ' + (i + 1));
            d.addEventListener('click', function(e) { e.stopPropagation(); goImg(i); });
            dotsEl.appendChild(d);
        });

        var dots = Array.from(dotsEl.querySelectorAll('.img-car-dot'));

        function goImg(idx) {
            cur = Math.max(0, Math.min(idx, imgs.length - 1));
            track.style.transform = 'translateX(' + (-cur * 100) + '%)';
            dots.forEach(function(d, i) { d.classList.toggle('active', i === cur); });
            prev.disabled = cur === 0;
            next.disabled = cur === imgs.length - 1;
        }

        prev.addEventListener('click', function(e) { e.stopPropagation(); goImg(cur - 1); });
        next.addEventListener('click', function(e) { e.stopPropagation(); goImg(cur + 1); });

        // Touch swipe inside card
        var tx = 0, dragging = false;
        track.addEventListener('touchstart', function(e) { tx = e.touches[0].clientX; dragging = false; }, { passive: true });
        track.addEventListener('touchmove',  function(e) { if (Math.abs(e.touches[0].clientX - tx) > 8) dragging = true; }, { passive: true });
        track.addEventListener('touchend',   function(e) {
            if (!dragging) return;
            var diff = tx - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) goImg(diff > 0 ? cur + 1 : cur - 1);
        });

        goImg(0);
    });

})();
/* ─── Homie photo carousel (reviews section) ─── */
(function () {
    var carousel = document.querySelector('.homie-carousel');
    if (!carousel) return;

    var track   = carousel.querySelector('.homie-car-track');
    var slides  = Array.from(track.querySelectorAll('.homie-car-slide'));
    var dotsEl  = carousel.querySelector('.homie-car-dots');
    var prev    = carousel.querySelector('.homie-car-prev');
    var next    = carousel.querySelector('.homie-car-next');
    var cur     = 0;
    var autoTimer, progressTimer;
    var AUTO_DELAY = 3500;

    // Build dots
    slides.forEach(function (_, i) {
        var d = document.createElement('button');
        d.className = 'homie-car-dot' + (i === 0 ? ' active' : '');
        d.setAttribute('aria-label', 'Photo ' + (i + 1));
        d.addEventListener('click', function (e) { e.stopPropagation(); goTo(i); resetAuto(); });
        dotsEl.appendChild(d);
    });

    // Progress bar
    var bar = document.createElement('div');
    bar.className = 'homie-car-progress';
    carousel.appendChild(bar);

    var dots = Array.from(dotsEl.querySelectorAll('.homie-car-dot'));

    function goTo(idx) {
        cur = (idx + slides.length) % slides.length;
        track.style.transform = 'translateX(' + (-cur * 100) + '%)';
        dots.forEach(function (d, i) { d.classList.toggle('active', i === cur); });
        prev.disabled = false;
        next.disabled = false;
    }

    function startProgress() {
        bar.style.transition = 'none';
        bar.style.width = '0%';
        setTimeout(function () {
            bar.style.transition = 'width ' + AUTO_DELAY + 'ms linear';
            bar.style.width = '100%';
        }, 20);
    }

    function resetAuto() {
        clearInterval(autoTimer);
        startProgress();
        autoTimer = setInterval(function () {
            goTo(cur + 1);
            startProgress();
        }, AUTO_DELAY);
    }

    prev.addEventListener('click', function (e) { e.stopPropagation(); goTo(cur - 1); resetAuto(); });
    next.addEventListener('click', function (e) { e.stopPropagation(); goTo(cur + 1); resetAuto(); });

    // Touch swipe
    var tx = 0, dragging = false;
    track.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; dragging = false; }, { passive: true });
    track.addEventListener('touchmove',  function (e) { if (Math.abs(e.touches[0].clientX - tx) > 8) dragging = true; }, { passive: true });
    track.addEventListener('touchend',   function (e) {
        if (!dragging) return;
        var diff = tx - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) { goTo(diff > 0 ? cur + 1 : cur - 1); resetAuto(); }
    });

    // Pause on hover
    carousel.addEventListener('mouseenter', function () { clearInterval(autoTimer); bar.style.transition = 'none'; });
    carousel.addEventListener('mouseleave', resetAuto);

    goTo(0);
    resetAuto();
})();