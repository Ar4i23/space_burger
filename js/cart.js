// === ДАННЫЕ О ТОВАРАХ ===
import { products } from "./data.js";

// === СОСТОЯНИЕ КОРЗИНЫ ===
let cart = [];

// === ФУНКЦИИ КОРЗИНЫ ===
export function getCart() {
  return cart;
}

export function updateCartCount(cartCount) {
  if (cartCount)
    cartCount.textContent = cart.reduce((s, i) => s + i.quantity, 0);
}

export function saveCart() {
  localStorage.setItem("spaceBurgerCart", JSON.stringify(cart));
}

export function loadCart() {
  const s = localStorage.getItem("spaceBurgerCart");
  if (s) {
    try {
      cart = JSON.parse(s);
      return cart;
    } catch {
      cart = [];
      localStorage.removeItem("spaceBurgerCart");
    }
  }
  return [];
}

export function addToCart(productId, showToast, cartIcon) {
  const existing = cart.find((i) => i.id === productId);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  updateCartCount(document.querySelector(".btn-cart__count"));
  saveCart();

  if (showToast) showToast(`${products[productId].name} добавлен!`);

  if (cartIcon) {
    cartIcon.style.transform = "scale(1.3)";
    setTimeout(() => {
      cartIcon.style.transform = "scale(1)";
    }, 200);
  }
}

export function renderCart(cartItemsContainer, cartFooter, cartTotal) {
  if (!cart.length) {
    cartItemsContainer.innerHTML = `<div class="cart-modal__empty"><i class="fa-solid fa-cart-shopping cart-modal__empty-icon"></i><p>Корзина пуста</p><p class="cart-modal__empty-text">Добавь что-нибудь вкусное!</p></div>`;
    cartFooter.style.display = "none";
    return;
  }

  let html = "",
    total = 0;
  cart.forEach((i) => {
    const p = products[i.id];
    if (!p) return;
    const t = p.price * i.quantity;
    total += t;
    html += `<div class="cart-item"><img src="${p.image}" alt="${p.name}" class="cart-item__img"><div class="cart-item__info"><h3 class="cart-item__title">${p.name}</h3><span class="cart-item__price">${t} ₽</span></div><div class="cart-item__controls"><div class="cart-item__quantity"><button class="cart-item__btn cart-item__decrease" data-id="${i.id}">−</button><span class="cart-item__count">${i.quantity}</span><button class="cart-item__btn cart-item__increase" data-id="${i.id}">+</button></div><button class="cart-item__remove" data-id="${i.id}" aria-label="Удалить"><i class="fa-solid fa-trash"></i></button></div></div>`;
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

export function changeQty(id, d) {
  const i = cart.find((x) => x.id === id);
  if (i) {
    i.quantity += d;
    if (i.quantity <= 0) removeItem(id);
    else {
      updateCartCount(document.querySelector(".btn-cart__count"));
      saveCart();
      renderCart(
        document.getElementById("cartItems"),
        document.getElementById("cartFooter"),
        document.getElementById("cartTotal"),
      );
    }
  }
}

export function removeItem(id) {
  cart = cart.filter((i) => i.id !== id);
  updateCartCount(document.querySelector(".btn-cart__count"));
  saveCart();
  renderCart(
    document.getElementById("cartItems"),
    document.getElementById("cartFooter"),
    document.getElementById("cartTotal"),
  );
}

export function clearCart() {
  cart = [];
  updateCartCount(document.querySelector(".btn-cart__count"));
  saveCart();
}
