module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
        res.status(503).json({ error: 'Telegram not configured' });
        return;
    }

    const { name, contact, message } = req.body || {};

    if (!name || !contact || !message) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }

    const text = [
        '🆕 Новая заявка с сайта HVZEweb',
        '',
        `👤 Имя: ${name}`,
        `📬 Контакт: ${contact}`,
        '',
        `💬 Сообщение:\n${message}`,
    ].join('\n');

    try {
        const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text,
            }),
        });

        if (!response.ok) {
            res.status(502).json({ error: 'Telegram API error' });
            return;
        }

        res.status(200).json({ success: true });
    } catch {
        res.status(500).json({ error: 'Server error' });
    }
};
