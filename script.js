const elements = {
  // Mobile menu elements
  menuBtn: document.querySelector(".menu-btn"),
  closeMenuBtn: document.querySelector(".close-menu-btn"),
  mobileMenu: document.querySelector(".mobile-menu"),
  mobileMenuOverlay: document.querySelector(".mobile-menu-overlay"),
  body: document.body,

  // Product gallery elements
  mainProductImage: document.querySelector(".main-product-image"),
  prevBtn: document.querySelector(".prev-btn"),
  nextBtn: document.querySelector(".next-btn"),
  thumbnails: document.querySelectorAll(".thumbnail"),

  // Quantity/cart elements
  minusBtn: document.querySelector(".minus-btn"),
  plusBtn: document.querySelector(".plus-btn"),
  quantityDisplay: document.querySelector(".quantity-display"),
  addToCartBtn: document.querySelector(".add-to-cart-btn"),
  cartCountSpan: document.querySelector(".cart-count"),
  cartBtn: document.querySelector(".cart-btn"),
  cartModal: document.querySelector(".cart-modal"),
  cartModalContent: document.getElementById("cartModalContent"),

  // Lightbox elements
  lightboxOverlay: document.querySelector(".lightbox-overlay"),
  lightboxCloseBtn: document.querySelector(".lightbox-close-btn"),
  lightboxMainProductImage: document.querySelector(
    ".lightbox-main-product-image"
  ),
  lightboxPrevBtn: document.querySelector(".lightbox-prev-btn"),
  lightboxNextBtn: document.querySelector(".lightbox-next-btn"),
  lightboxThumbnails: document.querySelectorAll(".lightbox-thumbnail"),
};

const state = {
  currentImageIndex: 0,
  images: [
    "./images/image-product-1.jpg",
    "./images/image-product-2.jpg",
    "./images/image-product-3.jpg",
    "./images/image-product-4.jpg",
  ],
  currentQuantity: 0,
  itemsInCart: 0,
};

// Mobile Menu Functions
function openMobileMenu() {
  elements.mobileMenu.classList.add("open");
  elements.mobileMenuOverlay.classList.add("active");
  elements.body.classList.add("no-scroll");
}

function closeMobileMenu() {
  elements.mobileMenu.classList.remove("open");
  elements.mobileMenuOverlay.classList.remove("active");
  elements.body.classList.remove("no-scroll");
}

// Image Gallery Functions
function showImage(index, isLightbox = false) {
  if (index >= state.images.length) index = 0;
  if (index < 0) index = state.images.length - 1;

  state.currentImageIndex = index;

  // Update main image
  if (elements.mainProductImage) {
    elements.mainProductImage.src = state.images[index];
    elements.mainProductImage.alt = `Product image ${index + 1}`;
  }

  // Update thumbnails
  elements.thumbnails.forEach((thumb, i) => {
    thumb.classList.toggle("active", i === index);
  });

  // Update lightbox if needed
  if (isLightbox && elements.lightboxMainProductImage) {
    elements.lightboxMainProductImage.src = state.images[index];
    elements.lightboxThumbnails.forEach((thumb, i) => {
      thumb.classList.toggle("active", i === index);
    });
  }
}

function showNextImage(isLightbox = false) {
  showImage(state.currentImageIndex + 1, isLightbox);
}

function showPrevImage(isLightbox = false) {
  showImage(state.currentImageIndex - 1, isLightbox);
}

// Lightbox Functions
function openLightbox() {
  if (window.innerWidth >= 768) {
    elements.lightboxOverlay.classList.add("active");
    elements.body.classList.add("no-scroll");
    showImage(state.currentImageIndex, true);
  }
}

function closeLightbox() {
  elements.lightboxOverlay.classList.remove("active");
  elements.body.classList.remove("no-scroll");
}

