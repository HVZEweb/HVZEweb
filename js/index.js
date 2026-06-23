const burger = document.querySelector('.header_burger');
const mobileMenu = document.getElementById('mobile-menu');
const desktopLinks = document.querySelectorAll('.header_menu_item');
const mobileLinks = document.querySelectorAll('.mobile_menu_item');
const allMenuLinks = [...desktopLinks, ...mobileLinks];
const sections = document.querySelectorAll('section[id]');
const contactForm = document.getElementById('contact-form');
const formNoteSuccess = document.getElementById('form-note-success');
const formNoteError = document.getElementById('form-note-error');
const formSubmitBtn = document.getElementById('form-submit');
const revealElements = document.querySelectorAll('.reveal');
const goalElements = document.querySelectorAll('[data-goal]');

const MENU_ANIMATION_MS = 550;
const config = window.SITE_CONFIG || {};

function openMenu() {
    if (!burger || !mobileMenu) return;

    mobileMenu.classList.remove('is-closing');
    mobileMenu.classList.add('is-open');
    burger.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Закрыть меню');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');
}

function closeMenu(callback) {
    if (!burger || !mobileMenu) return;

    if (!mobileMenu.classList.contains('is-open')) {
        callback?.();
        return;
    }

    mobileMenu.classList.add('is-closing');
    mobileMenu.classList.remove('is-open');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Открыть меню');

    window.setTimeout(() => {
        mobileMenu.classList.remove('is-closing');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('menu-open');
        callback?.();
    }, MENU_ANIMATION_MS);
}

function scrollToSection(selector) {
    const target = document.querySelector(selector);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
        if (mobileMenu.classList.contains('is-open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    mobileLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const href = link.getAttribute('href');
            if (!href?.startsWith('#')) return;
            closeMenu(() => scrollToSection(href));
        });
    });
}

function setActiveLink() {
    const scrollPos = window.scrollY + 120;
    let currentSection = '';

    sections.forEach((section) => {
        if (scrollPos >= section.offsetTop) {
            currentSection = section.getAttribute('id');
        }
    });

    allMenuLinks.forEach((link) => {
        const href = link.getAttribute('href');
        link.classList.toggle('is_active', href === `#${currentSection}`);
    });
}

window.addEventListener('scroll', setActiveLink, { passive: true });
setActiveLink();

const faqItems = document.querySelectorAll('.faq_item');

faqItems.forEach((item) => {
    item.addEventListener('toggle', () => {
        if (!item.open) return;

        faqItems.forEach((other) => {
            if (other !== item) {
                other.open = false;
            }
        });
    });
});

if (revealElements.length) {
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
}

function trackGoal(goalName) {
    if (typeof ym === 'function' && config.yandexMetrikaId) {
        ym(config.yandexMetrikaId, 'reachGoal', goalName);
    }
}

goalElements.forEach((el) => {
    el.addEventListener('click', () => {
        const goal = el.getAttribute('data-goal');
        if (goal) trackGoal(goal);
    });
});

function hideFormMessages() {
    if (formNoteSuccess) formNoteSuccess.hidden = true;
    if (formNoteError) formNoteError.hidden = true;
}

function showFormSuccess() {
    hideFormMessages();
    if (formNoteSuccess) formNoteSuccess.hidden = false;
}

function showFormError(message) {
    hideFormMessages();
    if (formNoteError) {
        formNoteError.textContent = message;
        formNoteError.hidden = false;
    }
}

function openTelegramFallback(name, contact, message) {
    const text = encodeURIComponent(
        `Заявка с сайта HVZEweb\n\nИмя: ${name}\nКонтакт: ${contact}\n\n${message}`
    );
    const url = config.telegramUrl || 'https://t.me/HVZEweb';
    window.open(`${url}?text=${text}`, '_blank');
}

async function submitContactForm(formData) {
    const payload = {
        name: formData.get('name')?.toString().trim(),
        contact: formData.get('contact')?.toString().trim(),
        message: formData.get('message')?.toString().trim(),
    };

    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            return { ok: true };
        }

        if (response.status === 503) {
            return { ok: false, fallback: true };
        }

        return { ok: false, fallback: false };
    } catch {
        return { ok: false, fallback: true };
    }
}

if (contactForm) {
    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        hideFormMessages();

        const formData = new FormData(contactForm);
        const name = formData.get('name')?.toString().trim() || '';
        const contact = formData.get('contact')?.toString().trim() || '';
        const message = formData.get('message')?.toString().trim() || '';

        if (formSubmitBtn) {
            formSubmitBtn.disabled = true;
            formSubmitBtn.textContent = 'Отправка…';
        }

        const result = await submitContactForm(formData);

        if (result.ok) {
            contactForm.reset();
            showFormSuccess();
            trackGoal('form_submit');
        } else if (result.fallback) {
            openTelegramFallback(name, contact, message);
            showFormSuccess();
            contactForm.reset();
        } else {
            showFormError(`Не удалось отправить. Напишите нам в Telegram: ${config.telegram || '@HVZEweb'}`);
        }

        if (formSubmitBtn) {
            formSubmitBtn.disabled = false;
            formSubmitBtn.textContent = 'Отправить заявку';
        }
    });
}

function initYandexMetrika() {
    const id = config.yandexMetrikaId;
    if (!id) return;

    (function (m, e, t, r, i, k, a) {
        m[i] =
            m[i] ||
            function () {
                (m[i].a = m[i].a || []).push(arguments);
            };
        m[i].l = 1 * new Date();
        for (let j = 0; j < document.scripts.length; j++) {
            if (document.scripts[j].src === r) return;
        }
        k = e.createElement(t);
        a = e.getElementsByTagName(t)[0];
        k.async = 1;
        k.src = r;
        a.parentNode.insertBefore(k, a);
    })(window, document, 'script', `https://mc.yandex.ru/metrika/tag.js?id=${id}`, 'ym');

    window.ym(id, 'init', {
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true,
    });
}

initYandexMetrika();
