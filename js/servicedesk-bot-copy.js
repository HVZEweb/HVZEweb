/**
 * Shared ServiceDesk Bot copy — keep in sync with hvzeweb-telegram-bot/src/copy.js
 */
(function (global) {
    'use strict';

    const SITE_URL = 'https://hvzeweb.netlify.app';

    const SOURCE_GREETING = {
        site: '🌐 Вы перешли с сайта HVZEweb',
        portfolio_demo: '🎨 Демо из портфолио — попробуйте оставить заявку',
        direct: '',
    };

    const COPY = {
        welcome(source) {
            const sourceLine =
                SOURCE_GREETING[source] ||
                (source && source !== 'direct' ? `🔗 Источник: ${source}` : '');
            const sourceBlock = sourceLine ? `\n${sourceLine}\n` : '\n';
            return (
                `✨ <b>ServiceDesk Bot</b>\n` +
                `<i>HVZEweb · веб-студия</i>` +
                `${sourceBlock}\n` +
                `Принимаю заявки <b>24/7</b>:\n` +
                `меню · цены · FAQ · связь с менеджером\n\n` +
                `👇 Выберите действие:`
            );
        },
        menu: '🏠 <b>Главное меню</b>\n\n👇 Чем могу помочь?',
        services:
            `📋 <b>Наши услуги</b>\n\n` +
            `🌐 Лендинги и корпоративные сайты\n` +
            `⚙️ WordPress под ключ\n` +
            `🛒 Интернет-магазины\n` +
            `🤖 Telegram-боты и автоматизация\n\n` +
            `💬 Нужна консультация? Нажмите «Оставить заявку»`,
        faq:
            `❓ <b>Частые вопросы</b>\n\n` +
            `⏱ <b>Сроки</b>\n` +
            `• Лендинг — 5–7 дней\n` +
            `• Бот — 3–5 дней\n\n` +
            `💳 <b>Оплата</b>\n` +
            `50% старт · 50% при сдаче\n\n` +
            `🛠 <b>Поддержка</b>\n` +
            `30 дней включены в Premium-пакет`,
        prices:
            `💰 <b>Стартовые цены</b>\n\n` +
            `📇 Визитка — от <b>7 000 ₽</b>\n` +
            `🚀 Лендинг — от <b>10 000 ₽</b>\n` +
            `🤖 Telegram-бот — от <b>15 000 ₽</b>\n\n` +
            `<i>Точная смета — после короткого брифа, без скрытых платежей.</i>`,
        step1: '📝 <b>Шаг 1 из 3</b>\n\nКак к вам обращаться?\n\n<i>Можно отменить в любой момент.</i>',
        step2(name) {
            return `📝 <b>Шаг 2 из 3</b>\n\nПриятно познакомиться, <b>${name}</b>!\n\nОпишите задачу своими словами:`;
        },
        step3: '📝 <b>Шаг 3 из 3</b>\n\nКуда отправить ответ?\n• email\n• @username в Telegram',
        quickContact:
            '✉️ <b>Связь с менеджером</b>\n\nНапишите email или @username — ответим в рабочий день (Пн–Пт, 10:00–19:00 МСК).',
        success:
            `✅ <b>Заявка принята!</b>\n\n` +
            `Менеджер свяжется в течение рабочего дня\n` +
            `<i>Пн–Пт, 10:00–19:00 МСК</i>\n\n` +
            `Спасибо, что выбрали <b>HVZEweb</b> 🙌`,
        cancelled: '🔄 Заявка отменена.\n\nВы снова в главном меню — выберите действие 👇',
        fallback: '👇 Выберите действие в меню или отправьте /start',
        adminLead(lead, source) {
            return (
                `👤 Имя: ${lead.name}\n` +
                `📋 Задача: ${lead.service}\n` +
                `📬 Контакт: ${lead.contact}\n` +
                `🔗 Источник: ${source || 'portfolio_demo'}`
            );
        },
        adminQuick(contact, source) {
            return `📬 Контакт: ${contact}\n🔗 Источник: ${source || 'portfolio_demo'}`;
        },
    };

    const MENUS = {
        main: [
            { label: '📋 Услуги', action: 'svc' },
            { label: '💰 Цены', action: 'price' },
            { label: '❓ FAQ', action: 'faq', full: true },
            { label: '📅 Оставить заявку', action: 'book', full: true },
            { label: '✉️ Написать менеджеру', action: 'contact', full: true },
        ],
        info: [
            { label: '📅 Оставить заявку', action: 'book', full: true },
            { label: '« Главное меню', action: 'menu', full: true },
        ],
        cancel: [{ label: '❌ Отменить заявку', action: 'cancel', full: true }],
    };

    global.SERVICEDESK_BOT = { SITE_URL, COPY, MENUS, SOURCE_GREETING };
})(window);
