const perfumeConfig = {
    "arabian_oud": [
        "Cooc.jpg",
        "Creed.jpg",
        "Dior-Perfumes.jpg",
        "Elysium Roja.jpg"
    ],
    "french_perfumes": [
        "Cooc Chanele.jpg",
        "Creed.jpg",
        "Dior.jpg",
        "Elysium Roja.jpg"
    ],
    "luxury_brands": [
        "Cooc Chanele.jpg",
        "Creed.jpg",
        "Dior-Perfumes.jpg",
        "Elysium Roja.jpg"
    ]
};

// Get images for a specific folder
function getImagesForFolder(folder) {
    return perfumeConfig[folder] || [];
}

// Get style name based on index
function getStyleName(index) {
    const styles = ['Exclusive', 'Limited Edition', 'Premium', 'Signature'];
    return styles[index % styles.length];
}

// Get price based on category and index
function getPrice(category, index) {
    const basePrice = {
        'arabian_oud': 299.99,
        'french_perfumes': 349.99,
        'luxury_brands': 399.99
    };
    
    // Add some variation based on style
    const styleMultiplier = 1 + (index * 0.15);
    return (basePrice[category] * styleMultiplier).toFixed(2);
}

// Dispatch event when images are updated
function dispatchUpdateEvent() {
    window.dispatchEvent(new CustomEvent('imagesUpdated'));
}