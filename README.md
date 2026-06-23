# HVZEweb

**Студия веб-разработки** — создаём современные сайты для бизнеса и частных клиентов.  
От идеи до запуска: быстро, прозрачно, с акцентом на результат.

[![Сайт](https://img.shields.io/badge/Сайт-hvzeweb.netlify.app-B8A88A?style=for-the-badge)](https://hvzeweb.netlify.app)
[![Telegram](https://img.shields.io/badge/Telegram-@HVZEweb-26A5E4?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/HVZEweb)
[![Email](https://img.shields.io/badge/Email-hvzeweb%40mail.ru-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:hvzeweb@mail.ru)

---

## О нас

Мы разрабатываем сайты, которые **работают на бизнес** — привлекают клиентов, удобны на телефоне и запускаются в понятные сроки.

- Прозрачные цены без скрытых доплат
- Адаптив под все устройства
- Форма заявок с уведомлением в Telegram
- Базовая SEO-настройка
- Бесплатная консультация и смета

**Сайт:** [hvzeweb.netlify.app](https://hvzeweb.netlify.app)

---

## Услуги и цены

| Пакет | Описание | Цена | Срок |
|-------|----------|------|------|
| **Визитка** | 1 экран + контакты | от 7 000 ₽ | 2–3 дня |
| **Старт** | Лендинг до 6 блоков | от 10 000 ₽ | 5–7 дней |
| **Бизнес** | Корпоративный сайт до 7 страниц | от 28 000 ₽ | 10–14 дней |
| **Премиум** | Интернет-магазин, CMS, админка | от 55 000 ₽ | от 3 недель |

---

## Примеры работ

Демо-версии доступны прямо на сайте:

| Проект | Описание |
|--------|----------|
| [Визитка](https://hvzeweb.netlify.app/portfolio/example-vizitka.html) | Премиальная одностраничная визитка |
| [Лендинг](https://hvzeweb.netlify.app/portfolio/example-landing.html) | Продающая страница с акцентом на конверсию |
| [Корпоратив](https://hvzeweb.netlify.app/portfolio/example-corporate.html) | Многостраничный сайт компании |
| [Магазин](https://hvzeweb.netlify.app/portfolio/example-shop.html) | Интернет-магазин с каталогом |
| [Админ-панель](https://hvzeweb.netlify.app/portfolio/example-shop-admin.html) | Панель управления магазином |

---

## Стек технологий

```
HTML5 · CSS3 · JavaScript (Vanilla)
Netlify Functions · Telegram Bot API
```

| Категория | Технологии |
|-----------|------------|
| Frontend | HTML, CSS, JavaScript без фреймворков |
| Backend | Netlify Serverless Functions |
| Интеграции | Telegram (уведомления о заявках) |
| Деплой | [Netlify](https://hvzeweb.netlify.app) · [GitHub](https://github.com/HVZEweb/HVZEweb) |

---

## Структура проекта

```
portfolio/
├── index.html          # Главная страница
├── css/                # Стили
├── js/                 # Скрипты и конфиг
├── assets/             # Изображения, favicon, OG
├── portfolio/          # Демо-проекты
├── netlify/
│   └── functions/      # Serverless: форма → Telegram
├── netlify.toml        # Конфиг Netlify (headers, redirects)
└── privacy.html        # Политика конфиденциальности
```

---

## Локальный запуск

Клонировать репозиторий и открыть `index.html` в браузере или через локальный сервер:

```bash
git clone https://github.com/HVZEweb/HVZEweb.git
cd HVZEweb
```

Для формы обратной связи на Netlify нужны переменные окружения (см. `.env.example`):

| Переменная | Описание |
|------------|----------|
| `TELEGRAM_BOT_TOKEN` | Токен бота от [@BotFather](https://t.me/BotFather) |
| `TELEGRAM_CHAT_ID` | ID чата для получения заявок |

---

## Связаться

| Канал | Ссылка |
|-------|--------|
| Сайт | [hvzeweb.netlify.app](https://hvzeweb.netlify.app) |
| Telegram | [@HVZEweb](https://t.me/HVZEweb) |
| Email | [hvzeweb@mail.ru](mailto:hvzeweb@mail.ru) |
| GitHub | [@HVZEweb](https://github.com/HVZEweb) |

Оставьте заявку на сайте — ответим в течение рабочего дня.

---

<p align="center">
  <sub>© 2026 HVZEweb · Разработка сайтов для бизнеса</sub>
</p>
