// Debug flag
const DEBUG = true;

// Store data in memory
let traditionalItems = {};
let perfumeItems = {};
let specialOffers = [];

// Debug logger
function log(message, data = null) {
    if (DEBUG) {
        console.log(`[Debug] ${message}`, data || '');
    }
}

// Load existing configurations
async function loadConfigurations() {
    log('Loading configurations...');
    try {
        // Since we're including the config files in the HTML, they're already available
        if (typeof imageConfig !== 'undefined') {
            traditionalItems = imageConfig;
        }
        if (typeof perfumeConfig !== 'undefined') {
            perfumeItems = perfumeConfig;
        }

        // Display items based on current section
        displayCurrentSection();
    } catch (error) {
        console.error('Error loading configurations:', error);
        showNotification('Error loading products', 'error');
    }
}

// Display existing products
function displayExistingProducts() {
    log('Displaying existing products');

    // Display Traditional Items
    const traditionalContainer = document.getElementById('existing-traditional');
    if (traditionalContainer) {
        traditionalContainer.innerHTML = '';
        Object.entries(traditionalItems).forEach(([category, images]) => {
            images.forEach((image, index) => {
                const itemDiv = createProductItem({
                    type: 'traditional',
                    category,
                    image,
                    index
                });
                traditionalContainer.appendChild(itemDiv);
            });
        });
    }

    // Display Perfume Items
    const perfumesContainer = document.getElementById('existing-perfumes');
    if (perfumesContainer) {
        perfumesContainer.innerHTML = '';
        Object.entries(perfumeItems).forEach(([category, images]) => {
            images.forEach((image, index) => {
                const itemDiv = createProductItem({
                    type: 'perfumes',
                    category,
                    image,
                    index
                });
                perfumesContainer.appendChild(itemDiv);
            });
        });
    }
}

// Create product item element
function createProductItem({ type, category, image, index }) {
    const div = document.createElement('div');
    div.className = 'flex items-center gap-4 bg-white p-4 rounded-button';
    
    const imageUrl = `src/images/${type}/${category}/${image}`;
    const displayName = formatCategoryName(category);
    const price = type === 'traditional' ? getPrice(category, index) : getPrice(category, index);
    const styleName = getStyleName(index);
    
    div.innerHTML = `
        <img src="${imageUrl}" alt="${displayName}" class="w-20 h-20 object-cover rounded-button">
        <div class="flex-1">
            <h4 class="font-semibold">${displayName} ${styleName}</h4>
            <p class="text-gray-600">$${price}</p>
        </div>
        <div class="flex gap-2">
            <button onclick="editPrice('${type}', '${category}', ${index}, '${displayName} ${styleName}', ${price})"
                class="p-2 text-blue-600 hover:bg-blue-50 rounded-button transition-colors">
                <i class="ri-pencil-line"></i>
            </button>
            <button onclick="deleteItem('${type}', '${category}', ${index})"
                class="p-2 text-red-600 hover:bg-red-50 rounded-button transition-colors">
                <i class="ri-delete-bin-line"></i>
            </button>
        </div>
    `;
    return div;
}

// Load and display offers
function loadOffers() {
    const savedOffers = localStorage.getItem('specialOffers');
    if (savedOffers) {
        specialOffers = JSON.parse(savedOffers);
        displayOffers();
    }
}

// Display Offers
function displayOffers() {
    const container = document.getElementById('offer-items');
    if (!container) {
        log('Offers container not found');
        return;
    }

    log('Special offers:', specialOffers);
    
    container.innerHTML = '';
    specialOffers.forEach((offer, index) => {
        const offerDiv = document.createElement('div');
        offerDiv.className = 'bg-white rounded-button p-6 shadow-sm';
        offerDiv.innerHTML = `
            <div class="flex justify-between items-start">
                <div>
                    <h4 class="font-semibold text-lg text-gray-900">${offer.title}</h4>
                    <p class="text-gray-600 mt-1">${offer.description}</p>
                    <div class="mt-2">
                        <span class="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-button text-sm font-medium">
                            ${offer.discount}% OFF
                        </span>
                        <span class="text-sm text-gray-500 ml-2">
                            Valid until: ${new Date(offer.validUntil).toLocaleDateString()}
                        </span>
                    </div>
                </div>
                <button onclick="deleteOffer(${index})" 
                    class="text-red-600 hover:bg-red-50 p-2 rounded-button transition-colors">
                    <i class="ri-delete-bin-line"></i>
                </button>
            </div>
        `;
        container.appendChild(offerDiv);
    });
}

// Handle offer form submission
function handleOfferSubmit(e) {
    e.preventDefault();
    log('Submitting offer form');

    const form = e.target;
    const formData = new FormData(form);
    
    const offer = {
        title: formData.get('title'),
        description: formData.get('description'),
        discount: parseInt(formData.get('discount')),
        validUntil: formData.get('validUntil')
    };

    specialOffers.push(offer);
    form.reset();

    // Save to localStorage
    localStorage.setItem('specialOffers', JSON.stringify(specialOffers));

    displayOffers();
    showNotification('Special offer added successfully');
}

// Display current section
function displayCurrentSection() {
    const urlParams = new URLSearchParams(window.location.search);
    const section = urlParams.get('section') || 'existing';
    log('Displaying section:', section);
    
    showSection(section);
}

// Navigation functions
function showSection(sectionId) {
    log('Showing section:', sectionId);
    
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });

    // Show requested section
    const section = document.getElementById(`${sectionId}-section`);
    if (section) {
        section.classList.remove('hidden');

        // Toggle search visibility
        const searchContainer = document.getElementById('search-container');
        if (searchContainer) {
            searchContainer.classList.toggle('hidden', sectionId !== 'existing');
        }
    }

    // Update active state in navigation
    document.querySelectorAll('nav button').forEach(button => {
        const isActive = button.getAttribute('data-section') === sectionId;
        button.classList.toggle('bg-white/10', isActive);
    });

    // Refresh content
    refreshSectionContent(sectionId);
}

