// ============================================
// ПРОГРАММА ЛОЯЛЬНОСТИ — SPACE BURGER
// ============================================

export const RANKS = [
  {
    name: "Кадет",
    icon: "🥉",
    minOrders: 0,
    discount: 0,
    bonus: "Базовые бонусы",
    color: "#cd7f32",
  },
  {
    name: "Пилот",
    icon: "🥈",
    minOrders: 4,
    discount: 5,
    bonus: "Скидка 5% на все заказы",
    color: "#c0c0c0",
  },
  {
    name: "Капитан",
    icon: "🥇",
    minOrders: 10,
    discount: 10,
    bonus: "Скидка 10% + бесплатный напиток",
    color: "#ffd700",
  },
  {
    name: "Командор",
    icon: "👑",
    minOrders: 20,
    discount: 15,
    bonus: "Скидка 15% + приоритетная доставка",
    color: "#6c63ff",
  },
];

// Кодовое слово для секретного меню
export const SECRET_CODE = "GALAXY";

// === ПОЛУЧИТЬ ТЕКУЩИЙ РАНГ ===
export function getCurrentRank() {
  const orders = getUserOrders();
  let currentRank = RANKS[0];

  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (orders >= RANKS[i].minOrders) {
      currentRank = RANKS[i];
      break;
    }
  }

  return currentRank;
}

// === ПОЛУЧИТЬ СЛЕДУЮЩИЙ РАНГ ===
export function getNextRank() {
  const currentRank = getCurrentRank();
  const currentIndex = RANKS.findIndex((r) => r.name === currentRank.name);

  if (currentIndex < RANKS.length - 1) {
    return RANKS[currentIndex + 1];
  }
  return null;
}

// === ПОЛУЧИТЬ КОЛИЧЕСТВО ЗАКАЗОВ ===
export function getUserOrders() {
  return parseInt(localStorage.getItem("spaceBurgerOrders") || "0");
}

// === УВЕЛИЧИТЬ СЧЁТЧИК ЗАКАЗОВ ===
export function incrementOrders() {
  const orders = getUserOrders() + 1;
  localStorage.setItem("spaceBurgerOrders", orders.toString());
  return orders;
}

// === РАССЧИТАТЬ ПРОГРЕСС ===
export function getProgressPercent() {
  const orders = getUserOrders();
  const nextRank = getNextRank();

  if (!nextRank) return 100;

  const currentRank = getCurrentRank();
  const progress =
    ((orders - currentRank.minOrders) /
      (nextRank.minOrders - currentRank.minOrders)) *
    100;

  return Math.min(100, Math.max(0, progress));
}

// === ПРИМЕНИТЬ СКИДКУ ===
export function applyDiscount(total) {
  const rank = getCurrentRank();
  const discount = total * (rank.discount / 100);
  return {
    original: total,
    discount: discount,
    final: total - discount,
    percent: rank.discount,
  };
}

// === ПРОВЕРИТЬ СЕКРЕТНЫЙ КОД ===
export function checkSecretCode(input) {
  return input.trim().toUpperCase() === SECRET_CODE;
}

// === ИНИЦИАЛИЗАЦИЯ СЕКЦИИ ЛОЯЛЬНОСТИ ===
export function initLoyalty() {
  const loyaltySection = document.getElementById("loyaltySection");
  if (!loyaltySection) return;

  const currentRank = getCurrentRank();
  const nextRank = getNextRank();
  const orders = getUserOrders();
  const progress = getProgressPercent();

  // Обновить текущий ранг
  const rankIcon = loyaltySection.querySelector(".loyalty__rank-icon");
  const rankName = loyaltySection.querySelector(".loyalty__rank-name");
  const rankBonus = loyaltySection.querySelector(".loyalty__rank-bonus");

  if (rankIcon) rankIcon.textContent = currentRank.icon;
  if (rankName) rankName.textContent = currentRank.name;
  if (rankBonus) rankBonus.textContent = currentRank.bonus;

  // Обновить прогресс
  const progressFill = loyaltySection.querySelector(".loyalty__progress-fill");
  const progressCurrent = loyaltySection.querySelector(
    ".loyalty__progress-current",
  );
  const progressNext = loyaltySection.querySelector(".loyalty__progress-next");

  if (progressFill) progressFill.style.width = `${progress}%`;
  if (progressCurrent) progressCurrent.textContent = orders;
  if (progressNext && nextRank) progressNext.textContent = nextRank.minOrders;

  // Подсветить активный ранг
  const rankCards = loyaltySection.querySelectorAll(".loyalty__rank-card");
  rankCards.forEach((card) => {
    const cardName = card.dataset.rank;
    if (cardName === currentRank.name) {
      card.classList.add("loyalty__rank-card--active");
    }
  });

  // Обработка секретного кода
  const secretForm = loyaltySection.querySelector(".secret-menu__form");
  const secretInput = loyaltySection.querySelector(".secret-menu__input");
  const secretMessage = loyaltySection.querySelector(".secret-menu__message");
  const secretItems = loyaltySection.querySelector(".secret-items");

  if (secretForm && secretInput) {
    secretForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const code = secretInput.value;

      if (checkSecretCode(code)) {
        if (secretMessage) {
          secretMessage.textContent =
            "✅ Доступ получен! Секретное меню разблокировано!";
          secretMessage.className =
            "secret-menu__message secret-menu__message--success";
        }
        if (secretItems) {
          secretItems.classList.add("secret-items--visible");
          // Плавная прокрутка к секретному меню
          setTimeout(() => {
            secretItems.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 300);
        }
        secretInput.value = "";
      } else {
        if (secretMessage) {
          secretMessage.textContent = "❌ Неверный код. Попробуйте ещё раз.";
          secretMessage.className =
            "secret-menu__message secret-menu__message--error";
          setTimeout(() => {
            secretMessage.textContent = "";
          }, 3000);
        }
      }
    });
  }
}
