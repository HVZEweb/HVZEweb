const PRODUCTS = [
    { id: 1, name: 'Крем для лица Hydra', category: 'skincare', catLabel: 'Уход', price: 2490, oldPrice: null, img: 1, badge: 'new' },
    { id: 2, name: 'Сыворотка Vitamin C', category: 'skincare', catLabel: 'Уход', price: 1890, oldPrice: 2290, img: 2, badge: 'sale' },
    { id: 3, name: 'Свеча Cedar & Sage', category: 'home', catLabel: 'Дом', price: 1290, oldPrice: null, img: 3, badge: null },
    { id: 4, name: 'Масло для тела Silk', category: 'body', catLabel: 'Тело', price: 1690, oldPrice: null, img: 4, badge: null },
    { id: 5, name: 'Набор «Утро»', category: 'skincare', catLabel: 'Набор', price: 4490, oldPrice: 5290, img: 5, badge: 'sale' },
    { id: 6, name: 'Диффузор Linen', category: 'home', catLabel: 'Дом', price: 2190, oldPrice: null, img: 6, badge: 'new' },
];

let cart = [];
let activeFilter = 'all';
let maxPrice = 5000;
let searchQuery = '';

const grid = document.getElementById('product-grid');
const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cart-items');
const cartFoot = document.getElementById('cart-foot');
const cartTotal = document.getElementById('cart-total');
const resultsCount = document.getElementById('results-count');
const toast = document.getElementById('shop-toast');

function formatPrice(n) {
    return n.toLocaleString('ru-RU') + ' ₽';
}

function getFilteredProducts() {
    let list = PRODUCTS.filter((p) => {
        const matchCat = activeFilter === 'all' || p.category === activeFilter || (activeFilter === 'sale' && p.oldPrice);
        const matchPrice = p.price <= maxPrice;
        const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCat && matchPrice && matchSearch;
    });

    const sort = document.getElementById('sort-select')?.value || 'popular';
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));

    return list;
}

function renderProducts() {
    const list = getFilteredProducts();
    resultsCount.textContent = list.length;

    if (!list.length) {
        grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;padding:48px;color:#6f6c68">Ничего не найдено — попробуйте другой фильтр</p>';
        return;
    }

    grid.innerHTML = list.map((p) => `
        <article class="shop_card" data-id="${p.id}">
            ${p.badge === 'sale' ? '<span class="shop_card_badge">Sale</span>' : ''}
            ${p.badge === 'new' ? '<span class="shop_card_badge shop_card_badge_new">New</span>' : ''}
            <div class="shop_card_img shop_card_img_${p.img}">
                <div class="shop_card_quick">
                    <button type="button" class="shop_card_quick_btn" data-add="${p.id}">Быстрый просмотр</button>
                </div>
            </div>
            <div class="shop_card_body">
                <p class="shop_card_category">${p.catLabel}</p>
                <h3 class="shop_card_title">${p.name}</h3>
                <div class="shop_card_footer">
                    <div>
                        <span class="shop_card_price">${formatPrice(p.price)}</span>
                        ${p.oldPrice ? `<span class="shop_card_price_old">${formatPrice(p.oldPrice)}</span>` : ''}
                    </div>
                    <button type="button" class="shop_add_btn" data-add="${p.id}" aria-label="В корзину">+</button>
                </div>
            </div>
        </article>
    `).join('');
}

function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('is-visible');
    setTimeout(() => toast.classList.remove('is-visible'), 2200);
}

