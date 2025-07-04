const elements = {
  menuBtn: document.querySelector(".menu-btn"),
  closeMenuBtn: document.querySelector(".close-menu-btn"),
  mobileMenu: document.querySelector(".mobile-menu"),
  mobileMenuOverlay: document.querySelector(".mobile-menu-overlay"),
  body: document.body,
  mainImageContainer: document.querySelector(".main-image-container"),
  mainProductImage: document.querySelector(".main-product-image"),
  prevBtn: document.querySelector(".prev-btn"),
  nextBtn: document.querySelector(".next-btn"),
  thumbnails: document.querySelectorAll(".thumbnail"),
  minusBtn: document.querySelector(".minus-btn"),
  plusBtn: document.querySelector(".plus-btn"),
  quantityDisplay: document.querySelector(".quantity-display"),
  addToCartBtn: document.querySelector(".add-to-cart-btn"),
  cartCountSpan: document.querySelector(".cart-count"),
  cartBtn: document.querySelector(".cart-btn"),
  cartModal: document.querySelector(".cart-modal"),
  cartModalContent: document.getElementById("cartModalContent"),
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

function openMobileMenu() {
  elements.mobileMenu.classList.add("open");
  elements.mobileMenuOverlay.classList.add("active");
  elements.body.classList.add("no-scroll");
  elements.menuBtn.setAttribute("aria-expanded", "true");
}

function closeMobileMenu() {
  elements.mobileMenu.classList.remove("open");
  elements.mobileMenuOverlay.classList.remove("active");
  elements.body.classList.remove("no-scroll");
  elements.menuBtn.setAttribute("aria-expanded", "false");
}

function updateMainImage(index) {
  const currentActive = elements.mainImageContainer.querySelector(
    ".main-product-image.active"
  );

  if (!currentActive || parseInt(currentActive.dataset.index) !== index) {
    if (currentActive) {
      currentActive.classList.remove("active");
      currentActive.addEventListener(
        "transitionend",
        () => {
          if (!currentActive.classList.contains("active")) {
            currentActive.remove();
          }
        },
        { once: true }
      );
    }

    let newImage = elements.mainImageContainer.querySelector(
      `[data-index="${index}"]`
    );

    if (!newImage) {
      newImage = new Image();
      newImage.src = state.images[index];
      newImage.alt = `Product image ${index + 1}`;
      newImage.className = "main-product-image";
      newImage.dataset.index = index;
      newImage.addEventListener("click", openLightbox);
      elements.mainImageContainer.appendChild(newImage);
    }

    setTimeout(() => {
      newImage.classList.add("active");
    }, 50);
  }
}

function updateThumbnails(index) {
  elements.thumbnails.forEach((thumb, i) => {
    thumb.classList.toggle("active", i === index);
  });
}

function updateLightboxThumbnails(index) {
  elements.lightboxThumbnails.forEach((thumb, i) => {
    thumb.classList.toggle("active", i === index);
  });
}

function showImage(index, isLightbox = false) {
  if (index >= state.images.length) index = 0;
  if (index < 0) index = state.images.length - 1;

  state.currentImageIndex = index;
  updateMainImage(index);
  updateThumbnails(index);

  if (isLightbox && elements.lightboxMainProductImage) {
    elements.lightboxMainProductImage.src = state.images[index];
    updateLightboxThumbnails(index);
  }
}

function initSlideshow() {
  const firstImage = new Image();
  firstImage.src = state.images[0];
  firstImage.alt = "Product image 1";
  firstImage.className = "main-product-image active";
  firstImage.dataset.index = "0";
  firstImage.addEventListener("click", openLightbox);
  elements.mainImageContainer.appendChild(firstImage);
}

function showNextImage(isLightbox = false) {
  showImage(state.currentImageIndex + 1, isLightbox);
}

function showPrevImage(isLightbox = false) {
  showImage(state.currentImageIndex - 1, isLightbox);
}

function openLightbox() {
  if (window.innerWidth >= 768) {
    elements.lightboxOverlay.classList.add("active");
    elements.lightboxOverlay.setAttribute("aria-hidden", "false");
    elements.body.classList.add("no-scroll");
    showImage(state.currentImageIndex, true);
  }
}

function closeLightbox() {
  elements.lightboxOverlay.classList.remove("active");
  elements.lightboxOverlay.setAttribute("aria-hidden", "true");
  elements.body.classList.remove("no-scroll");
}

function updateCartCount() {
  if (state.itemsInCart > 0) {
    elements.cartCountSpan.textContent = state.itemsInCart;
    elements.cartCountSpan.classList.remove("hidden");
    elements.cartBtn.setAttribute("aria-expanded", "true");
  } else {
    elements.cartCountSpan.classList.add("hidden");
    elements.cartBtn.setAttribute("aria-expanded", "false");
  }
}

function toggleCartModal() {
  const isOpening = !elements.cartModal.classList.contains("open");
  elements.cartModal.classList.toggle("open");

  if (isOpening) {
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
            } <span class="cart-item__total">$${(
        125 * state.itemsInCart
      ).toFixed(2)}</span></p>
          </div>
          <button class="cart-item__delete-btn" aria-label="Remove item from cart">
            <img src="./images/icon-delete.svg" alt="Delete icon">
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
}

function addToCart() {
  if (state.currentQuantity > 0) {
    state.itemsInCart += state.currentQuantity;
    state.currentQuantity = 0;
    elements.quantityDisplay.textContent = state.currentQuantity;
    updateCartCount();
  }
}

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

function setupEventListeners() {
  elements.menuBtn?.addEventListener("click", openMobileMenu);
  elements.closeMenuBtn?.addEventListener("click", closeMobileMenu);
  elements.mobileMenuOverlay?.addEventListener("click", closeMobileMenu);
  elements.prevBtn?.addEventListener("click", () => showPrevImage(false));
  elements.nextBtn?.addEventListener("click", () => showNextImage(false));

  elements.thumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener("click", () => {
      const index = parseInt(thumbnail.dataset.index);
      if (!isNaN(index)) showImage(index, false);
    });
  });

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

  elements.cartBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleCartModal();
  });

  document.addEventListener("click", (e) => {
    if (
      elements.cartModal.classList.contains("open") &&
      !e.target.closest(".cart-modal") &&
      !e.target.closest(".cart-btn")
    ) {
      toggleCartModal();
    }
  });

  elements.minusBtn?.addEventListener("click", decreaseQuantity);
  elements.plusBtn?.addEventListener("click", increaseQuantity);
  elements.addToCartBtn?.addEventListener("click", addToCart);

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) {
      if (elements.mobileMenu.classList.contains("open")) closeMobileMenu();
    } else {
      if (elements.lightboxOverlay.classList.contains("active"))
        closeLightbox();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (elements.lightboxOverlay.classList.contains("active")) {
      if (e.key === "ArrowLeft") showPrevImage(true);
      else if (e.key === "ArrowRight") showNextImage(true);
      else if (e.key === "Escape") closeLightbox();
    }
  });
}

function init() {
  setupEventListeners();
  initSlideshow();
  updateCartCount();
  elements.cartBtn.setAttribute("aria-expanded", "false");
  elements.lightboxOverlay.setAttribute("aria-hidden", "true");
}

init();
