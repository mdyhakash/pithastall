const products = [
    { id: 1, name: "Product 1", price: 100, image: "https://via.placeholder.com/150" },
    { id: 2, name: "Product 2", price: 200, image: "https://via.placeholder.com/150" },
    { id: 3, name: "Product 3", price: 300, image: "https://via.placeholder.com/150" },
    { id: 4, name: "Product 4", price: 400, image: "https://via.placeholder.com/150" },
    { id: 5, name: "Product 5", price: 500, image: "https://via.placeholder.com/150" },
    { id: 6, name: "Product 6", price: 600, image: "https://via.placeholder.com/150" },
    { id: 7, name: "Product 7", price: 700, image: "https://via.placeholder.com/150" },
    { id: 8, name: "Product 8", price: 800, image: "https://via.placeholder.com/150" },
    { id: 9, name: "Product 9", price: 900, image: "https://via.placeholder.com/150" },
    { id: 10, name: "Product 10", price: 1000, image: "https://via.placeholder.com/150" },
    { id: 11, name: "Product 11", price: 1100, image: "https://via.placeholder.com/150" },
    { id: 12, name: "Product 12", price: 1200, image: "https://via.placeholder.com/150" },
    { id: 13, name: "Product 13", price: 1300, image: "https://via.placeholder.com/150" },
    { id: 14, name: "Product 14", price: 1400, image: "https://via.placeholder.com/150" },
    { id: 15, name: "Product 15", price: 1500, image: "https://via.placeholder.com/150" },
    { id: 16, name: "Product 16", price: 1600, image: "https://via.placeholder.com/150" },
    { id: 17, name: "Product 17", price: 1700, image: "https://via.placeholder.com/150" },
    { id: 18, name: "Product 18", price: 1800, image: "https://via.placeholder.com/150" },
    { id: 19, name: "Product 19", price: 1900, image: "https://via.placeholder.com/150" },
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
        document.getElementById('logout-link').classList.remove('hidden');
        showPage('admin-page');
        renderOrders();
    }
}

function logout() {
    sessionStorage.removeItem('user');
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
            <h2>${product.name}</h2>
            <p>Price: BDT ${product.price}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        container.appendChild(card);
    });
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    alert(`${product.name} has been added to your cart.`);
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

    // Add order details to the `orders` array
    orders.push({
        customer: user.name,
        items: [...cart],
    });

    // Clear the cart and notify the user
    cart = [];
    alert('Order confirmed!');

    // Clear and update the cart view
    showCart();

    // Update admin view dynamically
    if (currentPage === 'admin-page') {
        renderOrders();
    }
}

function renderOrders() {
    const container = document.getElementById('orders-container');
    container.innerHTML = ''; // Clear existing orders
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
}
