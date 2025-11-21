// === ALL WEBSITE FUNCTIONALITY ===

// Product data
const products = [
    { id: 1, name: "Elegant Silk Blouse", price: 59.99, featured: true },
    { id: 2, name: "Designer Denim Jacket", price: 89.99, featured: true },
    { id: 3, name: "Floral Summer Dress", price: 69.99, featured: true },
    { id: 4, name: "Premium Leather Boots", price: 149.99, featured: false },
    { id: 5, name: "Classic White Sneakers", price: 79.99, featured: false },
    { id: 6, name: "Cashmere Winter Sweater", price: 99.99, featured: false },
    { id: 7, name: "Tailored Dress Pants", price: 49.99, featured: false },
    { id: 8, name: "Evening Cocktail Dress", price: 129.99, featured: false }
];

// Shopping cart
let cart = [];

// When page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

function initializeWebsite() {
    // Setup theme toggle
    setupTheme();
    
    // Load all products
    loadProducts();
    
    // Setup navigation
    setupNavigation();
    
    // Setup contact form
    setupContactForm();
    
    // Setup payment system
    setupPaymentSystem();
}

// Theme functionality
function setupTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Check for saved theme
    const savedTheme = localStorage.getItem('zuvani-theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('zuvani-theme', 'dark');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        } else {
            localStorage.setItem('zuvani-theme', 'light');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        }
    });
}

// Navigation between pages
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');
            showPage(targetPage);
        });
    });
    
    // Shop now button
    document.querySelector('.shop-now').addEventListener('click', function(e) {
        e.preventDefault();
        showPage('shop');
    });
}

// Show specific page
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show target page
    document.getElementById(pageId).classList.add('active');
}

// Load products into pages
function loadProducts() {
    loadFeaturedProducts();
    loadAllProducts();
}

function loadFeaturedProducts() {
    const container = document.getElementById('featured-products');
    const featuredProducts = products.filter(product => product.featured);
    
    container.innerHTML = featuredProducts.map(product => `
        <div class="product-card">
            <div class="product-img">Product Image</div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id}, '${product.name}', ${product.price})">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

function loadAllProducts() {
    const container = document.getElementById('all-products');
    
    container.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-img">Product Image</div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id}, '${product.name}', ${product.price})">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Cart functionality
function addToCart(productId, productName, productPrice) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    showNotification(`${productName} added to cart!`);
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const emptyMessage = document.getElementById('empty-cart-message');
    
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = `(${totalItems})`;
    
    // Update cart items display
    if (cart.length === 0) {
        emptyMessage.style.display = 'block';
        cartItems.innerHTML = '<p id="empty-cart-message">Your cart is empty</p>';
    } else {
        emptyMessage.style.display = 'none';
        
        let cartHTML = '';
        let subtotal = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            cartHTML += `
                <div class="cart-item">
                    <div class="cart-item-img"></div>
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        <p>Quantity: ${item.quantity}</p>
                    </div>
                    <div class="cart-item-price">$${itemTotal.toFixed(2)}</div>
                </div>
            `;
        });
        
        cartItems.innerHTML = cartHTML;
        
        // Update totals
        const shipping = 5.00;
        const total = subtotal + shipping;
        
        document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
    }
}

// Contact form
function setupContactForm() {
    document.getElementById('send-message').addEventListener('click', function() {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        if (name && email && message) {
            showNotification('Message sent! We\'ll get back to you soon 💫');
            document.querySelector('.contact-form').reset();
        } else {
            showNotification('Please fill in all fields', 'error');
        }
    });
}

// M-Pesa payment system
function setupPaymentSystem() {
    const paymentMethods = document.querySelectorAll('.payment-method');
    const paymentDetails = document.getElementById('payment-details');
    const mpesaSection = document.getElementById('mpesa-payment');
    const stkPrompt = document.getElementById('stk-prompt');
    
    // Payment method selection
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            paymentMethods.forEach(m => m.classList.remove('selected'));
            this.classList.add('selected');
            
            const methodType = this.getAttribute('data-method');
            paymentDetails.style.display = 'block';
            
            if (methodType === 'mpesa') {
                mpesaSection.style.display = 'block';
                stkPrompt.style.display = 'none';
            } else {
                mpesaSection.style.display = 'none';
                stkPrompt.style.display = 'none';
            }
        });
    });
    
    // M-Pesa payment request
    document.getElementById('request-stk').addEventListener('click', function() {
        const phoneNumber = document.getElementById('phone-number').value;
        const totalAmount = document.getElementById('cart-total').textContent;
        
        if (!phoneNumber) {
            showNotification('Please enter your phone number', 'error');
            return;
        }
        
        if (cart.length === 0) {
            showNotification('Your cart is empty', 'error');
            return;
        }
        
        // Validate phone number (Kenyan format)
        const phoneRegex = /^07[0-9]{8}$/;
        if (!phoneRegex.test(phoneNumber)) {
            showNotification('Please enter a valid Kenyan phone number (07XXXXXXXX)', 'error');
            return;
        }
        
        // Show STK prompt
        document.getElementById('stk-amount').textContent = totalAmount;
        mpesaSection.style.display = 'none';
        stkPrompt.style.display = 'block';
        
        showNotification(`M-Pesa payment request sent to ${phoneNumber}. Check your phone! 📱`);
    });
    
    // Confirm payment
    document.getElementById('confirm-payment').addEventListener('click', function() {
        const pin = document.getElementById('mpesa-pin').value;
        
        if (!pin || pin.length !== 4) {
            showNotification('Please enter a valid 4-digit PIN', 'error');
            return;
        }
        
        showNotification('Processing payment...', 'info');
        
        // Simulate payment processing
        setTimeout(() => {
            showNotification('Payment successful! 🎉 Thank you for your order!');
            
            // Clear cart and reset
            cart.length = 0;
            updateCartDisplay();
            stkPrompt.style.display = 'none';
            paymentDetails.style.display = 'none';
            document.querySelector('.payment-method.selected').classList.remove('selected');
            document.getElementById('phone-number').value = '';
            document.getElementById('mpesa-pin').value = '';
            
            // Return to home page
            showPage('home');
        }, 3000);
    });
}

// Notification system
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#FC8181' : '#00D4AA'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        font-weight: 600;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
