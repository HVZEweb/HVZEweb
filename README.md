# HVZEweb — сайт студии

Одностраничный лендинг + демо-портфолио. Деплой на [Vercel](https://vercel.com).

## Быстрый старт (локально)

Статический сайт — достаточно открыть `index.html` в браузере или поднять любой static server:

```bash
npx serve .
```

## Деплой на Vercel

1. Создайте репозиторий на GitHub и запушьте этот проект.
2. На [vercel.com](https://vercel.com) → **Add New Project** → импорт репозитория.
3. Framework Preset: **Other** (или оставьте авто — статика + serverless).
4. Root Directory: корень репозитория (где лежит `index.html`).
5. Deploy.

### Переменные окружения (форма → Telegram)

В Vercel: **Project → Settings → Environment Variables**

| Переменная | Описание |
|---|---|
| `TELEGRAM_BOT_TOKEN` | Токен от [@BotFather](https://t.me/BotFather) |
| `TELEGRAM_CHAT_ID` | ID чата (личный или группы), куда слать заявки |

Без переменных форма откроет Telegram с текстом заявки (fallback).

Как узнать `CHAT_ID`: напишите боту, затем откройте  
`https://api.telegram.org/bot<TOKEN>/getUpdates`

### Свой домен

1. Vercel → **Domains** → добавьте `hvzeweb.ru`.
2. У регистратора домена пропишите DNS по инструкции Vercel.
3. Обновите `siteUrl` в `js/config.js` и canonical/OG в `index.html`, если домен другой.

### Настройки сайта

| Файл | Что менять |
|---|---|
| `js/config.js` | URL, Telegram, email, ID Яндекс.Метрики |
| `index.html` | canonical, og:url, og:image (если сменился домен) |
| `sitemap.xml`, `robots.txt` | URL сайта |

## Структура

```
index.html          — главная
privacy.html        — политика конфиденциальности
api/contact.js      — serverless: заявки в Telegram (Vercel)
portfolio/          — демо-примеры (визитка, лендинг, корпоратив, магазин, админка)
css/, js/, assets/  — стили, скрипты, изображения
```

## Лицензия

© HVZEweb. Все права на дизайн и код — владельцу проекта.
