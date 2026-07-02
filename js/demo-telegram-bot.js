(function () {
    'use strict';

    const chat = document.getElementById('tg-chat');
    const keyboard = document.getElementById('tg-keyboard');
    const adminFeed = document.getElementById('tg-admin-feed');
    const input = document.getElementById('tg-input');
    const sendBtn = document.getElementById('tg-send');
    const resetBtn = document.getElementById('tg-reset');
    const stepsEl = document.getElementById('tg-steps');

    if (!chat || !keyboard) return;

    let step = 'menu';
    let lead = { name: '', service: '', contact: '' };

    const STEP_ORDER = ['menu', 'name', 'service', 'contact', 'done'];

    function nowTime() {
        const d = new Date();
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function scrollChat() {
        chat.scrollTop = chat.scrollHeight;
    }

    function updateSteps() {
        if (!stepsEl) return;
        const idx = STEP_ORDER.indexOf(step);
        stepsEl.querySelectorAll('.tg_step').forEach((el) => {
            const s = el.dataset.step;
            const sIdx = STEP_ORDER.indexOf(s);
            el.classList.toggle('is-active', s === step);
            el.classList.toggle('is-done', sIdx >= 0 && sIdx < idx);
        });
    }

    function addMessage(text, type, isHtml) {
        const row = document.createElement('div');
        row.className = `tg_msg_row tg_msg_row_${type}`;

        if (type === 'in') {
            const avatar = document.createElement('span');
            avatar.className = 'tg_msg_avatar';
            avatar.setAttribute('aria-hidden', 'true');
            avatar.textContent = 'S';
            row.appendChild(avatar);
        }

        const el = document.createElement('div');
        el.className = `tg_msg tg_msg_${type}`;
        const time = `<span class="tg_msg_time">${nowTime()}</span>`;
        if (isHtml) {
            el.innerHTML = text + time;
        } else {
            el.appendChild(document.createTextNode(text));
            el.insertAdjacentHTML('beforeend', time);
        }
        row.appendChild(el);
        chat.appendChild(row);
        scrollChat();
    }

    function showTyping(ms) {
        return new Promise((resolve) => {
            const row = document.createElement('div');
            row.className = 'tg_typing_row';
            row.innerHTML = `
                <span class="tg_msg_avatar" aria-hidden="true">S</span>
                <div class="tg_typing"><span></span><span></span><span></span></div>
            `;
            chat.appendChild(row);
            scrollChat();
            setTimeout(() => {
                row.remove();
                resolve();
            }, ms);
        });
    }

    async function botReply(text, delay) {
        if (delay) await showTyping(delay);
        addMessage(text, 'in', true);
    }

    function setKeyboard(buttons) {
        keyboard.innerHTML = '';
        keyboard.classList.toggle('is-hidden', !buttons.length);

        buttons.forEach((btn) => {
            const el = document.createElement('button');
            el.type = 'button';
            el.className = 'tg_key' + (btn.full ? ' tg_key_full' : '');
            el.textContent = btn.label;
            el.addEventListener('click', () => handleAction(btn.action, btn.label));
            keyboard.appendChild(el);
        });
    }

    function setInputMode(enabled, placeholder) {
        input.disabled = !enabled;
        sendBtn.disabled = !enabled;
        input.placeholder = placeholder || 'Сообщение…';
        if (enabled) input.focus();
    }

    function pushAdminAlert(title, body) {
        const empty = adminFeed.querySelector('.tg_admin_empty');
        if (empty) empty.remove();

        const el = document.createElement('article');
        el.className = 'tg_alert';
        el.innerHTML = `
            <p class="tg_alert_label">${title}</p>
            <p class="tg_alert_body">${body}</p>
            <p class="tg_alert_time">${nowTime()} · Cloudflare Workers</p>
        `;
        adminFeed.prepend(el);
    }

    async function handleAction(action, label) {
        if (label) addMessage(label, 'out');

        switch (action) {
            case 'services':
                await botReply('Мы делаем:\n\n• Лендинги и сайты\n• WordPress под ключ\n• Интернет-магазины\n• Telegram-боты и автоматизация\n\nВыберите действие 👇', 700);
                showMenu();
                break;

            case 'faq':
                await botReply('❓ <b>FAQ</b>\n\n<b>Сроки:</b> лендинг 5–7 дней, бот 3–5 дней.\n<b>Оплата:</b> 50% старт, 50% сдача.\n<b>Поддержка:</b> 30 дней в премиум-пакете.', 800);
                showMenu();
                break;

            case 'price':
                await botReply('💰 Стартовые цены:\n\nВизитка — от 7 000 ₽\nЛендинг — от 10 000 ₽\nБот — от 15 000 ₽\n\nТочная смета после брифа.', 700);
                showMenu();
                break;

            case 'book':
                step = 'name';
                updateSteps();
                await botReply('Отлично! Как к вам обращаться?', 600);
                setKeyboard([]);
                setInputMode(true, 'Ваше имя');
                break;

            case 'contact':
                step = 'contact_only';
                updateSteps();
                await botReply('Напишите email или @username в Telegram — менеджер ответит в рабочий день.', 600);
                setKeyboard([]);
                setInputMode(true, 'Email или @username');
                break;

            default:
                showMenu();
        }
    }

    function showMenu() {
        step = 'menu';
        updateSteps();
        setInputMode(false);
        setKeyboard([
            { label: '📋 Услуги', action: 'services' },
            { label: '📅 Оставить заявку', action: 'book' },
            { label: '❓ FAQ', action: 'faq' },
            { label: '💰 Цены', action: 'price' },
            { label: '✉️ Написать менеджеру', action: 'contact', full: true },
        ]);
    }

    async function handleUserText(text) {
        const value = text.trim();
        if (!value) return;

        addMessage(value, 'out');
        input.value = '';

        if (step === 'name') {
            lead.name = value;
            step = 'service';
            updateSteps();
            await botReply(`Приятно познакомиться, <b>${value}</b>! Какая задача у вас?`, 650);
            setInputMode(true, 'Опишите задачу');
            return;
        }

        if (step === 'service') {
            lead.service = value;
            step = 'contact';
            updateSteps();
            await botReply('Куда отправить ответ — email или Telegram (@username)?', 600);
            setInputMode(true, 'email@… или @username');
            return;
        }

        if (step === 'contact' || step === 'contact_only') {
            lead.contact = value;
            const isQuick = step === 'contact_only';
            step = 'done';
            updateSteps();
            await botReply('✅ Заявка принята! Менеджер свяжется в течение рабочего дня.\n\nСпасибо, что написали в <b>ServiceDesk Bot</b> — демо HVZEweb.', 800);

            pushAdminAlert(
                isQuick ? '✉️ Сообщение из Telegram-бота' : '🆕 Новая заявка из Telegram-бота',
                isQuick
                    ? `📬 Контакт: ${value}\n🔗 Источник: portfolio_demo`
                    : `👤 Имя: ${lead.name}\n📋 Задача: ${lead.service}\n📬 Контакт: ${value}\n🔗 Источник: portfolio_demo`
            );

            if (window.demoToast) {
                window.demoToast('Заявка отправлена — в Telegram уходит так же');
            }

            lead = { name: '', service: '', contact: '' };
            step = 'menu';
            setInputMode(false);
            showMenu();
        }
    }

    async function initChat() {
        await botReply('👋 Добро пожаловать в <b>ServiceDesk Bot</b>!\n\nПомогаю принимать заявки 24/7: меню, FAQ, запись и мгновенные уведомления менеджеру.', 900);
        showMenu();
    }

    function resetDemo() {
        chat.innerHTML = '';
        adminFeed.innerHTML = `
            <div class="tg_admin_empty">
                <span class="tg_admin_empty_icon" aria-hidden="true">📭</span>
                <p>Здесь появятся уведомления, когда клиент оставит заявку.</p>
            </div>
        `;
        lead = { name: '', service: '', contact: '' };
        step = 'menu';
        input.value = '';
        setInputMode(false);
        updateSteps();
        initChat();
    }

    sendBtn.addEventListener('click', () => handleUserText(input.value));
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !input.disabled) handleUserText(input.value);
    });
    resetBtn?.addEventListener('click', resetDemo);

    updateSteps();
    initChat();
})();
