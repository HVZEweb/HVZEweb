(function () {
    'use strict';

    const STORAGE_KEY = 'hvze_lang';
    const CIS_PREFIXES = ['ru', 'be', 'kk', 'uk', 'uz', 'ky', 'tg', 'az', 'hy', 'ka', 'mo', 'md'];

    function detectBrowserLang() {
        const config = window.SITE_CONFIG || {};
        const langs = navigator.languages?.length ? navigator.languages : [navigator.language || ''];
        for (const raw of langs) {
            const code = String(raw).toLowerCase().split('-')[0];
            if (CIS_PREFIXES.includes(code)) return 'ru';
            if (code === 'en') return 'en';
        }
        return config.defaultLang === 'ru' ? 'ru' : 'en';
    }

    function readStoredLang() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === 'en' || saved === 'ru') return saved;
        return null;
    }

    let currentLang = readStoredLang() || detectBrowserLang();
    const i18nDict = window.SITE_I18N || { en: {}, ru: {} };

    function t(key) {
        return i18nDict[currentLang]?.[key] ?? i18nDict.en?.[key] ?? key;
    }

    function applyLanguage(lang) {
        currentLang = lang === 'ru' ? 'ru' : 'en';
        localStorage.setItem(STORAGE_KEY, currentLang);
        document.documentElement.lang = currentLang;

        document.querySelectorAll('[data-i18n]').forEach((el) => {
            const key = el.getAttribute('data-i18n');
            if (key) el.textContent = t(key);
        });

        document.querySelectorAll('[data-i18n-html]').forEach((el) => {
            const key = el.getAttribute('data-i18n-html');
            if (key) el.innerHTML = t(key);
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (key) el.placeholder = t(key);
        });

        const titleKey = document.body?.dataset?.i18nTitle || 'meta.title';
        document.title = t(titleKey);

        document.querySelectorAll('.lang_switch_btn').forEach((btn) => {
            btn.classList.toggle('is-active', btn.dataset.lang === currentLang);
        });

        window.dispatchEvent(new CustomEvent('hvze:langchange', { detail: { lang: currentLang } }));
    }

    function bindLangSwitch(root) {
        (root || document).querySelectorAll('.lang_switch_btn').forEach((btn) => {
            if (btn.dataset.langBound) return;
            btn.dataset.langBound = '1';
            btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
        });
    }

    window.HVZE_LANG = {
        detectBrowserLang,
        getLang: () => currentLang,
        t,
        applyLanguage,
        bindLangSwitch,
    };

    bindLangSwitch();
    applyLanguage(currentLang);
})();
