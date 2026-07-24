document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. ДАННЫЕ О ТОВАРАХ
  // ==========================================
  const products = {
    1: {
      id: 1,
      name: "Черная дыра",
      price: 450,
      image: "img/burger-blackhole-400.png",
    },
    2: {
      id: 2,
      name: "Сверхновая",
      price: 520,
      image: "img/burger-supernova-400.png",
    },
    3: {
      id: 3,
      name: "Млечный путь",
      price: 390,
      image: "img/burger-milkyway-400.png",
    },
    4: {
      id: 4,
      name: "Сатурн",
      price: 580,
      image: "img/burger-saturn-400.png",
    },
    5: {
      id: 5,
      name: "Красный гигант",
      price: 690,
      image: "img/burger-redgiant-400.png",
    },
    6: {
      id: 6,
      name: "Туманность Ориона",
      price: 490,
      image: "img/burger-nebula-400.png",
    },
  };

  // ==========================================
  // 2. ЭЛЕМЕНТЫ DOM (сначала находим все элементы на странице)
  // ==========================================
  const cartModal = document.getElementById("cartModal");
  const cartItemsContainer = document.getElementById("cartItems");
  const cartFooter = document.getElementById("cartFooter");
  const cartTotal = document.getElementById("cartTotal");
  const cartCount = document.querySelector(".btn-cart__count");
  const cartIcon = document.querySelector(".btn-cart");
  const closeBtn = document.querySelector(".cart-modal__close");
  const overlay = document.querySelector(".cart-modal__overlay");
  const checkoutBtn = document.querySelector(".cart-modal__checkout");

  const checkoutModal = document.getElementById("checkoutModal");
  const checkoutForm = document.getElementById("checkoutForm");
  const checkoutTotal = document.getElementById("checkoutTotal");
  const checkoutSuccess = document.getElementById("checkoutSuccess");
  const successCloseBtn = document.getElementById("successCloseBtn");
  const checkoutCloseBtn = document.querySelector(".checkout-modal__close");
  const checkoutOverlay = document.querySelector(".checkout-modal__overlay");

  const burgerBtn = document.querySelector(".burger-btn");
  const nav = document.querySelector(".nav");
  const navLinks = document.querySelectorAll(".nav__link");

  const featureCards = document.querySelectorAll(".about__feature");
  const filterBtns = document.querySelectorAll(".menu-filters__btn");
  const menuCards = document.querySelectorAll(".menu-card");

  // ==========================================
  // 3. СОСТОЯНИЕ КОРЗИНЫ
  // ==========================================
  let cart = [];

  // ==========================================
  // 4. ФУНКЦИИ (теперь они могут безопасно использовать cartCount)
  // ==========================================
  function updateCartCount() {
    if (cartCount) {
      cartCount.textContent = cart.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );
    }
  }

  function saveCart() {
    localStorage.setItem("spaceBurgerCart", JSON.stringify(cart));
  }

  function loadCart() {
    const saved = localStorage.getItem("spaceBurgerCart");
    if (saved) {
      try {
        cart = JSON.parse(saved);
        updateCartCount();
      } catch (e) {
        console.error("Ошибка загрузки корзины:", e);
        cart = [];
        localStorage.removeItem("spaceBurgerCart");
      }
    }
  }

  function openCart() {
    cartModal.classList.add("cart-modal--active");
    document.body.style.overflow = "hidden";
    renderCart();
  }

  function closeCart() {
    cartModal.classList.remove("cart-modal--active");
    document.body.style.overflow = "";
  }

  // === ФУНКЦИЯ ДЛЯ TOAST УВЕДОМЛЕНИЙ ===
  function showToast(message, icon = "🍔") {
    const container = document.getElementById("toast-container");

    // Создаем элемент уведомления
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<span class="toast__icon">${icon}</span><span>${message}</span>`;

    // Добавляем в контейнер
    container.appendChild(toast);

    // Удаляем через 3 секунды с анимацией исчезновения
    setTimeout(() => {
      toast.classList.add("toast--hide");
      // Ждем окончания анимации (0.3s) перед полным удалением из DOM
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }

  // === ДОБАВЛЕНИЕ В КОРЗИНУ (ОБНОВЛЕННАЯ) ===
  function addToCart(productId) {
    const existingItem = cart.find((item) => item.id === productId);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ id: productId, quantity: 1 });
    }

    updateCartCount();
    saveCart();

    // Показываем уведомление с именем продукта
    const productName = products[productId].name;
    showToast(`${productName} добавлен в корзину!`);

    // Анимация иконки корзины (оставляем, это классный эффект)
    cartIcon.style.transform = "scale(1.3)";
    setTimeout(() => {
      cartIcon.style.transform = "scale(1)";
    }, 200);

    if (cartModal.classList.contains("cart-modal--active")) {
      renderCart();
    }
  }

  function renderCart() {
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `<div class="cart-modal__empty"><span class="cart-modal__empty-icon">🛒</span><p>Корзина пуста</p><p class="cart-modal__empty-text">Добавь бургеры из меню!</p></div>`;
      cartFooter.style.display = "none";
      return;
    }

    let html = "";
    let totalPrice = 0;

    cart.forEach((item) => {
      const product = products[item.id];
      const itemTotal = product.price * item.quantity;
      totalPrice += itemTotal;
      html += `
        <div class="cart-item">
          <img src="${product.image}" alt="${product.name}" class="cart-item__img">
          <div class="cart-item__info">
            <h3 class="cart-item__title">${product.name}</h3>
            <span class="cart-item__price">${itemTotal} ₽</span>
          </div>
          <div class="cart-item__controls">
            <div class="cart-item__quantity">
              <button class="cart-item__btn cart-item__decrease" data-id="${item.id}">−</button>
              <span class="cart-item__count">${item.quantity}</span>
              <button class="cart-item__btn cart-item__increase" data-id="${item.id}">+</button>
            </div>
            <button class="cart-item__remove" data-id="${item.id}" aria-label="Удалить">🗑</button>
          </div>
        </div>`;
    });

    cartItemsContainer.innerHTML = html;
    cartTotal.textContent = `${totalPrice} ₽`;
    cartFooter.style.display = "block";

    document
      .querySelectorAll(".cart-item__increase")
      .forEach((btn) =>
        btn.addEventListener("click", () =>
          changeQuantity(parseInt(btn.dataset.id), 1),
        ),
      );
    document
      .querySelectorAll(".cart-item__decrease")
      .forEach((btn) =>
        btn.addEventListener("click", () =>
          changeQuantity(parseInt(btn.dataset.id), -1),
        ),
      );
    document
      .querySelectorAll(".cart-item__remove")
      .forEach((btn) =>
        btn.addEventListener("click", () =>
          removeFromCart(parseInt(btn.dataset.id)),
        ),
      );
  }

  function changeQuantity(productId, delta) {
    const item = cart.find((item) => item.id === productId);
    if (item) {
      item.quantity += delta;
      if (item.quantity <= 0) removeFromCart(productId);
      else {
        updateCartCount();
        saveCart();
        renderCart();
      }
    }
  }

  function removeFromCart(productId) {
    cart = cart.filter((item) => item.id !== productId);
    updateCartCount();
    saveCart();
    renderCart();
  }

  function openCheckout() {
    if (cart.length === 0) return;
    const totalPrice = cart.reduce(
      (sum, item) => sum + products[item.id].price * item.quantity,
      0,
    );
    checkoutTotal.textContent = `${totalPrice} ₽`;
    closeCart();
    setTimeout(() => {
      checkoutModal.classList.add("checkout-modal--active");
      document.body.style.overflow = "hidden";
    }, 300);
  }

  function closeCheckout() {
    checkoutModal.classList.remove("checkout-modal--active");
    checkoutSuccess.classList.remove("checkout-success--active");
    document.body.style.overflow = "";
    setTimeout(() => {
      checkoutForm.reset();
      clearErrors();
    }, 300);
  }

  function clearErrors() {
    document.querySelectorAll(".checkout-form__input").forEach((input) => {
      input.classList.remove(
        "checkout-form__input--error",
        "checkout-form__input--valid",
      );
    });
    document.querySelectorAll(".checkout-form__error").forEach((error) => {
      error.classList.remove("checkout-form__error--visible");
    });
  }

  function showError(inputId, errorId) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (input) input.classList.add("checkout-form__input--error");
    if (error) error.classList.add("checkout-form__error--visible");
  }

  const validators = {
    name: { regex: /^[a-zA-Zа-яА-ЯёЁ\s\-]{2,50}$/, errorId: "nameError" },
    phone: {
      regex: /^(\+7|8)[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/,
      errorId: "phoneError",
    },
    address: {
      regex: /^(?=.*\d)(?=.*[a-zA-Zа-яА-ЯёЁ]).{5,100}$/,
      errorId: "addressError",
    },
  };

  function validateField(fieldId) {
    const input = document.getElementById(fieldId);
    if (!input) return false;

    const value = input.value.trim();
    const validator = validators[fieldId];
    const errorElement = document.getElementById(validator.errorId);

    if (value.length === 0) {
      input.classList.remove(
        "checkout-form__input--error",
        "checkout-form__input--valid",
      );
      if (errorElement)
        errorElement.classList.remove("checkout-form__error--visible");
      return false;
    }

    if (!validator.regex.test(value)) {
      input.classList.add("checkout-form__input--error");
      input.classList.remove("checkout-form__input--valid");
      if (errorElement)
        errorElement.classList.add("checkout-form__error--visible");
      return false;
    }

    input.classList.remove("checkout-form__input--error");
    input.classList.add("checkout-form__input--valid");
    if (errorElement)
      errorElement.classList.remove("checkout-form__error--visible");

    return true;
  }

  function validateForm() {
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();
    let isValid = true;

    if (!validators.name.regex.test(name)) {
      showError("name", validators.name.errorId);
      isValid = false;
    }
    if (!validators.phone.regex.test(phone)) {
      showError("phone", validators.phone.errorId);
      isValid = false;
    }
    if (!validators.address.regex.test(address)) {
      showError("address", validators.address.errorId);
      isValid = false;
    }

    return isValid;
  }

  // ==========================================
  // 5. ИНИЦИАЛИЗАЦИЯ И СОБЫТИЯ (запускаем ПОСЛЕ определения всего)
  // ==========================================

  // Загружаем корзину из localStorage
  loadCart();

  // Мобильное меню
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

  // Управление корзиной
  cartIcon.addEventListener("click", openCart);
  closeBtn.addEventListener("click", closeCart);
  overlay.addEventListener("click", closeCart);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (checkoutModal.classList.contains("checkout-modal--active"))
        closeCheckout();
      else if (cartModal.classList.contains("cart-modal--active")) closeCart();
    }
  });

  // Добавление в корзину
  document.querySelectorAll(".menu-card__btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      addToCart(parseInt(btn.dataset.id));
      cartIcon.style.transform = "scale(1.3)";
      setTimeout(() => {
        cartIcon.style.transform = "scale(1)";
      }, 200);
    });
  });

  // Оформление заказа
  checkoutBtn.addEventListener("click", openCheckout);
  checkoutCloseBtn.addEventListener("click", closeCheckout);
  checkoutOverlay.addEventListener("click", closeCheckout);

  successCloseBtn.addEventListener("click", () => {
    closeCheckout();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Валидация в реальном времени
  Object.keys(validators).forEach((fieldId) => {
    const input = document.getElementById(fieldId);
    if (!input) return;
    input.addEventListener("input", () => validateField(fieldId));
    input.addEventListener("blur", () => validateField(fieldId));
  });

  // Отправка формы
  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submitBtn = checkoutForm.querySelector(".checkout-form__submit");
    const submitText = submitBtn.querySelector(".checkout-form__submit-text");
    const submitLoading = submitBtn.querySelector(
      ".checkout-form__submit-loading",
    );

    submitBtn.disabled = true;
    submitText.style.display = "none";
    submitLoading.style.display = "flex";

    setTimeout(() => {
      checkoutForm.style.display = "none";
      checkoutSuccess.classList.add("checkout-success--active");
      cart = [];
      updateCartCount();
      localStorage.removeItem("spaceBurgerCart");

      submitBtn.disabled = false;
      submitText.style.display = "inline";
      submitLoading.style.display = "none";
      checkoutForm.style.display = "flex";
    }, 2000);
  });

  // Анимация появления "О нас"
  if (featureCards.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("about__feature--visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 },
    );
    featureCards.forEach((card) => observer.observe(card));
  }

  // Фильтрация меню
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) =>
        b.classList.remove("menu-filters__btn--active"),
      );
      btn.classList.add("menu-filters__btn--active");
      const filterValue = btn.dataset.filter;

      menuCards.forEach((card) => {
        const categories = card.dataset.category.split(" ");
        if (filterValue === "all" || categories.includes(filterValue)) {
          card.classList.remove("menu-card--hidden");
          card.classList.add("menu-card--visible");
        } else {
          card.classList.remove("menu-card--visible");
          card.classList.add("menu-card--hidden");
        }
      });
    });
  });
  // === КНОПКА "НАВЕРХ" ===
  const backToTopBtn = document.getElementById("backToTop");

  // Показываем/скрываем кнопку при скролле
  window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add("back-to-top--visible");
    } else {
      backToTopBtn.classList.remove("back-to-top--visible");
    }
  });

  // Плавный скролл наверх при клике
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
  // === КОСМИЧЕСКИЙ ПРЕЛОАДЕР ===
  const preloader = document.getElementById("preloader");

  // Ждем полной загрузки всех ресурсов (картинок, шрифтов, скриптов)
  window.addEventListener("load", () => {
    // Небольшая задержка (800мс), чтобы пользователь успел насладиться анимацией
    // Иначе на быстрых соединениях прелоадер мелькнет слишком быстро
    setTimeout(() => {
      preloader.classList.add("preloader--hidden");
    }, 800);
  });
});
