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
  openCheckout,
  closeCheckout,
  openConfirmModal,
  closeConfirmModal,
  setupValidation,
  validateForm,
} from "./ui.js";
import { initBuilder } from "./builder.js";
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
  const checkoutModal = document.getElementById("checkoutModal");
  const checkoutForm = document.getElementById("checkoutForm");
  const checkoutTotal = document.getElementById("checkoutTotal");
  const checkoutSuccess = document.getElementById("checkoutSuccess");
  const successCloseBtn = document.getElementById("successCloseBtn");
  const checkoutCloseBtn = document.querySelector(".checkout-modal__close");
  const checkoutOverlay = document.querySelector(".checkout-modal__overlay");
  const confirmModal = document.getElementById("confirmModal");
  const confirmCancelBtn = document.getElementById("confirmCancelBtn");
  const confirmOkBtn = document.getElementById("confirmOkBtn");
  const confirmOverlay = document.querySelector(".confirm-modal__overlay");
  const burgerBtn = document.querySelector(".burger-btn");
  const nav = document.querySelector(".nav");
  const navLinks = document.querySelectorAll(".nav__link");
  const featureCards = document.querySelectorAll(".about__feature");
  const filterBtns = document.querySelectorAll(".menu-filters__btn");
  const menuCards = document.querySelectorAll(".menu-card");
  const backToTopBtn = document.getElementById("backToTop");
  const preloader = document.getElementById("preloader");

  // === ЗАГРУЗКА КОРЗИНЫ ===
  const savedCart = loadCart();
  cart.push(...savedCart);
  updateCartCount(cartCount);

  // === ОБРАБОТЧИКИ КНОПОК ДОБАВЛЕНИЯ ===
  document
    .querySelectorAll(
      ".menu-card__btn, .sputniki-card__btn, .sputniki-card__size-btn, .napitki-card__btn",
    )
    .forEach((btn) => {
      btn.addEventListener("click", () =>
        addToCart(parseInt(btn.dataset.id), showToast, cartIcon),
      );
    });

  // === КОРЗИНА ===
  cartIcon.addEventListener("click", () => {
    openCart(cartModal);
    renderCart(cartItemsContainer, cartFooter, cartTotal);
  });
  closeBtn.addEventListener("click", () => closeCart(cartModal));
  overlay.addEventListener("click", () => closeCart(cartModal));
  checkoutBtn.addEventListener("click", () => {
    closeCart(cartModal);
    openCheckout(checkoutModal, checkoutTotal, cart);
  });
  checkoutCloseBtn.addEventListener("click", () =>
    closeCheckout(checkoutModal, checkoutSuccess, checkoutForm),
  );
  checkoutOverlay.addEventListener("click", () =>
    closeCheckout(checkoutModal, checkoutSuccess, checkoutForm),
  );
  successCloseBtn.addEventListener("click", () => {
    closeCheckout(checkoutModal, checkoutSuccess, checkoutForm);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

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
    showToast("Корзина очищена", "️");
  });

  // === КЛАВИША ESCAPE ===
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (confirmModal.classList.contains("confirm-modal--active"))
        closeConfirmModal(confirmModal);
      else if (checkoutModal.classList.contains("checkout-modal--active"))
        closeCheckout(checkoutModal, checkoutSuccess, checkoutForm);
      else if (cartModal.classList.contains("cart-modal--active"))
        closeCart(cartModal);
    }
  });

  // === ВАЛИДАЦИЯ ФОРМЫ ===
  setupValidation();
  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const btn = checkoutForm.querySelector(".checkout-form__submit");
    const txt = btn.querySelector(".checkout-form__submit-text");
    const ld = btn.querySelector(".checkout-form__submit-loading");
    btn.disabled = true;
    txt.style.display = "none";
    ld.style.display = "flex";
    setTimeout(() => {
      checkoutForm.style.display = "none";
      checkoutSuccess.classList.add("checkout-success--active");
      clearCart();
      updateCartCount(cartCount);
      localStorage.removeItem("spaceBurgerCart");
      btn.disabled = false;
      txt.style.display = "inline";
      ld.style.display = "none";
      checkoutForm.style.display = "flex";
    }, 2000);
  });

  // === МОБИЛЬНОЕ МЕНЮ ===
  burgerBtn.addEventListener("click", () => {
    const a = nav.classList.toggle("nav--active");
    burgerBtn.setAttribute("aria-expanded", a);
    burgerBtn.classList.toggle("burger-btn--active");
  });
  navLinks.forEach((l) =>
    l.addEventListener("click", () => {
      nav.classList.remove("nav--active");
      burgerBtn.setAttribute("aria-expanded", "false");
      burgerBtn.classList.remove("burger-btn--active");
    }),
  );

  // === АНИМАЦИИ ===
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

  filterBtns.forEach((b) =>
    b.addEventListener("click", () => {
      filterBtns.forEach((x) =>
        x.classList.remove("menu-filters__btn--active"),
      );
      b.classList.add("menu-filters__btn--active");
      const f = b.dataset.filter;
      menuCards.forEach((c) => {
        const cats = c.dataset.category.split(" ");
        if (f === "all" || cats.includes(f)) {
          c.classList.remove("menu-card--hidden");
          c.classList.add("menu-card--visible");
        } else {
          c.classList.remove("menu-card--visible");
          c.classList.add("menu-card--hidden");
        }
      });
    }),
  );

  window.addEventListener("scroll", () => {
    backToTopBtn.classList.toggle("back-to-top--visible", window.scrollY > 500);
  });
  backToTopBtn.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );
  window.addEventListener("load", () =>
    setTimeout(() => preloader.classList.add("preloader--hidden"), 800),
  );

  // === ИНИЦИАЛИЗАЦИЯ МОДУЛЕЙ ===
  initBuilder();
  initReviews();
});
