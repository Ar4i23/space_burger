import { products } from "./data.js";
import { showToast } from "./ui.js";
import { addToCart } from "./cart.js";

export function initBuilder() {
  const burgerStack = document.getElementById("burgerStack");
  const builderPriceEl = document.getElementById("builderPrice");
  const addCustomToCartBtn = document.getElementById("addCustomToCart");
  const resetBuilderBtn = document.getElementById("resetBuilder");

  let customBurger = { layers: [], totalPrice: 0 };

  document.querySelectorAll(".builder__option").forEach((btn) => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.type,
        name = btn.dataset.name,
        price = parseInt(btn.dataset.price),
        visual = btn.dataset.visual;

      if (customBurger.layers.length === 0 && type !== "bun-bottom") {
        showToast("Сначала добавь нижнюю булочку!", "🛑");
        return;
      }

      if (type === "bun-bottom") {
        const bottomBunsCount = customBurger.layers.filter(
          (l) => l.type === "bun-bottom",
        ).length;
        if (bottomBunsCount >= 2) {
          showToast("Максимум 2 нижние булочки!", "️");
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
      if (type === "bun-bottom")
        layerEl.className = "builder__layer builder__layer--bun-bottom";
      else if (type === "bun-top")
        layerEl.className = "builder__layer builder__layer--bun-top";
      else layerEl.className = "builder__layer";

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
    addToCart(customId, showToast, document.querySelector(".btn-cart"));
    products[customId].name = originalName;

    resetBuilderBtn.click();
  });
}
