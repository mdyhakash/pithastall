let currentPage = 'login-page';
let cart = [];
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
        fetchProducts();
    } else if (type === 'admin') {
        const password = document.getElementById('admin-password').value;
        if (password !== adminPassword) {
            alert('Incorrect password.');
            return;
        }
        sessionStorage.setItem('user', JSON.stringify({ type: 'admin' }));
        showPage('admin-page');
        fetchOrders();
    }
    document.getElementById('logout-link').classList.remove('hidden');
}

function logout() {
    sessionStorage.clear();
    document.getElementById('my-cart-link').classList.add('hidden');
    document.getElementById('logout-link').classList.add('hidden');
    showPage('login-page');
}

async function fetchProducts() {
    const response = await fetch('/api/products');
    const products = await response.json();
    renderProducts(products);
}

function renderProducts(products) {
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
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>BDT ${item.price}</td>
            <td>BDT ${itemTotal}</td>
            <td><button onclick="removeFromCart(${item.id})">Remove</button></td>
        `;
        container.appendChild(row);
    });
    document.getElementById('cart-total').textContent = `Subtotal: BDT ${total}`;
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    showCart();
}

async function confirmOrder() {
    if (cart.length === 0) {
        alert('Your cart is empty.');
        return;
    }
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user || user.type !== 'customer') {
        alert('You must be logged in as a customer to place an order.');
        return;
    }
    const orderData = {
        customerName: user.name,
        cart: cart,
    };
    const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
    });
    if (response.ok) {
        alert('Order confirmed!');
        cart = [];
        showCart();
    } else {
        alert('Failed to confirm order.');
    }
}

async function fetchOrders() {
    const response = await fetch('/api/orders');
    const orders = await response.json();
    renderOrders(orders);
}

function renderOrders(orders) {
    const container = document.getElementById('orders-container');
    container.innerHTML = '';
    orders.forEach(order => {
        order.cart.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.customerName}</td>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>BDT ${item.price * item.quantity}</td>
            `;
            container.appendChild(row);
        });
    });
}