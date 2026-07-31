import { products } from "./data.js";
import {
  loadCart,
  updateCartCount,
  addToCart,
  renderCart,
  clearCart,
} from "./cart.js";
import { showToast, openCart, closeCart } from "./ui.js";

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
  const clearCartBtn = document.getElementById("clearCartBtn");
  const confirmModal = document.getElementById("confirmModal");
  const confirmCancelBtn = document.getElementById("confirmCancelBtn");
  const confirmOkBtn = document.getElementById("confirmOkBtn");
  const confirmOverlay = document.querySelector(".confirm-modal__overlay");
  const burgerBtn = document.querySelector(".burger-btn");
  const nav = document.querySelector(".nav");
  const navLinks = document.querySelectorAll(".nav__link");
  const filterBtns = document.querySelectorAll(".menu-filters__btn");
  const menuCards = document.querySelectorAll(".menu-card");

  // === ЗАГРУЗКА КОРЗИНЫ ===
  loadCart();
  updateCartCount(cartCount);

  // === ОБРАБОТЧИКИ КНОПОК ДОБАВЛЕНИЯ ===
  document.querySelectorAll(".menu-card__btn").forEach((btn) => {
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

  // === ОЧИСТКА КОРЗИНЫ ===
  clearCartBtn.addEventListener("click", () => {
    const currentCart = JSON.parse(
      localStorage.getItem("spaceBurgerCart") || "[]",
    );
    if (currentCart.length > 0) {
      confirmModal.classList.add("confirm-modal--active");
      document.body.style.overflow = "hidden";
    }
  });

  confirmCancelBtn.addEventListener("click", () => {
    confirmModal.classList.remove("confirm-modal--active");
    document.body.style.overflow = "";
  });

  confirmOverlay.addEventListener("click", () => {
    confirmModal.classList.remove("confirm-modal--active");
    document.body.style.overflow = "";
  });

  confirmOkBtn.addEventListener("click", () => {
    clearCart();
    renderCart(cartItemsContainer, cartFooter, cartTotal);
    confirmModal.classList.remove("confirm-modal--active");
    document.body.style.overflow = "";
    showToast("Корзина очищена", "️");
  });

  // === КЛАВИША ESCAPE ===
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (confirmModal.classList.contains("confirm-modal--active")) {
        confirmModal.classList.remove("confirm-modal--active");
        document.body.style.overflow = "";
      } else if (cartModal.classList.contains("cart-modal--active")) {
        closeCart(cartModal);
      }
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

  // === ФИЛЬТРЫ ===
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
});
