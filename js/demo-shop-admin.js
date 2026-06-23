const PANEL_TITLES = {
    dashboard: 'Dashboard',
    orders: 'Заказы',
    products: 'Товары',
    customers: 'Клиенты',
    analytics: 'Аналитика',
    settings: 'Настройки',
};

const CHART_WEEK = [45, 62, 38, 78, 55, 92, 68];
const CHART_MONTH = [30, 42, 55, 48, 60, 72, 65, 58, 70, 85, 78, 90, 82, 75];

document.querySelectorAll('.admin_nav_item[data-panel]').forEach((btn) => {
    btn.addEventListener('click', () => {
        const panel = btn.dataset.panel;
        document.querySelectorAll('.admin_nav_item[data-panel]').forEach((b) => b.classList.toggle('is-active', b === btn));
        document.querySelectorAll('.admin_panel_view').forEach((v) => {
            v.hidden = v.id !== `panel-${panel}`;
        });
        document.getElementById('panel-title').textContent = PANEL_TITLES[panel] || panel;
    });
});

document.querySelectorAll('[data-chart]').forEach((tab) => {
    tab.addEventListener('click', () => {
        tab.closest('.admin_panel_tabs')?.querySelectorAll('.admin_panel_tab').forEach((t) => {
            t.classList.toggle('is-active', t === tab);
        });
        const chart = document.getElementById('sales-chart');
        if (!chart) return;
        const data = tab.dataset.chart === 'month' ? CHART_MONTH : CHART_WEEK;
        const labels = tab.dataset.chart === 'month'
            ? ['1', '3', '5', '7', '9', '11', '13', '15', '17', '19', '21', '23', '25', '27']
            : ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

        chart.innerHTML = data.map((h, i) => `
            <div class="admin_chart_bar_wrap">
                <div class="admin_chart_bar" style="height:${h}%"></div>
                <span class="admin_chart_label">${labels[i] || ''}</span>
            </div>
        `).join('');
    });
});

document.querySelectorAll('.admin_quick_btn, .admin_table_btn').forEach((btn) => {
    btn.addEventListener('click', () => {
        btn.style.borderColor = 'rgba(52, 211, 153, 0.5)';
        setTimeout(() => { btn.style.borderColor = ''; }, 400);
    });
});
