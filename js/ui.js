// === UI ФУНКЦИИ ===
export function showToast(message, icon = "🍔") {
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

export function openCart(cartModal) {
  cartModal.classList.add("cart-modal--active");
  document.body.style.overflow = "hidden";
}

export function closeCart(cartModal) {
  cartModal.classList.remove("cart-modal--active");
  document.body.style.overflow = "";
}

export function openConfirmModal(confirmModal) {
  confirmModal.classList.add("confirm-modal--active");
  document.body.style.overflow = "hidden";
}

export function closeConfirmModal(confirmModal) {
  confirmModal.classList.remove("confirm-modal--active");
  document.body.style.overflow = "";
}

// === ВАЛИДАЦИЯ ===
const validators = {
  name: { r: /^[a-zA-Zа-яА-ЯёЁ\s\-]{2,50}$/, e: "nameError" },
  phone: {
    r: /^(\+7|8)[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/,
    e: "phoneError",
  },
  address: { r: /^(?=.*\d)(?=.*[a-zA-Zа-яА-ЯёЁ]).{5,100}$/, e: "addressError" },
};

export function clearErrors() {
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

export function validateField(fid) {
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

export function validateForm() {
  let ok = true;
  if (!validators.name.r.test(document.getElementById("name").value.trim())) {
    document
      .getElementById("name")
      .classList.add("checkout-form__input--error");
    document
      .getElementById("nameError")
      .classList.add("checkout-form__error--visible");
    ok = false;
  }
  if (!validators.phone.r.test(document.getElementById("phone").value.trim())) {
    document
      .getElementById("phone")
      .classList.add("checkout-form__input--error");
    document
      .getElementById("phoneError")
      .classList.add("checkout-form__error--visible");
    ok = false;
  }
  if (
    !validators.address.r.test(document.getElementById("address").value.trim())
  ) {
    document
      .getElementById("address")
      .classList.add("checkout-form__input--error");
    document
      .getElementById("addressError")
      .classList.add("checkout-form__error--visible");
    ok = false;
  }
  return ok;
}
