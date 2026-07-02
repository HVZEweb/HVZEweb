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

    const bot = window.SERVICEDESK_BOT || {};
    const COPY = bot.COPY || {};
    const MENUS = bot.MENUS || { main: [], info: [], cancel: [] };
    const DEMO_SOURCE = 'portfolio_demo';

    let step = 'menu';
    let lead = { name: '', service: '', contact: '' };

    const STEP_ORDER = ['menu', 'name', 'service', 'contact', 'done'];

    function nowTime() {
        const d = new Date();
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function mskTime() {
        return new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });
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
            if (btn.action === 'cancel') el.classList.add('tg_key_cancel');
            if (btn.action === 'menu') el.classList.add('tg_key_muted');
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
            <p class="tg_alert_time">${mskTime()} MSK · Cloudflare Workers</p>
        `;
        adminFeed.prepend(el);
    }

    async function handleAction(action, label) {
        if (label && action !== 'menu') addMessage(label, 'out');

        switch (action) {
            case 'svc':
                await botReply(COPY.services || '', 700);
                setKeyboard(MENUS.info);
                break;

            case 'faq':
                await botReply(COPY.faq || '', 800);
                setKeyboard(MENUS.info);
                break;

            case 'price':
                await botReply(COPY.prices || '', 700);
                setKeyboard(MENUS.info);
                break;

            case 'book':
                step = 'name';
                updateSteps();
                await botReply(COPY.step1 || '', 600);
                setKeyboard(MENUS.cancel);
                setInputMode(true, 'Ваше имя');
                break;

            case 'contact':
                step = 'contact_only';
                updateSteps();
                await botReply(COPY.quickContact || '', 600);
                setKeyboard(MENUS.cancel);
                setInputMode(true, 'Email или @username');
                break;

            case 'menu':
                step = 'menu';
                updateSteps();
                await botReply(COPY.menu || '', 500);
                showMainMenu();
                break;

            case 'cancel':
                step = 'menu';
                lead = { name: '', service: '', contact: '' };
                updateSteps();
                setInputMode(false);
                await botReply(COPY.cancelled || '', 500);
                showMainMenu();
                break;

            default:
                showMainMenu();
        }
    }

    function showMainMenu() {
        step = 'menu';
        updateSteps();
        setInputMode(false);
        setKeyboard(MENUS.main);
    }

    async function handleUserText(text) {
        const value = text.trim();
        if (!value) return;

        if (step !== 'menu' && (value === '❌ Отмена' || value === '/cancel')) {
            await handleAction('cancel');
            return;
        }

        addMessage(value, 'out');
        input.value = '';

        if (step === 'name') {
            lead.name = value;
            step = 'service';
            updateSteps();
            await botReply(COPY.step2 ? COPY.step2(value) : '', 650);
            setKeyboard(MENUS.cancel);
            setInputMode(true, 'Опишите задачу');
            return;
        }

        if (step === 'service') {
            lead.service = value;
            step = 'contact';
            updateSteps();
            await botReply(COPY.step3 || '', 600);
            setKeyboard(MENUS.cancel);
            setInputMode(true, 'email@… или @username');
            return;
        }

        if (step === 'contact' || step === 'contact_only') {
            lead.contact = value;
            const isQuick = step === 'contact_only';
            step = 'done';
            updateSteps();
            await botReply(COPY.success || '', 800);

            pushAdminAlert(
                isQuick ? '✉️ Сообщение из бота' : '🆕 Новая заявка',
                isQuick
                    ? COPY.adminQuick?.(value, DEMO_SOURCE) || `📬 Контакт: ${value}`
                    : COPY.adminLead?.(lead, DEMO_SOURCE) || `${lead.name} · ${value}`
            );

            if (window.demoToast) {
                window.demoToast('Заявка отправлена — в Telegram уходит так же');
            }

            lead = { name: '', service: '', contact: '' };
            step = 'menu';
            setInputMode(false);
            showMainMenu();
        }
    }

    async function initChat() {
        await botReply(COPY.welcome ? COPY.welcome(DEMO_SOURCE) : '', 900);
        showMainMenu();
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
