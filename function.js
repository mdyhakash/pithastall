const adminPassword = 'CSEPG25';
let currentPage = 'login-page';
let cart = [];
let orders = [];
const products = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    price: Math.floor(Math.random() * 100) + 1,
    image: 'https://via.placeholder.com/150',
}));

function showPage(page) {
    document.getElementById(currentPage).classList.remove('active');
    document.getElementById(page).classList.add('active');
    currentPage = page;
}

function toggleLoginFields() {
    const userType = document.getElementById('user-type').value;
    document.getElementById('customer-login').classList.toggle('hidden', userType !== 'customer');
    document.getElementById('admin-login').classList.toggle('hidden', userType !== 'admin');
}

function login(type) {
    if (type === 'customer') {
        const name = document.getElementById('customer-name').value;
        if (!name) {
            alert('Please enter your name.');
            return;
        }
        localStorage.setItem('user', JSON.stringify({ type: 'customer', name }));
        document.getElementById('my-cart-link').classList.remove('hidden');
        showPage('products-page');
        renderProducts();
    } else if (type === 'admin') {
        const password = document.getElementById('admin-password').value;
        if (password !== adminPassword) {
            alert('Incorrect password.');
            return;
        }
        localStorage.setItem('user', JSON.stringify({ type: 'admin' }));
        showPage('admin-page');
        renderOrders();
    }
    document.getElementById('logout-link').classList.remove('hidden');
}

function logout() {
    localStorage.removeItem('user');
    document.getElementById('my-cart-link').classList.add('hidden');
    document.getElementById('logout-link').classList.add('hidden');
    showPage('login-page');
}

function renderProducts() {
    const container = document.getElementById('products-container');
    container.innerHTML = '';
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Price: $${product.price}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        container.appendChild(card);
    });
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existing = cart.find(c => c.id === productId);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    alert(`${product.name} added to cart.`);
}

function showCart() {
    showPage('cart-page');
    const container = document.getElementById('cart-container');
    container.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>$${item.price}</td>
            <td>$${itemTotal}</td>
            <td><button onclick="removeFromCart(${item.id})">Remove</button></td>
        `;
        container.appendChild(row);
    });
    document.getElementById('cart-total').textContent = `Subtotal: $${total}`;
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    showCart();
}

function confirmOrder() {
    const user = JSON.parse(localStorage.getItem('user'));
    cart.forEach(item => {
        orders.push({ ...item, customer: user.name });
    });
    cart = [];
    alert('Order confirmed!');
    showCart();
}

function renderOrders() {
    const container = document.getElementById('orders-container');
    container.innerHTML = '';
    orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.customer}</td>
            <td>${order.name}</td>
            <td>${order.quantity}</td>
            <td>$${order.price * order.quantity}</td>
        `;
        container.appendChild(row);
    });
}