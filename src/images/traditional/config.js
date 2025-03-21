const imageConfig = {
    "Qatari": [
        "4816f9380c71c04c575f0aa1cd7ca1ce.jpg",
        "images.jpg",
        "istockphoto-540525724-612x612.jpg",
        "white-qatari.jpg"
    ],
    "Emarati": [
        "4816f9380c71c04c575f0aa1cd7ca1ce.jpg",
        "images.jpg",
        "istockphoto-540525724-612x612.jpg",
        "white-qatari.jpg"
    ],
    "Omani": [
        "4816f9380c71c04c575f0aa1cd7ca1ce.jpg",
        "images.jpg",
        "istockphoto-540525724-612x612.jpg",
        "white-qatari.jpg"
    ],
    "Somali": [
        "4816f9380c71c04c575f0aa1cd7ca1ce.jpg",
        "images.jpg",
        "istockphoto-540525724-612x612.jpg",
        "white-qatari.jpg"
    ]
};

// Get images for a specific folder
function getImagesForFolder(folder) {
    return imageConfig[folder] || [];
}

// Get style name based on index
function getStyleName(index) {
    const styles = ['Classic', 'Modern', 'Premium', 'Traditional'];
    return styles[index % styles.length];
}

// Get price based on category and index
function getPrice(category, index) {
    const basePrice = {
        'Qatari': 149.99,
        'Emarati': 159.99,
        'Omani': 139.99,
        'Somali': 129.99
    };
    
    // Add some variation based on style
    const styleMultiplier = 1 + (index * 0.1);
    return (basePrice[category] * styleMultiplier).toFixed(2);
}

// Dispatch event when images are updated
function dispatchUpdateEvent() {
    window.dispatchEvent(new CustomEvent('imagesUpdated'));
}