// Cart Functions
function updateCartCount() {
  if (state.itemsInCart > 0) {
    elements.cartCountSpan.textContent = state.itemsInCart;
    elements.cartCountSpan.classList.remove("hidden");
  } else {
    elements.cartCountSpan.classList.add("hidden");
  }
}

function toggleCartModal() {
  elements.cartModal.classList.toggle("open");

  if (state.itemsInCart === 0) {
    elements.cartModalContent.innerHTML =
      '<p class="cart-empty-message">Your cart is empty.</p>';
  } else {
    elements.cartModalContent.innerHTML = `
      <div class="cart-item">
        <img src="./images/image-product-1-thumbnail.jpg" alt="Product thumbnail" class="cart-item__thumbnail">
        <div class="cart-item__details">
          <p class="cart-item__name">Fall Limited Edition Sneakers</p>
          <p class="cart-item__price">$125.00 × ${
            state.itemsInCart
          } <span class="cart-item__total">$${(125 * state.itemsInCart).toFixed(
      2
    )}</span></p>
        </div>
        <button class="cart-item__delete-btn">
          <img src="./images/icon-delete.svg" alt="Delete">
        </button>
      </div>
      <button class="checkout-btn">Checkout</button>
    `;

    document
      .querySelector(".cart-item__delete-btn")
      ?.addEventListener("click", () => {
        state.itemsInCart = 0;
        updateCartCount();
        toggleCartModal();
      });
  }
}

function addToCart() {
  if (state.currentQuantity > 0) {
    state.itemsInCart += state.currentQuantity;
    state.currentQuantity = 0;
    elements.quantityDisplay.textContent = state.currentQuantity;
    updateCartCount();
  }
}

// Quantity Functions
function decreaseQuantity() {
  if (state.currentQuantity > 0) {
    state.currentQuantity--;
    elements.quantityDisplay.textContent = state.currentQuantity;
  }
}

function increaseQuantity() {
  state.currentQuantity++;
  elements.quantityDisplay.textContent = state.currentQuantity;
}

// Event Listeners
function setupEventListeners() {
  // Mobile menu
  elements.menuBtn?.addEventListener("click", openMobileMenu);
  elements.closeMenuBtn?.addEventListener("click", closeMobileMenu);
  elements.mobileMenuOverlay?.addEventListener("click", closeMobileMenu);

  // Product gallery
  elements.prevBtn?.addEventListener("click", () => showPrevImage(false));
  elements.nextBtn?.addEventListener("click", () => showNextImage(false));
  elements.mainProductImage?.addEventListener("click", openLightbox);

  // Thumbnails
  elements.thumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener("click", () => {
      const index = parseInt(thumbnail.dataset.index);
      if (!isNaN(index)) showImage(index, false);
    });
  });

  // Lightbox
  elements.lightboxCloseBtn?.addEventListener("click", closeLightbox);
  elements.lightboxPrevBtn?.addEventListener("click", () =>
    showPrevImage(true)
  );
  elements.lightboxNextBtn?.addEventListener("click", () =>
    showNextImage(true)
  );
  elements.lightboxThumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener("click", () => {
      const index = parseInt(thumbnail.dataset.index);
      if (!isNaN(index)) showImage(index, true);
    });
  });

  // Cart
  elements.cartBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleCartModal();
  });

  document.addEventListener("click", (e) => {
    if (
      !e.target.closest(".cart-container") &&
      elements.cartModal.classList.contains("open")
    ) {
      toggleCartModal();
    }
  });

  // Quantity
  elements.minusBtn?.addEventListener("click", decreaseQuantity);
  elements.plusBtn?.addEventListener("click", increaseQuantity);
  elements.addToCartBtn?.addEventListener("click", addToCart);

  // Window resize
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) {
      if (elements.mobileMenu.classList.contains("open")) closeMobileMenu();
    } else {
      if (elements.lightboxOverlay.classList.contains("active"))
        closeLightbox();
    }
  });
}

// Initialize
function init() {
  setupEventListeners();
  showImage(0);
  updateCartCount();
}

init();
