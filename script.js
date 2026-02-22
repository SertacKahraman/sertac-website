/* ═══════════════════════════════════════════════════
   macOS Portfolio — Robust JS
   ═══════════════════════════════════════════════════ */

(function () {
    'use strict';

    // ═══ 1. PARTICLES — Subtle background effect ═══
    const particles = document.getElementById('particles');
    if (particles) {
        for (let i = 0; i < 35; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.left = Math.random() * 100 + '%';
            p.style.top = Math.random() * 100 + '%';
            p.style.animationDuration = (4 + Math.random() * 8) + 's';
            p.style.animationDelay = (Math.random() * 10) + 's';
            p.style.width = p.style.height = (1 + Math.random() * 2) + 'px';
            particles.appendChild(p);
        }
    }

    // ═══ 2. DOCK — Jump to section helper ═══
    window.jumpToSection = function (id) {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            console.warn(`Element with ID "${id}" not found.`);
        }
    };

    // ═══ 3. DOCK — Fish-eye magnification (Optimized to prevent forced reflow) ═══
    const dock = document.getElementById('dock');
    if (dock) {
        const dockItems = dock.querySelectorAll('.dock-item');
        let itemCenters = [];

        function updateCenters() {
            itemCenters = Array.from(dockItems).map(item => {
                const rect = item.getBoundingClientRect();
                return {
                    el: item.querySelector('.dock-icon'),
                    center: rect.left + rect.width / 2
                };
            });
        }

        // Defer initial measurement to avoid forced reflow during initial page load
        window.addEventListener('load', () => {
            setTimeout(updateCenters, 100);
        });
        window.addEventListener('resize', updateCenters);

        dock.addEventListener('mousemove', (e) => {
            // Use requestAnimationFrame for smoother performance
            requestAnimationFrame(() => {
                itemCenters.forEach(item => {
                    if (!item.el) return;
                    const dist = Math.abs(e.clientX - item.center);
                    const scale = Math.max(1, 1.4 - (dist / 120) * 0.4);
                    item.el.style.transform = `translateY(${-(scale - 1) * 20}px) scale(${scale})`;
                });
            });
        });

        dock.addEventListener('mouseleave', () => {
            itemCenters.forEach(item => {
                if (item.el) item.el.style.transform = '';
            });
        });
    }

    // ═══ 4. FOOTER — Live Clock ═══
    function updateClock() {
        const clockEl = document.getElementById('footer-live-clock');
        if (!clockEl) return;

        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        clockEl.textContent = `${hours}:${minutes}:${seconds}`;
    }

    // ═══ 5. i18n — Language Switching ═══
    let currentLang = localStorage.getItem('sertac-lang') || 'en';

    function setLanguage(lang) {
        if (!window.translations || !window.translations[lang]) return;

        currentLang = lang;
        localStorage.setItem('sertac-lang', lang);

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (window.translations[lang][key]) {
                el.textContent = window.translations[lang][key];
            }
        });

        const langToggle = document.getElementById('lang-toggle');
        if (langToggle) {
            langToggle.textContent = lang.toUpperCase();
            // Update accessibility label
            const label = lang === 'en' ? 'Change language to Turkish' : 'Dili İngilizce yap';
            langToggle.setAttribute('aria-label', label);
        }

        document.documentElement.setAttribute('lang', lang);

        const page = window.location.pathname;
        let titleKey = 'page-title-index';
        if (page.includes('about')) titleKey = 'page-title-about';
        else if (page.includes('projects')) titleKey = 'page-title-projects';
        if (window.translations[lang][titleKey]) {
            document.title = window.translations[lang][titleKey];
        }
    }

    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
        langToggle.addEventListener('click', () => {
            const nextLang = currentLang === 'en' ? 'tr' : 'en';
            setLanguage(nextLang);
        });
    }

    updateClock();
    setInterval(updateClock, 1000);
    setLanguage(currentLang);

})();
