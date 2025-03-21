class CartManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.updateCartCount();
    }

    addToCart(item) {
        this.cart.push({
            ...item,
            id: Date.now(), // Unique ID for each cart item
            timestamp: new Date().toISOString()
        });
        this.saveCart();
        this.updateCartCount();
        this.showNotification('Item added to cart');
    }

    removeFromCart(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.saveCart();
        this.updateCartCount();
        this.showNotification('Item removed from cart');
    }

    updateCartCount() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.textContent = this.cart.length;
            cartCount.style.display = this.cart.length > 0 ? 'block' : 'none';
        }
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    getCart() {
        return this.cart;
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-4 right-4 bg-primary text-white px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-300';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateY(150%)';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    showCart() {
        const cartModal = document.createElement('div');
        cartModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        
        const cartContent = document.createElement('div');
        cartContent.className = 'bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto';
        
        let totalPrice = 0;
        const cartHTML = `
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold">Shopping Cart</h2>
                <button id="close-cart" class="text-gray-500 hover:text-gray-700">
                    <i class="ri-close-line text-2xl"></i>
                </button>
            </div>
            ${this.cart.length === 0 ? '<p class="text-gray-500">Your cart is empty</p>' : ''}
            <div class="space-y-4">
                ${this.cart.map(item => {
                    totalPrice += parseFloat(item.price);
                    return `
                        <div class="flex items-center gap-4 border-b pb-4">
                            <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded">
                            <div class="flex-1">
                                <h3 class="font-semibold">${item.name}</h3>
                                <p class="text-gray-600">${item.description}</p>
                                <p class="text-primary font-bold">$${item.price}</p>
                            </div>
                            <button class="remove-item text-red-500 hover:text-red-700" data-id="${item.id}">
                                <i class="ri-delete-bin-line text-xl"></i>
                            </button>
                        </div>
                    `;
                }).join('')}
            </div>
            ${this.cart.length > 0 ? `
                <div class="mt-6 border-t pt-4">
                    <div class="flex justify-between items-center mb-4">
                        <span class="font-semibold">Total:</span>
                        <span class="text-primary font-bold">$${totalPrice.toFixed(2)}</span>
                    </div>
                    <form id="checkout-form" class="mb-4">
                        <div class="mb-4">
                            <label class="block text-gray-700 mb-2">Your Name</label>
                            <input type="text" id="customer-name" required class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary">
                        </div>
                    </form>
                    <button id="checkout-button" class="w-full bg-primary text-white py-3 rounded-button hover:bg-opacity-90 transition">
                        Proceed to Checkout
                    </button>
                </div>
            ` : ''}
        `;

        cartContent.innerHTML = cartHTML;
        cartModal.appendChild(cartContent);
        document.body.appendChild(cartModal);

        // Event Listeners
        document.getElementById('close-cart').addEventListener('click', () => {
            cartModal.remove();
        });

        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                cartModal.remove();
            }
        });

        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', () => {
                const itemId = parseInt(button.dataset.id);
                this.removeFromCart(itemId);
                cartModal.remove();
                this.showCart();
            });
        });

        if (document.getElementById('checkout-button')) {
            document.getElementById('checkout-button').addEventListener('click', () => {
                const customerName = document.getElementById('customer-name').value;
                if (!customerName) {
                    alert('Please enter your name to proceed.');
                    return;
                }

                let message = `Hello! I would like to place an order:\n\n`;
                message += `Customer Name: ${customerName}\n\n`;
                message += `Order Details:\n`;
                this.cart.forEach(item => {
                    message += `\n- ${item.name}\n  Price: $${item.price}\n  Description: ${item.description}\n`;
                });
                message += `\nTotal Amount: $${totalPrice.toFixed(2)}`;
                message += `\n\nShipping Address: Nairobi, Kenya`;
                
                const phoneNumber = '254769199053';
                const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
            });
        }
    }
}

// Initialize cart manager
const cartManager = new CartManager();