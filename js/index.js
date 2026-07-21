const burger = document.querySelector('.header_burger');
const mobileMenu = document.getElementById('mobile-menu');
const desktopLinks = document.querySelectorAll('.header_menu_item');
const mobileLinks = document.querySelectorAll('.mobile_menu_item');
const allMenuLinks = [...desktopLinks, ...mobileLinks];
const sections = document.querySelectorAll('section[id]');
const contactForm = document.getElementById('contact-form');
const formNoteError = document.getElementById('form-note-error');
const formSubmitBtn = document.getElementById('form-submit');
const formSuccessModal = document.getElementById('form-success-modal');
const formSuccessTitle = document.getElementById('form-success-title');
const formSuccessText = document.getElementById('form-success-text');
const revealElements = document.querySelectorAll('.reveal');
const goalElements = document.querySelectorAll('[data-goal]');

const MENU_ANIMATION_MS = 550;
const config = window.SITE_CONFIG || {};
const L = window.HVZE_LANG;
const t = (key) => L.t(key);

(function initSiteTelegramLinks() {
    const tgUrl = config.telegramUrl || 'https://t.me/HVZEwebDemoBot';
    const tgStart = config.telegramStartUrl || tgUrl;
    const tgPortfolio = config.telegramPortfolioStartUrl || `${tgUrl}?start=portfolio_demo`;
    const tgHandle = config.telegram || '@HVZEwebDemoBot';

    [
        ['hero-tg-link', tgStart],
        ['contacts-tg-link', tgUrl],
        ['bot-case-tg-link', tgPortfolio],
    ].forEach(([id, href]) => {
        document.getElementById(id)?.setAttribute('href', href);
    });

    const contactsLabel = document.getElementById('contacts-tg-label');
    if (contactsLabel) contactsLabel.textContent = tgHandle;

    document.querySelectorAll('.js-pricing-tg-link').forEach((el) => {
        el.setAttribute('href', tgStart);
    });
})();

function updateBurgerLabel() {
    if (!burger) return;
    const open = mobileMenu?.classList.contains('is-open');
    burger.setAttribute('aria-label', t(open ? 'burger.close' : 'burger.open'));
}

window.addEventListener('hvze:langchange', updateBurgerLabel);
updateBurgerLabel();

function openMenu() {
    if (!burger || !mobileMenu) return;

    mobileMenu.classList.remove('is-closing');
    mobileMenu.classList.add('is-open');
    burger.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', t('burger.close'));
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
    burger.setAttribute('aria-label', t('burger.open'));

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
    if (formNoteError) formNoteError.hidden = true;
}

function openSuccessModal(title, message) {
    if (!formSuccessModal) return;

    if (formSuccessTitle) formSuccessTitle.textContent = title;
    if (formSuccessText) formSuccessText.textContent = message;

    formSuccessModal.hidden = false;
    formSuccessModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('form-modal-open');

    requestAnimationFrame(() => {
        formSuccessModal.classList.add('is-visible');
    });

    const closeBtn = formSuccessModal.querySelector('[data-modal-close]');
    closeBtn?.focus();
}

function closeSuccessModal() {
    if (!formSuccessModal || formSuccessModal.hidden) return;

    formSuccessModal.classList.remove('is-visible');
    formSuccessModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('form-modal-open');

    window.setTimeout(() => {
        formSuccessModal.hidden = true;
    }, 300);

    formSubmitBtn?.focus();
}

if (formSuccessModal) {
    formSuccessModal.querySelectorAll('[data-modal-close]').forEach((el) => {
        el.addEventListener('click', closeSuccessModal);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !formSuccessModal.hidden) {
            closeSuccessModal();
        }
    });
}

function showFormSuccess(isTelegramFallback = false) {
    hideFormMessages();

    if (isTelegramFallback) {
        openSuccessModal(t('form.tgTitle'), t('form.tgText'));
        return;
    }

    openSuccessModal(t('form.successTitle'), t('form.successText'));
}

function showFormError(message) {
    hideFormMessages();
    if (formNoteError) {
        formNoteError.textContent = message;
        formNoteError.hidden = false;
    }
}