function addToCart(id) {
    const product = PRODUCTS.find((p) => p.id === Number(id));
    if (!product) return;

    const existing = cart.find((c) => c.id === product.id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    updateCart();
    showToast(`${product.name} — в корзине`);
}

function updateCart() {
    const totalItems = cart.reduce((s, c) => s + c.qty, 0);
    const totalSum = cart.reduce((s, c) => s + c.price * c.qty, 0);

    if (totalItems > 0) {
        cartCount.hidden = false;
        cartCount.textContent = totalItems;
    } else {
        cartCount.hidden = true;
    }

    if (!cart.length) {
        cartItems.innerHTML = '<p class="shop_cart_empty">Корзина пуста — добавьте что-нибудь приятное</p>';
        cartFoot.hidden = true;
        return;
    }

    cartFoot.hidden = false;
    cartTotal.textContent = formatPrice(totalSum);

    cartItems.innerHTML = cart.map((c) => `
        <div class="shop_cart_item" data-cart-id="${c.id}">
            <div class="shop_cart_item_img shop_card_img_${c.img}"></div>
            <div class="shop_cart_item_info">
                <p class="shop_cart_item_name">${c.name}</p>
                <p class="shop_cart_item_price">${formatPrice(c.price)}</p>
                <div class="shop_cart_item_qty">
                    <button type="button" data-qty-minus="${c.id}">−</button>
                    <span>${c.qty}</span>
                    <button type="button" data-qty-plus="${c.id}">+</button>
                </div>
                <button type="button" class="shop_cart_item_remove" data-remove="${c.id}">Удалить</button>
            </div>
        </div>
    `).join('');
}

function openCart() {
    document.getElementById('cart-drawer').classList.add('is-open');
    document.getElementById('cart-overlay').classList.add('is-open');
    document.body.classList.add('cart-open');
}

function closeCart() {
    document.getElementById('cart-drawer').classList.remove('is-open');
    document.getElementById('cart-overlay').classList.remove('is-open');
    document.body.classList.remove('cart-open');
}

function openFilters() {
    document.getElementById('filter-drawer').classList.add('is-open');
    document.getElementById('filter-overlay').classList.add('is-open');
    document.body.classList.add('filter-open');
}

function closeFilters() {
    document.getElementById('filter-drawer').classList.remove('is-open');
    document.getElementById('filter-overlay').classList.remove('is-open');
    document.body.classList.remove('filter-open');
}

document.querySelectorAll('.shop_filter_btn_item[data-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
        activeFilter = btn.dataset.filter;
        document.querySelectorAll('.shop_filter_btn_item[data-filter]').forEach((b) => b.classList.toggle('is-active', b === btn));
        renderProducts();
        closeFilters();
    });
});

const drawerList = document.getElementById('filter-drawer-list');
if (drawerList) {
    drawerList.innerHTML = document.querySelector('.shop_sidebar .shop_filter_list')?.innerHTML || '';
    drawerList.querySelectorAll('.shop_filter_btn_item').forEach((btn) => {
        btn.addEventListener('click', () => {
            activeFilter = btn.dataset.filter;
            document.querySelectorAll('.shop_filter_btn_item[data-filter]').forEach((b) => {
                b.classList.toggle('is-active', b.dataset.filter === activeFilter);
            });
            renderProducts();
            closeFilters();
        });
    });
}

document.getElementById('price-range')?.addEventListener('input', (e) => {
    maxPrice = Number(e.target.value);
    document.getElementById('price-max-label').textContent = `до ${maxPrice.toLocaleString('ru-RU')}`;
    renderProducts();
});

document.getElementById('sort-select')?.addEventListener('change', renderProducts);

document.getElementById('shop-search')?.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim();
    renderProducts();
});

grid?.addEventListener('click', (e) => {
    const addBtn = e.target.closest('[data-add]');
    if (addBtn) addToCart(addBtn.dataset.add);
});

cartItems?.addEventListener('click', (e) => {
    const minus = e.target.closest('[data-qty-minus]');
    const plus = e.target.closest('[data-qty-plus]');
    const remove = e.target.closest('[data-remove]');

    if (minus) {
        const item = cart.find((c) => c.id === Number(minus.dataset.qtyMinus));
        if (item) {
            item.qty -= 1;
            if (item.qty <= 0) cart = cart.filter((c) => c.id !== item.id);
            updateCart();
        }
    }
    if (plus) {
        const item = cart.find((c) => c.id === Number(plus.dataset.qtyPlus));
        if (item) { item.qty += 1; updateCart(); }
    }
    if (remove) {
        cart = cart.filter((c) => c.id !== Number(remove.dataset.remove));
        updateCart();
    }
});

document.getElementById('cart-open')?.addEventListener('click', openCart);
document.getElementById('cart-close')?.addEventListener('click', closeCart);
document.getElementById('cart-overlay')?.addEventListener('click', closeCart);
document.getElementById('filter-open')?.addEventListener('click', openFilters);
document.getElementById('filter-close')?.addEventListener('click', closeFilters);
document.getElementById('filter-overlay')?.addEventListener('click', closeFilters);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeCart(); closeFilters(); }
});

renderProducts();
