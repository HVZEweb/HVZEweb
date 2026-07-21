function pdToast(msg) {
    let el = document.getElementById('pd-toast');
    if (!el) {
        el = document.createElement('div');
        el.id = 'pd-toast';
        el.className = 'demo_toast';
        document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('is-visible');
    setTimeout(() => el.classList.remove('is-visible'), 2400);
}

function initAiChat(opts) {
    const chat = document.getElementById('pd-chat');
    const input = document.getElementById('pd-input');
    const send = document.getElementById('pd-send');
    if (!chat || !input) return;

    const replies = opts.replies || {};
    const defaultReply = opts.defaultReply || 'Got it — in production this connects to OpenAI API with your knowledge base.';

    function addMsg(text, role) {
        const div = document.createElement('div');
        div.className = `pd_msg pd_msg_${role}`;
        div.textContent = text;
        chat.appendChild(div);
        chat.scrollTop = chat.scrollHeight;
    }

    function showTyping() {
        const t = document.createElement('div');
        t.className = 'pd_msg_typing';
        t.id = 'pd-typing';
        t.innerHTML = '<span></span><span></span><span></span>';
        chat.appendChild(t);
        chat.scrollTop = chat.scrollHeight;
    }

    function hideTyping() {
        document.getElementById('pd-typing')?.remove();
    }

    function handleSend() {
        const text = input.value.trim();
        if (!text) return;
        addMsg(text, 'user');
        input.value = '';
        showTyping();
        setTimeout(() => {
            hideTyping();
            const key = Object.keys(replies).find((k) => text.toLowerCase().includes(k));
            addMsg(replies[key] || defaultReply, 'bot');
        }, 900);
    }

    send?.addEventListener('click', handleSend);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); handleSend(); }
    });

    document.querySelectorAll('[data-pd-prompt]').forEach((btn) => {
        btn.addEventListener('click', () => {
            input.value = btn.dataset.pdPrompt;
            handleSend();
        });
    });
}

function initBooking() {
    document.querySelectorAll('.pd_day_avail').forEach((day) => {
        day.addEventListener('click', () => {
            document.querySelectorAll('.pd_day_avail').forEach((d) => d.classList.remove('is-selected'));
            day.classList.add('is-selected');
        });
    });
    document.querySelectorAll('.pd_slot').forEach((slot) => {
        slot.addEventListener('click', () => {
            document.querySelectorAll('.pd_slot').forEach((s) => s.classList.remove('is-selected'));
            slot.classList.add('is-selected');
        });
    });
    document.getElementById('pd-book')?.addEventListener('click', () => {
        const day = document.querySelector('.pd_day_avail.is-selected');
        const slot = document.querySelector('.pd_slot.is-selected');
        if (!day || !slot) {
            pdToast('Select date and time');
            return;
        }
        pdToast(`Booked: ${day.textContent} June, ${slot.textContent} ✓`);
    });
}

function initPdfChat() {
    const upload = document.getElementById('pd-upload');
    const chat = document.getElementById('pd-chat');
    if (!upload || !chat) return;

    upload.addEventListener('click', () => {
        upload.classList.add('has-file');
        upload.innerHTML = '📄 contract-demo.pdf · 24 pages · indexed';
        chat.innerHTML = '';
        const bot = document.createElement('div');
        bot.className = 'pd_msg pd_msg_bot';
        bot.textContent = 'PDF indexed. Ask anything about the document — e.g. payment terms or deadlines.';
        chat.appendChild(bot);
    });

    initAiChat({
        defaultReply: 'According to section 4.2: payment within 14 days after invoice. Penalty — 0.1% per day.',
        replies: {
            payment: 'Payment terms: 14 days net. Early payment discount 2% if paid within 7 days.',
            deadline: 'Project deadline: 45 business days from contract signing (section 3.1).',
            penalty: 'Late delivery penalty: 0.05% of contract value per day, max 10%.',
        },
    });
}

function initDocGen() {
    const preview = document.getElementById('pd-doc-preview');
    const fields = ['client', 'amount', 'service', 'date'];

    function render() {
        const data = {};
        fields.forEach((f) => {
            data[f] = document.getElementById(`pd-field-${f}`)?.value || '—';
        });
        if (!preview) return;
        preview.innerHTML = `
            <h3>Commercial Proposal</h3>
            <p><strong>Client:</strong> ${data.client}</p>
            <p><strong>Service:</strong> ${data.service}</p>
            <p><strong>Amount:</strong> ${data.amount}</p>
            <p><strong>Valid until:</strong> ${data.date}</p>
            <p style="margin-top:16px;color:#666">Terms: 50% prepayment, 50% on delivery. Timeline per SOW.</p>
        `;
    }

    fields.forEach((f) => {
        document.getElementById(`pd-field-${f}`)?.addEventListener('input', render);
    });

    document.getElementById('pd-gen-pdf')?.addEventListener('click', () => {
        render();
        pdToast('PDF generated — demo mode');
    });

    render();
}

document.addEventListener('DOMContentLoaded', () => {
    const mode = document.body.dataset.pdMode;
    if (mode === 'ai-sales') initAiChat({
        defaultReply: 'I can prepare a tailored offer. What budget and timeline are you working with?',
        replies: {
            price: 'Standard MVP package starts at $2,500 — landing + admin + Telegram in 5–7 days.',
            timeline: 'Typical MVP: 3–7 days for landing, 2 weeks for CRM or AI integration.',
            integration: 'We integrate OpenAI, Stripe, Google Sheets, Telegram and webhooks — no vendor lock-in.',
            crm: 'CRM includes pipeline, client cards, tasks and Telegram alerts for new leads.',
        },
    });
    if (mode === 'booking') initBooking();
    if (mode === 'pdf-chat') initPdfChat();
    if (mode === 'doc-gen') initDocGen();
});
