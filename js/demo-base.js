(function () {
    'use strict';

    function ensureToast() {
        let el = document.getElementById('demo-toast');
        if (!el) {
            el = document.createElement('div');
            el.id = 'demo-toast';
            el.className = 'demo_toast';
            el.setAttribute('role', 'status');
            el.setAttribute('aria-live', 'polite');
            document.body.appendChild(el);
        }
        return el;
    }

    window.demoToast = function (msg) {
        const el = ensureToast();
        el.textContent = msg;
        el.classList.add('is-visible');
        clearTimeout(el._timer);
        el._timer = setTimeout(() => el.classList.remove('is-visible'), 2400);
    };

    function initSkipLink() {
        const target = document.querySelector('[data-demo-main], main, .corp, .landing, .agency, .fin, .hotel, .salon, .yoga, .ind, .volt_main, .wine_main, .paws_main, .shop_layout, .vizitka, .barber, .clinic, .restaurant, .realestate, .photo, .course');
        if (!target) return;
        if (!target.id) target.id = 'main-content';
        const skip = document.createElement('a');
        skip.href = '#main-content';
        skip.className = 'demo_skip';
        skip.textContent = 'Перейти к содержимому';
        document.body.insertBefore(skip, document.body.firstChild);
    }

    function initFilters(container, cards, countEl) {
        const filters = container.querySelectorAll('[data-demo-filters] button, [data-demo-filters] [data-filter]');
        if (!filters.length) return;

        function applyFilter(value) {
            let visible = 0;
            cards.forEach((card) => {
                const cat = card.dataset.category || 'all';
                const tags = cat.split(/\s+/);
                const show = value === 'all' || tags.includes(value);
                card.classList.toggle('is-hidden', !show);
                if (show) visible += 1;
            });
            if (countEl) countEl.textContent = visible;
        }

        filters.forEach((btn) => {
            btn.addEventListener('click', () => {
                filters.forEach((b) => b.classList.remove('is-active'));
                btn.classList.add('is-active');
                applyFilter(btn.dataset.filter || 'all');
            });
        });

        applyFilter('all');
    }

    function initCatalog() {
        document.querySelectorAll('[data-demo-catalog]').forEach((catalog) => {
            const grid = catalog.querySelector('[data-demo-grid]');
            if (!grid) return;

            const cards = [...grid.querySelectorAll('[data-demo-card]')];
            const countEl = catalog.querySelector('[data-demo-count]');
            let cartCount = 0;
            const cartEl = document.querySelector('[data-demo-cart-count]');

            initFilters(catalog, cards, countEl);

            catalog.addEventListener('click', (e) => {
                const addBtn = e.target.closest('[data-demo-add], [data-demo-cart-add]');
                if (!addBtn || !catalog.contains(addBtn)) return;

                const card = addBtn.closest('[data-demo-card]');
                const name = card?.querySelector('h3')?.textContent?.trim() || 'Товар';
                cartCount += 1;
                if (cartEl) cartEl.textContent = cartCount;
                demoToast('«' + name + '» добавлен в корзину');
            });
        });
    }

    function initSlots() {
        document.querySelectorAll('[data-demo-slots]').forEach((container) => {
            container.addEventListener('click', (e) => {
                const slot = e.target.closest('[data-demo-slot], .clinic_slot');
                if (!slot || !container.contains(slot)) return;
                container.querySelectorAll('[data-demo-slot], .clinic_slot').forEach((s) => {
                    s.classList.remove('clinic_slot_active', 'is-active');
                    if (s.tagName === 'BUTTON') s.setAttribute('aria-pressed', 'false');
                });
                slot.classList.add('clinic_slot_active', 'is-active');
                if (slot.tagName === 'BUTTON') slot.setAttribute('aria-pressed', 'true');
            });
        });
    }

    function initForms() {
        document.querySelectorAll('[data-demo-form], .corp_form, .landing_form, .fin_contact_form, .hotel_booking_form').forEach((form) => {
            form.querySelectorAll('[readonly]').forEach((el) => el.removeAttribute('readonly'));
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                demoToast('Заявка отправлена — это демо-сайт');
            });
            form.querySelectorAll('button[type="button"]').forEach((btn) => {
                if (btn.closest('.corp_form, .landing_form, [data-demo-form], .fin_contact_form, .hotel_booking_form')) {
                    btn.addEventListener('click', () => demoToast('Заявка отправлена — это демо-сайт'));
                }
            });
        });
    }

    function initReveal() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.querySelectorAll('.demo_reveal').forEach((el) => el.classList.add('is-visible'));
            return;
        }
        const reveals = document.querySelectorAll('.demo_reveal');
        if (!reveals.length) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        );
        reveals.forEach((el) => observer.observe(el));
    }

    function initListingCards() {
        document.querySelectorAll('[data-demo-listing]').forEach((card) => {
            card.addEventListener('click', () => {
                const title = card.querySelector('h3')?.textContent?.trim() || 'Объект';
                demoToast('«' + title + '» — демо-карточка. Свяжитесь с нами для деталей.');
            });
        });
    }

    function initWishlist() {
        document.querySelectorAll('[data-demo-wishlist]').forEach((btn) => {
            btn.addEventListener('click', () => {
                btn.classList.toggle('is-active');
                demoToast(btn.classList.contains('is-active') ? 'Добавлено в избранное' : 'Удалено из избранного');
            });
        });
    }

    initSkipLink();
    initCatalog();
    initSlots();
    initForms();
    initReveal();
    initListingCards();
    initWishlist();
})();
