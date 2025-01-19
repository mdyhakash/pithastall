const products = [
    { id: 1, name: "Product 1", price: 100, image: "https://via.placeholder.com/150" },
    { id: 2, name: "Product 2", price: 200, image: "https://via.placeholder.com/150" },
    // Repeat similar objects for products 3 to 20
    { id: 20, name: "Product 20", price: 2000, image: "https://via.placeholder.com/150" },
];

let currentPage = 'login-page';
let cart = [];
let orders = [];
const adminPassword = 'CSEPG25';

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
        sessionStorage.setItem('user', JSON.stringify({ type: 'customer', name }));
        document.getElementById('my-cart-link').classList.remove('hidden');
        showPage('products-page');
        renderProducts();
    } else if (type === 'admin') {
        const password = document.getElementById('admin-password').value;
        if (password !== adminPassword) {
            alert('Incorrect password.');
            return;
        }
        sessionStorage.setItem('user', JSON.stringify({ type: 'admin' }));
        showPage('admin-page');
        renderOrders();
    }
    document.getElementById('logout-link').classList.remove('hidden');
}

function logout() {
    sessionStorage.clear();
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
            <p>Price: BDT ${product.price}</p>
            <button onclick="addToCart(${product.id}, '${product.name}', ${product.price})">Add to Cart</button>
        `;
        container.appendChild(card);
    });
}

function addToCart(productId, productName, productPrice) {
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ id: productId, name: productName, price: productPrice, quantity: 1 });
    }
    alert(`${productName} added to cart.`);
}

function showCart() {
    showPage('cart-page');
    const container = document.getElementById('cart-container');
    container.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>BDT ${item.price}</td>
            <td>BDT ${item.quantity * item.price}</td>
            <td><button onclick="removeFromCart(${item.id})">Remove</button></td>
        `;
        container.appendChild(row);
        total += item.quantity * item.price;
    });
    document.getElementById('cart-total').textContent = `Subtotal: BDT ${total}`;
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    showCart();
}

function confirmOrder() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user || user.type !== 'customer') {
        alert('Only customers can place orders.');
        return;
    }
    if (cart.length === 0) {
        alert('Cart is empty.');
        return;
    }
    orders.push({ customer: user.name, items: [...cart] });
    cart = [];
    alert('Order confirmed!');
    showCart();
}

function renderOrders() {
    const container = document.getElementById('orders-container');
    container.innerHTML = '';
    orders.forEach(order => {
        order.items.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.customer}</td>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>BDT ${item.quantity * item.price}</td>
            `;
            container.appendChild(row);
        });
    });
