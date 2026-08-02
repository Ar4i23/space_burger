import { products } from "./data.js";
import {
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
  validateField,
  clearErrors,
} from "./ui.js";
import { sendOrderToTelegram } from "./telegram.js";

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

  const checkoutModal = document.getElementById("checkoutModal");
  const checkoutForm = document.getElementById("checkoutForm");
  const checkoutSuccess = document.getElementById("checkoutSuccess");
  const successCloseBtn = document.getElementById("successCloseBtn");
  const checkoutCloseBtn = document.querySelector(".checkout-modal__close");
  const checkoutOverlay = document.querySelector(".checkout-modal__overlay");

  const filters = document.querySelectorAll(".menu-filters__btn");
  const cards = document.querySelectorAll(".menu-card");
  const burgerBtn = document.querySelector(".burger-btn");
  const nav = document.querySelector(".nav");
  const navLinks = document.querySelectorAll(".nav__link");

  // === СБРОС СОСТОЯНИЯ ПРИ ЗАГРУЗКЕ ===
  if (checkoutForm) checkoutForm.style.display = "flex";
  if (checkoutSuccess) checkoutSuccess.style.display = "none";

  // === ЗАГРУЗКА КОРЗИНЫ ===
  loadCart();
  updateCartCount(cartCount);

  // === ДОБАВЛЕНИЕ В КОРЗИНУ ===
  document.querySelectorAll(".menu-card__btn").forEach((btn) => {
    btn.addEventListener("click", () =>
      addToCart(parseInt(btn.dataset.id), showToast, cartIcon),
    );
  });

  // === КОРЗИНА ===
  if (cartIcon) {
    cartIcon.addEventListener("click", () => {
      openCart(cartModal);
      renderCart(cartItemsContainer, cartFooter, cartTotal);
    });
  }
  if (closeBtn) closeBtn.addEventListener("click", () => closeCart(cartModal));
  if (overlay) overlay.addEventListener("click", () => closeCart(cartModal));

  // === ОЧИСТКА КОРЗИНЫ ===
  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
      const currentCart = JSON.parse(
        localStorage.getItem("spaceBurgerCart") || "[]",
      );
      if (currentCart.length > 0) openConfirmModal(confirmModal);
    });
  }
  if (confirmCancelBtn)
    confirmCancelBtn.addEventListener("click", () =>
      closeConfirmModal(confirmModal),
    );
  if (confirmOverlay)
    confirmOverlay.addEventListener("click", () =>
      closeConfirmModal(confirmModal),
    );
  if (confirmOkBtn) {
    confirmOkBtn.addEventListener("click", () => {
      clearCart();
      renderCart(cartItemsContainer, cartFooter, cartTotal);
      closeConfirmModal(confirmModal);
      showToast("Корзина очищена", "🗑️");
    });
  }

  // === ФИЛЬТРАЦИЯ (all / sides / sauces) ===
  filters.forEach((filter) => {
    filter.addEventListener("click", () => {
      filters.forEach((f) => f.classList.remove("menu-filters__btn--active"));
      filter.classList.add("menu-filters__btn--active");

      const category = filter.dataset.filter;
      cards.forEach((card) => {
        if (category === "all" || card.dataset.category === category) {
          card.style.display = "block";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "scale(1)";
          }, 10);
        } else {
          card.style.opacity = "0";
          card.style.transform = "scale(0.8)";
          setTimeout(() => {
            card.style.display = "none";
          }, 300);
        }
      });
    });
  });

  // === ОТКРЫТИЕ ФОРМЫ ОФОРМЛЕНИЯ ===
  document.addEventListener("click", (e) => {
    const checkoutBtn = e.target.closest(".cart-modal__checkout");
    if (checkoutBtn) {
      e.preventDefault();
      e.stopPropagation();

      const currentCart = JSON.parse(
        localStorage.getItem("spaceBurgerCart") || "[]",
      );
      if (currentCart.length === 0) {
        showToast("Корзина пуста!", "⚠️");
        return;
      }

      let totalSum = 0;
      currentCart.forEach((item) => {
        const product = products[item.id];
        if (product) totalSum += product.price * item.quantity;
      });
      const checkoutTotalEl = document.getElementById("checkoutTotal");
      if (checkoutTotalEl) checkoutTotalEl.textContent = `${totalSum} ₽`;

      closeCart(cartModal);

      setTimeout(() => {
        if (checkoutSuccess) {
          checkoutSuccess.style.display = "none";
          checkoutSuccess.classList.remove("checkout-success--active");
        }
        if (checkoutForm) {
          checkoutForm.style.display = "flex";
          checkoutForm.reset();
          clearErrors();
        }
        if (checkoutModal) {
          checkoutModal.classList.add("checkout-modal--active");
          document.body.style.overflow = "hidden";
        }
        if (checkoutForm) {
          const firstInput = checkoutForm.querySelector("input");
          if (firstInput) setTimeout(() => firstInput.focus(), 100);
        }
      }, 200);
    }
  });

  // === ВАЛИДАЦИЯ В РЕАЛЬНОМ ВРЕМЕНИ ===
  ["name", "phone", "address"].forEach((fid) => {
    const input = document.getElementById(fid);
    if (input) {
      input.addEventListener("input", () => validateField(fid));
      input.addEventListener("blur", () => validateField(fid));
    }
  });

  // === ОТПРАВКА ЗАКАЗА ===
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const nameInput = document.getElementById("name");
      const phoneInput = document.getElementById("phone");
      const addressInput = document.getElementById("address");
      const commentInput = document.getElementById("comment");

      const nameVal = nameInput ? nameInput.value.trim() : "";
      const phoneVal = phoneInput ? phoneInput.value.trim() : "";
      const addressVal = addressInput ? addressInput.value.trim() : "";
      const commentVal = commentInput ? commentInput.value.trim() : "";

      const nameValid = /^[a-zA-Zа-яА-ЯёЁ\s\-]{2,50}$/.test(nameVal);
      const phoneValid =
        /^(\+7|8)[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/.test(
          phoneVal,
        );
      const addressValid = /^(?=.*\d)(?=.*[a-zA-Zа-яА-ЯёЁ]).{5,100}$/.test(
        addressVal,
      );

      if (!nameValid || !phoneValid || !addressValid) {
        if (!nameValid && nameInput) {
          nameInput.classList.add("checkout-form__input--error");
          nameInput.classList.remove("checkout-form__input--valid");
          const nameError = document.getElementById("nameError");
          if (nameError)
            nameError.classList.add("checkout-form__error--visible");
        }
        if (!phoneValid && phoneInput) {
          phoneInput.classList.add("checkout-form__input--error");
          phoneInput.classList.remove("checkout-form__input--valid");
          const phoneError = document.getElementById("phoneError");
          if (phoneError)
            phoneError.classList.add("checkout-form__error--visible");
        }
        if (!addressValid && addressInput) {
          addressInput.classList.add("checkout-form__input--error");
          addressInput.classList.remove("checkout-form__input--valid");
          const addressError = document.getElementById("addressError");
          if (addressError)
            addressError.classList.add("checkout-form__error--visible");
        }
        return;
      }

      clearErrors();

      const btn = checkoutForm.querySelector(".checkout-form__submit");
      const txt = btn ? btn.querySelector(".checkout-form__submit-text") : null;
      const ld = btn
        ? btn.querySelector(".checkout-form__submit-loading")
        : null;

      const cartItems = JSON.parse(
        localStorage.getItem("spaceBurgerCart") || "[]",
      );

      const orderData = {
        name: nameVal,
        phone: phoneVal,
        address: addressVal,
        comment: commentVal,
        items: cartItems.map((item) => ({
          name: products[item.id] ? products[item.id].name : "Товар",
          quantity: item.quantity,
          price: products[item.id] ? products[item.id].price : 0,
        })),
        total: cartItems.reduce(
          (sum, item) =>
            sum +
            (products[item.id] ? products[item.id].price : 0) * item.quantity,
          0,
        ),
      };

      if (btn) btn.disabled = true;
      if (txt) txt.style.display = "none";
      if (ld) ld.style.display = "flex";

      sendOrderToTelegram(orderData)
        .then((result) => {
          if (result.ok) {
            if (checkoutForm) checkoutForm.style.display = "none";
            if (checkoutSuccess) {
              checkoutSuccess.style.display = "flex";
              checkoutSuccess.classList.add("checkout-success--active");
            }
            localStorage.removeItem("spaceBurgerCart");
            clearCart();
            updateCartCount(cartCount);
          } else {
            alert("Ошибка отправки заказа. Попробуйте позже.");
          }
        })
        .catch((error) => {
          console.error("Ошибка:", error);
          alert("Ошибка сети. Проверьте интернет.");
        })
        .finally(() => {
          if (btn) btn.disabled = false;
          if (txt) txt.style.display = "inline";
          if (ld) ld.style.display = "none";
        });
    });
  }

  // === СБРОС ФОРМЫ ===
  function resetCheckoutForm() {
    if (checkoutModal) checkoutModal.classList.remove("checkout-modal--active");
    document.body.style.overflow = "";

    setTimeout(() => {
      if (checkoutSuccess) {
        checkoutSuccess.style.display = "none";
        checkoutSuccess.classList.remove("checkout-success--active");
      }
      if (checkoutForm) {
        checkoutForm.style.display = "flex";
        checkoutForm.reset();
        clearErrors();
      }
    }, 300);
  }

  if (checkoutCloseBtn)
    checkoutCloseBtn.addEventListener("click", resetCheckoutForm);
  if (checkoutOverlay)
    checkoutOverlay.addEventListener("click", resetCheckoutForm);
  if (successCloseBtn) {
    successCloseBtn.addEventListener("click", () => {
      resetCheckoutForm();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // === ESCAPE ===
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (
        confirmModal &&
        confirmModal.classList.contains("confirm-modal--active")
      )
        closeConfirmModal(confirmModal);
      else if (
        checkoutModal &&
        checkoutModal.classList.contains("checkout-modal--active")
      )
        resetCheckoutForm();
      else if (cartModal && cartModal.classList.contains("cart-modal--active"))
        closeCart(cartModal);
    }
  });

  // === МОБИЛЬНОЕ МЕНЮ ===
  if (burgerBtn && nav) {
    burgerBtn.addEventListener("click", () => {
      const isActive = nav.classList.toggle("nav--active");
      burgerBtn.setAttribute("aria-expanded", isActive);
      burgerBtn.classList.toggle("burger-btn--active");
    });
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("nav--active");
        burgerBtn.setAttribute("aria-expanded", "false");
        burgerBtn.classList.remove("burger-btn--active");
      });
    });
  }
});
