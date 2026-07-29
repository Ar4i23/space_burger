import { products } from "./data.js";
import {
  cart,
  loadCart,
  updateCartCount,
  addToCart,
  renderCart,
  clearCart,
} from "./cart.js";
import {
  showToast,
  openCart,
  closeCart,
  openConfirmModal,
  closeConfirmModal,
} from "./ui.js";
import { initReviews } from "./reviews.js";

document.addEventListener("DOMContentLoaded", () => {
  // === ЭЛЕМЕНТЫ DOM ===
  const cartModal = document.getElementById("cartModal");
  const cartItemsContainer = document.getElementById("cartItems");
  const cartFooter = document.getElementById("cartFooter");
  const cartTotal = document.getElementById("cartTotal");
  const cartCount = document.querySelector(".btn-cart__count");
  const cartIcon = document.querySelector(".btn-cart");
  const closeBtn = document.querySelector(".cart-modal__close");
  const overlay = document.querySelector(".cart-modal__overlay");
  const checkoutBtn = document.querySelector(".cart-modal__checkout");
  const clearCartBtn = document.getElementById("clearCartBtn");
  const confirmModal = document.getElementById("confirmModal");
  const confirmCancelBtn = document.getElementById("confirmCancelBtn");
  const confirmOkBtn = document.getElementById("confirmOkBtn");
  const confirmOverlay = document.querySelector(".confirm-modal__overlay");
  const checkoutModal = document.getElementById("checkoutModal");
  const checkoutForm = document.getElementById("checkoutForm");
  const checkoutSuccess = document.getElementById("checkoutSuccess");
  const successCloseBtn = document.getElementById("successCloseBtn");
  const checkoutCloseBtn = document.querySelector(".checkout-modal__close");
  const checkoutOverlay = document.querySelector(".checkout-modal__overlay");
  const burgerBtn = document.querySelector(".burger-btn");
  const nav = document.querySelector(".nav");
  const navLinks = document.querySelectorAll(".nav__link");
  const featureCards = document.querySelectorAll(".about__feature");
  const backToTopBtn = document.getElementById("backToTop");
  const preloader = document.getElementById("preloader");

  // === ЗАГРУЗКА КОРЗИНЫ ===
  const savedCart = loadCart();
  cart.push(...savedCart);
  updateCartCount(cartCount);

  // === КОРЗИНА ===
  cartIcon.addEventListener("click", () => {
    openCart(cartModal);
    renderCart(cartItemsContainer, cartFooter, cartTotal);
  });
  closeBtn.addEventListener("click", () => closeCart(cartModal));
  overlay.addEventListener("click", () => closeCart(cartModal));

  // === ОЧИСТКА КОРЗИНЫ ===
  clearCartBtn.addEventListener("click", () => {
    if (cart.length > 0) openConfirmModal(confirmModal);
  });
  confirmCancelBtn.addEventListener("click", () =>
    closeConfirmModal(confirmModal),
  );
  confirmOverlay.addEventListener("click", () =>
    closeConfirmModal(confirmModal),
  );
  confirmOkBtn.addEventListener("click", () => {
    clearCart();
    renderCart(cartItemsContainer, cartFooter, cartTotal);
    closeConfirmModal(confirmModal);
    showToast("Корзина очищена", "🗑️");
  });

  // === КЛАВИША ESCAPE ===
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (confirmModal.classList.contains("confirm-modal--active"))
        closeConfirmModal(confirmModal);
      else if (cartModal.classList.contains("cart-modal--active"))
        closeCart(cartModal);
    }
  });

  // === МОБИЛЬНОЕ МЕНЮ ===
  if (burgerBtn) {
    burgerBtn.addEventListener("click", () => {
      const isActive = nav.classList.toggle("nav--active");
      burgerBtn.setAttribute("aria-expanded", isActive);
      burgerBtn.classList.toggle("burger-btn--active");
    });
    navLinks.forEach((l) =>
      l.addEventListener("click", () => {
        nav.classList.remove("nav--active");
        burgerBtn.setAttribute("aria-expanded", "false");
        burgerBtn.classList.remove("burger-btn--active");
      }),
    );
  }

  // === АНИМАЦИИ О НАС ===
  if (featureCards.length) {
    const obs = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("about__feature--visible");
            obs.unobserve(e.target);
          }
        }),
      { threshold: 0.2 },
    );
    featureCards.forEach((c) => obs.observe(c));
  }

  // === КНОПКА НАВЕРХ ===
  window.addEventListener("scroll", () => {
    backToTopBtn.classList.toggle("back-to-top--visible", window.scrollY > 500);
  });
  backToTopBtn.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );

  // === ПРЕЛОАДЕР ===
  window.addEventListener("load", () =>
    setTimeout(() => preloader.classList.add("preloader--hidden"), 800),
  );

  // === ИНИЦИАЛИЗАЦИЯ ОТЗЫВОВ ===
  initReviews();
});
