
// Select HTML Elements

const productContainer = document.getElementById("productContainer");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const cartToggle = document.getElementById("cartToggle");
const closeCart = document.getElementById("closeCart");
const cartSidebar = document.getElementById("cartSidebar");
const cartOverlay = document.getElementById("cartOverlay");

const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

const productTotal = document.getElementById("productTotal");
const noProducts = document.getElementById("noProducts");
const checkoutBtn = document.getElementById("checkoutBtn");

// Store Products and Cart

let products = [];
let cart = [];

// Format prices in Indian Rupees

function formatPrice(price) {
    return "₹" + price.toLocaleString("en-IN");
}

// Fetch Products from JSON File

async function loadProducts() {
    try {
        const response = await fetch("products.json");

        if (!response.ok) {
            throw new Error("Unable to load products.");
        }

        products = await response.json();

        displayProducts(products);

    } catch (error) {
        productContainer.innerHTML =
            "<p>Something went wrong while loading products. Please try again.</p>";

        console.error(error);
    }
}

// Display Products Dynamically

function displayProducts(productList) {

    productContainer.innerHTML = "";

    productTotal.textContent =
        `${productList.length} Products`;

    noProducts.hidden = productList.length !== 0;

    productList.forEach(product => {

        const card = document.createElement("div");

        card.className = "product-card";

        card.innerHTML = `
            <div class="product-image">
                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                >
            </div>

            <div class="product-info">

                <span class="product-category">
                    ${product.category}
                </span>

                <h3>${product.name}</h3>

                <div class="rating">
                    ★★★★★
                    <span>(${product.rating}/5)</span>
                </div>

                <div class="product-bottom">

                    <span class="price">
                        ${formatPrice(product.price)}
                    </span>

                    <button
                        class="add-cart"
                        data-id="${product.id}"
                    >
                        + Add
                    </button>

                </div>

            </div>
        `;

        productContainer.appendChild(card);

    });

}

// Search Products

function searchProducts() {

    const searchValue = searchInput.value
        .trim()
        .toLowerCase();

    const filteredProducts = products.filter(product => {

        return (
            product.name.toLowerCase().includes(searchValue) ||
            product.category.toLowerCase().includes(searchValue)
        );

    });

    displayProducts(filteredProducts);
}

searchInput.addEventListener("input", searchProducts);

searchBtn.addEventListener("click", searchProducts);

// Add Products to Cart

productContainer.addEventListener("click", function(event) {

    if (!event.target.classList.contains("add-cart")) {
        return;
    }

    const productId = Number(event.target.dataset.id);

    const selectedProduct = products.find(
        product => product.id === productId
    );

    if (!selectedProduct) return;

    const existingItem = cart.find(
        item => item.id === productId
    );

    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({
            ...selectedProduct,
            quantity: 1
        });

    }

    updateCart();

    event.target.textContent = "Added ✓";

    setTimeout(() => {
        event.target.textContent = "+ Add";
    }, 800);

});

// Update Cart

function updateCart() {

    cartItems.innerHTML = "";

    let totalItems = 0;
    let totalPrice = 0;

    if (cart.length === 0) {

        cartItems.innerHTML =
            '<p class="empty-cart">Your cart is empty!</p>';

    }

    cart.forEach(item => {

        totalItems += item.quantity;

        totalPrice += item.price * item.quantity;

        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `

            <img src="${item.image}" alt="${item.name}">

            <div class="cart-item-info">

                <h4>${item.name}</h4>

                <p>${formatPrice(item.price * item.quantity)}</p>

                <div class="cart-quantity">

                    <button
                        data-action="decrease"
                        data-id="${item.id}"
                    >−</button>

                    <span>${item.quantity}</span>

                    <button
                        data-action="increase"
                        data-id="${item.id}"
                    >+</button>

                </div>

            </div>

            <button
                class="remove-item"
                data-action="remove"
                data-id="${item.id}"
                aria-label="Remove ${item.name}"
            >✕</button>

        `;

        cartItems.appendChild(cartItem);

    });

    cartCount.textContent = totalItems;

    cartTotal.textContent = formatPrice(totalPrice);

}

// Cart Quantity and Remove Functionality

cartItems.addEventListener("click", function(event) {

    const button = event.target.closest("button");

    if (!button) return;

    const productId = Number(button.dataset.id);

    const action = button.dataset.action;

    const selectedItem = cart.find(
        item => item.id === productId
    );

    if (!selectedItem) return;

    if (action === "increase") {

        selectedItem.quantity++;

    } else if (action === "decrease") {

        selectedItem.quantity--;

        if (selectedItem.quantity <= 0) {
            cart = cart.filter(
                item => item.id !== productId
            );
        }

    } else if (action === "remove") {

        cart = cart.filter(
            item => item.id !== productId
        );

    }

    updateCart();

});

// Open Cart

function openCart() {

    cartSidebar.classList.add("active");
    cartOverlay.classList.add("active");

}

cartToggle.addEventListener("click", openCart);

// Close Cart

function closeCartSidebar() {

    cartSidebar.classList.remove("active");
    cartOverlay.classList.remove("active");

}

closeCart.addEventListener("click", closeCartSidebar);

cartOverlay.addEventListener("click", closeCartSidebar);

// Checkout Button

checkoutBtn.addEventListener("click", function() {

    if (cart.length === 0) {

        alert("Your shopping cart is empty!");

        return;

    }

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    alert(
        "Thank you for shopping with ShopZone!\n" +
        "Your total amount is " + formatPrice(total) +
        "\nThis is a demo checkout. No payment has been processed."
    );

    cart = [];

    updateCart();

    closeCartSidebar();

});

// Load Products When Website Starts

loadProducts();

updateCart();