// Refresh section content
function refreshSectionContent(sectionId) {
    switch (sectionId) {
        case 'existing':
            displayExistingProducts();
            break;
        case 'offers':
            displayOffers();
            break;
    }
}

// Form handlers
async function handleTraditionalSubmit(e) {
    e.preventDefault();
    log('Submitting traditional form');

    const form = e.target;
    const formData = new FormData(form);
    formData.append('type', 'traditional');

    try {
        // Upload image
        const uploadResponse = await fetch('upload_image.php', {
            method: 'POST',
            body: formData
        });

        const uploadResult = await uploadResponse.json();
        if (!uploadResult.success) {
            throw new Error(uploadResult.message);
        }

        // Add to configuration
        const category = formData.get('category');
        if (!traditionalItems[category]) {
            traditionalItems[category] = [];
        }
        traditionalItems[category].push(uploadResult.filename);

        // Save price
        const price = parseFloat(formData.get('price'));
        savePrices('traditional', category, price);

        form.reset();
        showSection('existing');
        showNotification('Traditional thobe added successfully');
        
    } catch (error) {
        console.error('Error adding traditional item:', error);
        showNotification(error.message, 'error');
    }
}

async function handlePerfumeSubmit(e) {
    e.preventDefault();
    log('Submitting perfume form');

    const form = e.target;
    const formData = new FormData(form);
    formData.append('type', 'perfumes');

    try {
        // Upload image
        const uploadResponse = await fetch('upload_image.php', {
            method: 'POST',
            body: formData
        });

        const uploadResult = await uploadResponse.json();
        if (!uploadResult.success) {
            throw new Error(uploadResult.message);
        }

        // Add to configuration
        const category = formData.get('category');
        if (!perfumeItems[category]) {
            perfumeItems[category] = [];
        }
        perfumeItems[category].push(uploadResult.filename);

        // Save price
        const price = parseFloat(formData.get('price'));
        savePrices('perfumes', category, price);

        form.reset();
        showSection('existing');
        showNotification('Perfume added successfully');
        
    } catch (error) {
        console.error('Error adding perfume:', error);
        showNotification(error.message, 'error');
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    log('DOM Content Loaded');

    // Load configurations and offers
    loadConfigurations();
    loadOffers();

    // Form handlers
    document.getElementById('traditional-form')?.addEventListener('submit', handleTraditionalSubmit);
    document.getElementById('perfume-form')?.addEventListener('submit', handlePerfumeSubmit);
    document.getElementById('offer-form')?.addEventListener('submit', handleOfferSubmit);

    // Set minimum date for offer validity
    const validUntilInput = document.querySelector('input[name="validUntil"]');
    if (validUntilInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        validUntilInput.min = tomorrow.toISOString().split('T')[0];
    }

    // Mobile menu handler
    document.getElementById('mobile-menu-button')?.addEventListener('click', toggleMobileMenu);

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        const sidebar = document.getElementById('sidebar');
        const mobileMenuBtn = document.getElementById('mobile-menu-button');
        const backdrop = document.getElementById('sidebar-backdrop');
        
        if (!sidebar.contains(e.target) && !mobileMenuBtn?.contains(e.target)) {
            sidebar.classList.add('-translate-x-full');
            backdrop?.classList.add('hidden');
            document.body.style.overflow = '';
        }
    });

    // Navigation
    document.querySelectorAll('nav button[data-section]').forEach(button => {
        button.addEventListener('click', (e) => {
            const sectionId = button.getAttribute('data-section');
            if (sectionId) {
                showSection(sectionId);
                
                // Handle mobile menu
                if (window.innerWidth < 768) {
                    toggleMobileMenu();
                }
            }
        });
    });

    // Search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchText = e.target.value.toLowerCase();
            log('Searching for:', searchText);
            filterProducts(searchText);
        });
    }

    // Show initial section
    showSection('existing');
});

// Mobile menu functionality
function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    
    if (sidebar.classList.contains('-translate-x-full')) {
        sidebar.classList.remove('-translate-x-full');
        backdrop?.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    } else {
        sidebar.classList.add('-translate-x-full');
        backdrop?.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

// Helper functions
function formatCategoryName(category) {
    return category.split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function savePrices(type, category, price) {
    const storageKey = type === 'traditional' ? 'traditionalPrices' : 'perfumePrices';
    const savedPrices = JSON.parse(localStorage.getItem(storageKey) || '{}');
    savedPrices[category] = price;
    localStorage.setItem(storageKey, JSON.stringify(savedPrices));
}

// Filter products based on search text
function filterProducts(searchText) {
    const traditionalContainer = document.getElementById('existing-traditional');
    const perfumesContainer = document.getElementById('existing-perfumes');

    if (traditionalContainer) {
        Array.from(traditionalContainer.children).forEach(item => {
            const title = item.querySelector('h4')?.textContent.toLowerCase() || '';
            item.style.display = title.includes(searchText) ? '' : 'none';
        });
    }

    if (perfumesContainer) {
        Array.from(perfumesContainer.children).forEach(item => {
            const title = item.querySelector('h4')?.textContent.toLowerCase() || '';
            item.style.display = title.includes(searchText) ? '' : 'none';
        });
    }
}

function showNotification(message, type = 'success') {
    log('Showing notification:', message);
    const notification = document.createElement('div');
    notification.className = `fixed bottom-4 right-4 px-6 py-3 rounded-button shadow-lg transform transition-transform duration-300 z-50 ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.transform = 'translateY(150%)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}