function openTelegramFallback(name, contact, message, pkg) {
    const pkgLine = pkg ? `Пакет: ${pkg}\n` : '';
    const text = encodeURIComponent(
        `Заявка с сайта HVZEweb\n\nИмя: ${name}\nКонтакт: ${contact}\n${pkgLine}\n${message}`
    );
    const url = config.telegramUrl || 'https://t.me/HVZEwebDemoBot';
    window.open(`${url}?text=${text}`, '_blank');
}

async function submitContactForm(formData) {
    const payload = {
        name: formData.get('name')?.toString().trim(),
        contact: formData.get('contact')?.toString().trim(),
        message: formData.get('message')?.toString().trim(),
        package: formData.get('package')?.toString().trim() || '',
    };

    const apiUrl = config.contactApiUrl;
    if (!apiUrl) {
        return { ok: false, fallback: true };
    }

    try {
        const response = await fetch(apiUrl, {
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
        const pkg = formData.get('package')?.toString().trim() || '';

        if (formSubmitBtn) {
            formSubmitBtn.disabled = true;
            formSubmitBtn.textContent = t('form.sending');
        }

        const result = await submitContactForm(formData);

        if (result.ok) {
            contactForm.reset();
            showFormSuccess(false);
            trackGoal('form_submit');
        } else if (result.fallback) {
            openTelegramFallback(name, contact, message, pkg);
            showFormSuccess(true);
            contactForm.reset();
        } else {
            showFormError(`${t('form.errorGeneric')} ${config.telegram || '@HVZEwebDemoBot'}`);
        }

        if (formSubmitBtn) {
            formSubmitBtn.disabled = false;
            formSubmitBtn.textContent = t('form.submit');
        }
    });
}

const formPackageSelect = document.getElementById('form-package');

function setFormPackage(value) {
    if (!formPackageSelect || !value) return;
    formPackageSelect.value = value;
}

document.querySelectorAll('[data-package]').forEach((el) => {
    el.addEventListener('click', () => {
        const pkg = el.getAttribute('data-package');
        if (pkg) {
            window.setTimeout(() => setFormPackage(pkg), 350);
        }
    });
});

const QUIZ_STEPS = [
    {
        key: 'need',
        question: 'quiz.q1',
        options: [
            { value: 'vizitka', label: 'quiz.o1a' },
            { value: 'start', label: 'quiz.o1b' },
            { value: 'business', label: 'quiz.o1c' },
            { value: 'premium', label: 'quiz.o1d' },
            { value: 'business', label: 'quiz.o1e' },
            { value: 'bot', label: 'quiz.o1f' },
        ],
    },
    {
        key: 'timeline',
        question: 'quiz.q2',
        options: [
            { value: 'fast', label: 'quiz.o2a' },
            { value: 'normal', label: 'quiz.o2b' },
            { value: 'flex', label: 'quiz.o2c' },
        ],
    },
    {
        key: 'budget',
        question: 'quiz.q3',
        options: [
            { value: 'low', label: 'quiz.o3a' },
            { value: 'mid', label: 'quiz.o3b' },
            { value: 'high', label: 'quiz.o3c' },
        ],
    },
    {
        key: 'content',
        question: 'quiz.q4',
        options: [
            { value: 'yes', label: 'quiz.o4a' },
            { value: 'partial', label: 'quiz.o4b' },
            { value: 'no', label: 'quiz.o4c' },
        ],
    },
];

const quizStepEl = document.getElementById('quiz-step');
const quizNextBtn = document.getElementById('quiz-next');
const quizBackBtn = document.getElementById('quiz-back');
const quizProgress = document.getElementById('quiz-progress');
const quizResultEl = document.getElementById('quiz-result');
const quizResultText = document.getElementById('quiz-result-text');
const quizToFormBtn = document.getElementById('quiz-to-form');
const quizActions = document.querySelector('.quiz_actions');

let quizIndex = 0;
const quizAnswers = {};
let quizRecommended = 'start';

function computeQuizPackage() {
    let pkg = quizAnswers.need || 'start';

    if (quizAnswers.budget === 'low') {
        if (pkg === 'premium' || pkg === 'business') pkg = 'start';
        if (pkg === 'bot') pkg = 'start';
    }
    if (quizAnswers.budget === 'mid' && pkg === 'premium') pkg = 'business';
    if (quizAnswers.budget === 'high' && pkg === 'vizitka') pkg = 'start';

    if (quizAnswers.need === 'bot') pkg = 'bot';

    return pkg;
}

function updateQuizProgress() {
    if (!quizProgress) return;
    [...quizProgress.children].forEach((dot, i) => {
        dot.classList.toggle('is-active', i === quizIndex);
        dot.classList.toggle('is-done', i < quizIndex);
    });
}

function renderQuizStep() {
    if (!quizStepEl) return;

    const step = QUIZ_STEPS[quizIndex];
    const selected = quizAnswers[step.key] || '';

    quizStepEl.innerHTML = `
        <p class="quiz_question">${t(step.question)}</p>
        <div class="quiz_options" role="radiogroup">
            ${step.options.map((opt, i) => `
                <label class="quiz_option${selected === opt.value ? ' is-selected' : ''}">
                    <input type="radio" name="quiz-${step.key}" value="${opt.value}" ${selected === opt.value ? 'checked' : ''}>
                    <span data-quiz-label="${opt.label}">${t(opt.label)}</span>
                </label>
            `).join('')}
        </div>
    `;

    quizStepEl.querySelectorAll('.quiz_option input').forEach((input) => {
        input.addEventListener('change', () => {
            quizAnswers[step.key] = input.value;
            quizStepEl.querySelectorAll('.quiz_option').forEach((l) => l.classList.remove('is-selected'));
            input.closest('.quiz_option')?.classList.add('is-selected');
        });
    });

    updateQuizProgress();
    if (quizBackBtn) quizBackBtn.hidden = quizIndex === 0;
    if (quizNextBtn) quizNextBtn.textContent = t('quiz.next');
}

function showQuizResult() {
    quizRecommended = computeQuizPackage();
    const resultKey = `quiz.result.${quizRecommended}`;

    if (quizStepEl) quizStepEl.hidden = true;
    if (quizActions) quizActions.hidden = true;
    if (quizResultEl) quizResultEl.hidden = false;
    if (quizResultText) quizResultText.textContent = t(resultKey);
    if (quizProgress) {
        [...quizProgress.children].forEach((dot) => dot.classList.add('is-done'));
    }
}

function resetQuizView() {
    if (quizStepEl) quizStepEl.hidden = false;
    if (quizActions) quizActions.hidden = false;
    if (quizResultEl) quizResultEl.hidden = true;
}

if (quizStepEl && quizNextBtn) {
    renderQuizStep();

    quizNextBtn.addEventListener('click', () => {
        const step = QUIZ_STEPS[quizIndex];
        if (!quizAnswers[step.key]) return;

        if (quizIndex < QUIZ_STEPS.length - 1) {
            quizIndex += 1;
            renderQuizStep();
            return;
        }

        showQuizResult();
    });

    quizBackBtn?.addEventListener('click', () => {
        if (quizIndex === 0) return;
        resetQuizView();
        quizIndex -= 1;
        renderQuizStep();
    });

    quizToFormBtn?.addEventListener('click', () => {
        setFormPackage(quizRecommended);
        scrollToSection('#contacts');
        trackGoal('quiz_submit');
    });

    window.addEventListener('hvze:langchange', () => {
        if (quizResultEl && !quizResultEl.hidden) {
            if (quizResultText) quizResultText.textContent = t(`quiz.result.${quizRecommended}`);
        } else {
            renderQuizStep();
        }
        if (quizBackBtn) quizBackBtn.textContent = t('quiz.back');
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

(function initPortfolioFilters() {
    const filters = document.querySelectorAll('.portfolio_filter[data-filter]');
    const cards = document.querySelectorAll('.portfolio_card[data-category]');
    if (!filters.length || !cards.length) return;

    filters.forEach((btn) => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            filters.forEach((b) => b.classList.toggle('is-active', b === btn));
            cards.forEach((card) => {
                const cats = card.dataset.category || '';
                const show = filter === 'all' || cats.split(/\s+/).includes(filter);
                card.classList.toggle('is-filtered-out', !show);
            });
        });
    });
})();
