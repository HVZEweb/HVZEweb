exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return json(405, { error: 'Method not allowed' });
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
        return json(503, { error: 'Telegram not configured' });
    }

    let body;
    try {
        body = JSON.parse(event.body || '{}');
    } catch {
        return json(400, { error: 'Invalid JSON' });
    }

    const name = body.name?.toString().trim();
    const contact = body.contact?.toString().trim();
    const message = body.message?.toString().trim();

    if (!name || !contact || !message) {
        return json(400, { error: 'Missing required fields' });
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
            return json(502, { error: 'Telegram API error' });
        }

        return json(200, { success: true });
    } catch {
        return json(500, { error: 'Server error' });
    }
};

function json(statusCode, data) {
    return {
        statusCode,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    };
}
