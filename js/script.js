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
    7: { id: 7, name: "Фри (Мал.)", price: 150, image: "img/fries-small.webp" },
    8: {
      id: 8,
      name: "По-деревенски (Мал.)",
      price: 190,
      image:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Ctext x='50%25' y='50%25' font-size='40' text-anchor='middle' dy='.3em'%3E🥔%3C/text%3E%3C/svg%3E",
    },
    9: {
      id: 9,
      name: "Острый метеорит",
      price: 210,
      image: "img/spicy-fries.webp",
    },
    10: {
      id: 10,
      name: "Батат фри",
      price: 240,
      image: "img/sweet-potato.webp",
    },
    11: {
      id: 11,
      name: "Фри (Бол.)",
      price: 220,
      image:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Ctext x='50%25' y='50%25' font-size='40' text-anchor='middle' dy='.3em'%3E🍟%3C/text%3E%3C/svg%3E",
    },
    12: {
      id: 12,
      name: "По-деревенски (Бол.)",
      price: 260,
      image:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Ctext x='50%25' y='50%25' font-size='40' text-anchor='middle' dy='.3em'%3E🥔%3C/text%3E%3C/svg%3E",
    },

    // --- СОУСЫ (исправлены пути к изображениям) ---
    13: {
      id: 13,
      name: "Чесночный соус",
      price: 60,
      image: "img/sauce-garlic.webp",
    },
    14: {
      id: 14,
      name: "Сырный соус",
      price: 70,
      image: "img/sauce-cheese.webp",
    },
    15: {
      id: 15,
      name: "Соус Искра",
      price: 80,
      image: "img/sauce-spicy.webp",
    },
    20: {
      id: 20,
      name: "Медово-горчичный",
      price: 70,
      image: "img/sauce-honey.webp",
    },
    21: { id: 21, name: "Кетчуп", price: 50, image: "img/sauce-ketchup.webp" },

    // --- НАПИТКИ (исправлены пути к изображениям) ---
    16: { id: 16, name: "Кола 0.5л", price: 120, image: "img/drink-cola.webp" },
    17: {
      id: 17,
      name: "Лимонад 0.4л",
      price: 180,
      image: "img/drink-lemonade.webp",
    },
    18: {
      id: 18,
      name: "Морс 0.4л",
      price: 160,
      image: "img/drink-morse.webp",
    },
    19: { id: 19, name: "Чай 0.3л", price: 100, image: "img/drink-tea.webp" },
    22: {
      id: 22,
      name: "Американо 0.3л",
      price: 170,
      image: "img/drink-americano.webp",
    },
    23: {
      id: 23,
      name: "Молочный коктейль",
      price: 200,
      image: "img/drink-milkshake.webp",
    },
    24: { id: 24, name: "Вода 0.5л", price: 80, image: "img/drink-water.webp" },
    25: {
      id: 25,
      name: "Апельсиновый сок",
      price: 190,
      image: "img/drink-orange.webp",
    },
  };

  // ==========================================
  // 2. ЭЛЕМЕНТЫ DOM
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
  const clearCartBtn = document.getElementById("clearCartBtn"); // Кнопка очистки

  const checkoutModal = document.getElementById("checkoutModal");
  const checkoutForm = document.getElementById("checkoutForm");
  const checkoutTotal = document.getElementById("checkoutTotal");
  const checkoutSuccess = document.getElementById("checkoutSuccess");
  const successCloseBtn = document.getElementById("successCloseBtn");
  const checkoutCloseBtn = document.querySelector(".checkout-modal__close");
  const checkoutOverlay = document.querySelector(".checkout-modal__overlay");

  // Элементы модального окна подтверждения
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

  const reviewsSlides = document.getElementById("reviewsSlides");
  const reviewsDotsContainer = document.getElementById("reviewsDots");
  const prevBtn = document.querySelector(".reviews__btn--prev");
  const nextBtn = document.querySelector(".reviews__btn--next");

  const backToTopBtn = document.getElementById("backToTop");
  const preloader = document.getElementById("preloader");

  // ==========================================
  // 3. СОСТОЯНИЕ КОРЗИНЫ
  // ==========================================
  let cart = [];

  // ==========================================
  // 4. ФУНКЦИИ КОРЗИНЫ
  // ==========================================
  function updateCartCount() {
    if (cartCount)
      cartCount.textContent = cart.reduce((s, i) => s + i.quantity, 0);
  }

  function saveCart() {
    localStorage.setItem("spaceBurgerCart", JSON.stringify(cart));
  }

  function loadCart() {
    const s = localStorage.getItem("spaceBurgerCart");
    if (s) {
      try {
        cart = JSON.parse(s);
        updateCartCount();
      } catch {
        cart = [];
        localStorage.removeItem("spaceBurgerCart");
      }
    }
  }

  function showToast(message, icon = "🍔") {
    const c = document.getElementById("toast-container");
    const t = document.createElement("div");
    t.className = "toast";
    t.innerHTML = `<span class="toast__icon">${icon}</span><span>${message}</span>`;
    c.appendChild(t);
    setTimeout(() => {
      t.classList.add("toast--hide");
      setTimeout(() => t.remove(), 300);
    }, 3000);
  }

  function addToCart(productId) {
    const e = cart.find((i) => i.id === productId);
    if (e) e.quantity++;
    else cart.push({ id: productId, quantity: 1 });

    updateCartCount();
    saveCart();
    showToast(`${products[productId].name} добавлен!`);

    cartIcon.style.transform = "scale(1.3)";
    setTimeout(() => {
      cartIcon.style.transform = "scale(1)";
    }, 200);

    if (cartModal.classList.contains("cart-modal--active")) renderCart();
  }

  const allAddToCartBtns = document.querySelectorAll(
    ".menu-card__btn, .sputniki-card__btn, .sputniki-card__size-btn, .napitki-card__btn",
  );

  allAddToCartBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      addToCart(parseInt(btn.dataset.id));
    });
  });

  function openCart() {
    cartModal.classList.add("cart-modal--active");
    document.body.style.overflow = "hidden";
    renderCart();
  }

  function closeCart() {
    cartModal.classList.remove("cart-modal--active");
    document.body.style.overflow = "";
  }

  function renderCart() {
    if (!cart.length) {
      cartItemsContainer.innerHTML = `<div class="cart-modal__empty"><span class="cart-modal__empty-icon">🛒</span><p>Корзина пуста</p><p class="cart-modal__empty-text">Добавь что-нибудь вкусное!</p></div>`;
      cartFooter.style.display = "none";
      return;
    }

    let html = "",
      total = 0;
    cart.forEach((i) => {
      const p = products[i.id];
      const t = p.price * i.quantity;
      total += t;
      html += `
        <div class="cart-item">
          <img src="${p.image}" alt="${p.name}" class="cart-item__img">
          <div class="cart-item__info">
            <h3 class="cart-item__title">${p.name}</h3>
            <span class="cart-item__price">${t} ₽</span>
          </div>
          <div class="cart-item__controls">
            <div class="cart-item__quantity">
              <button class="cart-item__btn cart-item__decrease" data-id="${i.id}">−</button>
              <span class="cart-item__count">${i.quantity}</span>
              <button class="cart-item__btn cart-item__increase" data-id="${i.id}">+</button>
            </div>
            <button class="cart-item__remove" data-id="${i.id}" aria-label="Удалить">🗑</button>
          </div>
        </div>`;
    });

    cartItemsContainer.innerHTML = html;
    cartTotal.textContent = `${total} ₽`;
    cartFooter.style.display = "block";

    document
      .querySelectorAll(".cart-item__increase")
      .forEach((b) =>
        b.addEventListener("click", () => changeQty(+b.dataset.id, 1)),
      );
    document
      .querySelectorAll(".cart-item__decrease")
      .forEach((b) =>
        b.addEventListener("click", () => changeQty(+b.dataset.id, -1)),
      );
    document
      .querySelectorAll(".cart-item__remove")
      .forEach((b) =>
        b.addEventListener("click", () => removeItem(+b.dataset.id)),
      );
  }

  function changeQty(id, d) {
    const i = cart.find((x) => x.id === id);
    if (i) {
      i.quantity += d;
      if (i.quantity <= 0) removeItem(id);
      else {
        updateCartCount();
        saveCart();
        renderCart();
      }
    }
  }

  function removeItem(id) {
    cart = cart.filter((i) => i.id !== id);
    updateCartCount();
    saveCart();
    renderCart();
  }

  // ==========================================
  // 5. ОФОРМЛЕНИЕ ЗАКАЗА И ВАЛИДАЦИЯ
  // ==========================================
  function openCheckout() {
    if (!cart.length) return;
    checkoutTotal.textContent = `${cart.reduce((s, i) => s + products[i.id].price * i.quantity, 0)} ₽`;
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

  cartIcon.addEventListener("click", openCart);
  closeBtn.addEventListener("click", closeCart);
  overlay.addEventListener("click", closeCart);
  checkoutBtn.addEventListener("click", openCheckout);
  checkoutCloseBtn.addEventListener("click", closeCheckout);
  checkoutOverlay.addEventListener("click", closeCheckout);

  successCloseBtn.addEventListener("click", () => {
    closeCheckout();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // === НОВАЯ ЛОГИКА: КНОПКА "ОЧИСТИТЬ КОРЗИНУ" С ПОПАПОМ ===
  function openConfirmModal() {
    confirmModal.classList.add("confirm-modal--active");
    document.body.style.overflow = "hidden";
  }

  function closeConfirmModal() {
    confirmModal.classList.remove("confirm-modal--active");
    document.body.style.overflow = "";
  }

  clearCartBtn.addEventListener("click", () => {
    if (cart.length === 0) return;
    openConfirmModal();
  });

  confirmCancelBtn.addEventListener("click", closeConfirmModal);
  confirmOverlay.addEventListener("click", closeConfirmModal);

  confirmOkBtn.addEventListener("click", () => {
    cart = [];
    updateCartCount();
    saveCart();
    renderCart();
    closeConfirmModal();
    showToast("Корзина очищена", "🗑️");
  });

  // Обновленный обработчик Escape для всех модалок
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (confirmModal.classList.contains("confirm-modal--active")) {
        closeConfirmModal();
      } else if (checkoutModal.classList.contains("checkout-modal--active")) {
        closeCheckout();
      } else if (cartModal.classList.contains("cart-modal--active")) {
        closeCart();
      }
    }
  });

  function clearErrors() {
    document
      .querySelectorAll(".checkout-form__input")
      .forEach((i) =>
        i.classList.remove(
          "checkout-form__input--error",
          "checkout-form__input--valid",
        ),
      );
    document
      .querySelectorAll(".checkout-form__error")
      .forEach((e) => e.classList.remove("checkout-form__error--visible"));
  }

  function showError(id, eid) {
    const i = document.getElementById(id),
      e = document.getElementById(eid);
    if (i) i.classList.add("checkout-form__input--error");
    if (e) e.classList.add("checkout-form__error--visible");
  }

  const validators = {
    name: { r: /^[a-zA-Zа-яА-ЯёЁ\s\-]{2,50}$/, e: "nameError" },
    phone: {
      r: /^(\+7|8)[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/,
      e: "phoneError",
    },
    address: {
      r: /^(?=.*\d)(?=.*[a-zA-Zа-яА-ЯёЁ]).{5,100}$/,
      e: "addressError",
    },
  };

  function validateField(fid) {
    const i = document.getElementById(fid);
    if (!i) return false;
    const v = i.value.trim(),
      val = validators[fid],
      err = document.getElementById(val.e);

    if (!v.length) {
      i.classList.remove(
        "checkout-form__input--error",
        "checkout-form__input--valid",
      );
      if (err) err.classList.remove("checkout-form__error--visible");
      return false;
    }
    if (!val.r.test(v)) {
      i.classList.add("checkout-form__input--error");
      i.classList.remove("checkout-form__input--valid");
      if (err) err.classList.add("checkout-form__error--visible");
      return false;
    }
    i.classList.remove("checkout-form__input--error");
    i.classList.add("checkout-form__input--valid");
    if (err) err.classList.remove("checkout-form__error--visible");
    return true;
  }

  Object.keys(validators).forEach((f) => {
    const i = document.getElementById(f);
    if (!i) return;
    i.addEventListener("input", () => validateField(f));
    i.addEventListener("blur", () => validateField(f));
  });

  function validateForm() {
    let ok = true;
    if (!validators.name.r.test(document.getElementById("name").value.trim())) {
      showError("name", validators.name.e);
      ok = false;
    }
    if (
      !validators.phone.r.test(document.getElementById("phone").value.trim())
    ) {
      showError("phone", validators.phone.e);
      ok = false;
    }
    if (
      !validators.address.r.test(
        document.getElementById("address").value.trim(),
      )
    ) {
      showError("address", validators.address.e);
      ok = false;
    }
    return ok;
  }

  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const btn = checkoutForm.querySelector(".checkout-form__submit"),
      txt = btn.querySelector(".checkout-form__submit-text"),
      ld = btn.querySelector(".checkout-form__submit-loading");

    btn.disabled = true;
    txt.style.display = "none";
    ld.style.display = "flex";

    setTimeout(() => {
      checkoutForm.style.display = "none";
      checkoutSuccess.classList.add("checkout-success--active");
      cart = [];
      updateCartCount();
      localStorage.removeItem("spaceBurgerCart");
      btn.disabled = false;
      txt.style.display = "inline";
      ld.style.display = "none";
      checkoutForm.style.display = "flex";
    }, 2000);
  });

  // ==========================================
  // 6. АНИМАЦИИ И ИНТЕРАКТИВ
  // ==========================================
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

  // ==========================================
  // 7. КАРУСЕЛЬ ОТЗЫВОВ
  // ==========================================
  let cur = 0;
  const tot = reviewsSlides.children.length;
  let autoInt;

  for (let i = 0; i < tot; i++) {
    const d = document.createElement("button");
    d.className = "reviews__dot";
    d.setAttribute("aria-label", `Отзыв ${i + 1}`);
    d.addEventListener("click", () => goTo(i));
    reviewsDotsContainer.appendChild(d);
  }

  const dots = document.querySelectorAll(".reviews__dot");

  function upd() {
    reviewsSlides.style.transform = `translateX(-${cur * 100}%)`;
    dots.forEach((d, i) =>
      d.classList.toggle("reviews__dot--active", i === cur),
    );
    prevBtn.disabled = cur === 0;
    nextBtn.disabled = cur === tot - 1;
  }

  function goTo(i) {
    cur = i;
    upd();
    resetAuto();
  }
  function nxt() {
    cur = (cur + 1) % tot;
    upd();
  }
  function prv() {
    cur = (cur - 1 + tot) % tot;
    upd();
  }
  function startAuto() {
    autoInt = setInterval(nxt, 5000);
  }
  function resetAuto() {
    clearInterval(autoInt);
    startAuto();
  }

  nextBtn.addEventListener("click", () => {
    nxt();
    resetAuto();
  });
  prevBtn.addEventListener("click", () => {
    prv();
    resetAuto();
  });
  reviewsSlides.addEventListener("mouseenter", () => clearInterval(autoInt));
  reviewsSlides.addEventListener("mouseleave", startAuto);

  let tx = 0;
  reviewsSlides.addEventListener(
    "touchstart",
    (e) => {
      tx = e.changedTouches[0].screenX;
    },
    { passive: true },
  );
  reviewsSlides.addEventListener(
    "touchend",
    (e) => {
      const d = tx - e.changedTouches[0].screenX;
      if (Math.abs(d) > 50) {
        d > 0 ? nxt() : prv();
        resetAuto();
      }
    },
    { passive: true },
  );

  upd();
  startAuto();

  // ==========================================
  // 8. КОНСТРУКТОР БУРГЕРА
  // ==========================================
  const burgerStack = document.getElementById("burgerStack");
  const builderPriceEl = document.getElementById("builderPrice");
  const addCustomToCartBtn = document.getElementById("addCustomToCart");
  const resetBuilderBtn = document.getElementById("resetBuilder");

  let customBurger = { layers: [], totalPrice: 0 };

  document.querySelectorAll(".builder__option").forEach((btn) => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.type;
      const name = btn.dataset.name;
      const price = parseInt(btn.dataset.price);
      const visual = btn.dataset.visual;

      if (customBurger.layers.length === 0 && type !== "bun-bottom") {
        showToast("Сначала добавь нижнюю булочку!", "🛑");
        return;
      }

      if (type === "bun-bottom") {
        const bottomBunsCount = customBurger.layers.filter(
          (l) => l.type === "bun-bottom",
        ).length;
        if (bottomBunsCount >= 2) {
          showToast("Максимум 2 нижние булочки!", "⚠️");
          return;
        }
        customBurger.layers = customBurger.layers.filter(
          (l) => l.type !== "bun-bottom",
        );
        const oldBun = burgerStack.querySelector(".builder__layer--bun-bottom");
        if (oldBun) oldBun.remove();

        const emptyState = burgerStack.querySelector(".builder__empty-state");
        if (emptyState) emptyState.style.display = "none";
      }

      if (type === "bun-top") {
        const topBunsCount = customBurger.layers.filter(
          (l) => l.type === "bun-top",
        ).length;
        if (topBunsCount >= 1) {
          showToast("Верхняя булочка уже добавлена!", "⚠️");
          return;
        }
        customBurger.layers = customBurger.layers.filter(
          (l) => l.type !== "bun-top",
        );
        const oldBun = burgerStack.querySelector(".builder__layer--bun-top");
        if (oldBun) oldBun.remove();
      }

      customBurger.layers.push({ type, name, price, visual });
      customBurger.totalPrice += price;

      const layerEl = document.createElement("div");
      if (type === "bun-bottom") {
        layerEl.className = "builder__layer builder__layer--bun-bottom";
      } else if (type === "bun-top") {
        layerEl.className = "builder__layer builder__layer--bun-top";
      } else {
        layerEl.className = "builder__layer";
      }

      layerEl.textContent = visual;
      layerEl.title = name;
      burgerStack.appendChild(layerEl);

      updateBuilderUI();
    });
  });

  resetBuilderBtn.addEventListener("click", () => {
    customBurger = { layers: [], totalPrice: 0 };
    burgerStack.innerHTML = `<div class="builder__empty-state"><span>🍽️</span><p>Начни сборку с нижней булочки!</p></div>`;
    updateBuilderUI();
  });

  function updateBuilderUI() {
    builderPriceEl.textContent = `${customBurger.totalPrice} ₽`;
    const hasBottomBun = customBurger.layers.some(
      (l) => l.type === "bun-bottom",
    );
    const hasFilling = customBurger.layers.some(
      (l) => l.type === "patty" || l.type === "topping",
    );

    if (hasBottomBun && hasFilling) {
      addCustomToCartBtn.disabled = false;
      addCustomToCartBtn.textContent = `🛒 В корзину за ${customBurger.totalPrice} ₽`;
    } else {
      addCustomToCartBtn.disabled = true;
      addCustomToCartBtn.textContent = "🛒 Добавь булку и начинку";
    }
  }

  addCustomToCartBtn.addEventListener("click", () => {
    if (customBurger.layers.length === 0) return;
    const ingredientsList = customBurger.layers.map((l) => l.name).join(", ");
    const customName = `Кастом: ${ingredientsList}`;
    const customId = 999;

    if (!products[customId]) {
      products[customId] = {
        id: customId,
        name: "Конструктор Бургер",
        price: customBurger.totalPrice,
        image:
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Ctext x='50%25' y='50%25' font-size='40' text-anchor='middle' dy='.3em'%3E🛠️%3C/text%3E%3C/svg%3E",
      };
    } else {
      products[customId].price = customBurger.totalPrice;
      products[customId].name = customName;
    }

    const originalName = products[customId].name;
    products[customId].name = "Кастомный бургер";
    addToCart(customId);
    products[customId].name = originalName;

    resetBuilderBtn.click();
    setTimeout(() => {
      if (!cartModal.classList.contains("cart-modal--active")) openCart();
    }, 500);
  });

  // Запускаем загрузку корзины в самом конце
  loadCart();
});
