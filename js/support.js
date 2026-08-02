document.addEventListener("DOMContentLoaded", () => {
  // === ЭЛЕМЕНТЫ DOM ===
  const chatMessages = document.getElementById("chatMessages");
  const chatInput = document.getElementById("chatInput");
  const messageField = document.getElementById("messageField");
  const chatTyping = document.getElementById("chatTyping");
  const burgerBtn = document.querySelector(".burger-btn");
  const nav = document.querySelector(".nav");
  const navLinks = document.querySelectorAll(".nav__link");

  // === ОТПРАВКА СООБЩЕНИЯ ===
  if (chatInput) {
    chatInput.addEventListener("submit", (e) => {
      e.preventDefault();
      const message = messageField.value.trim();
      if (!message) return;

      // Добавляем сообщение пользователя
      addMessage(message, "user");
      messageField.value = "";

      // Показываем индикатор печати
      showTyping();

      // Имитация ответа поддержки
      setTimeout(
        () => {
          hideTyping();
          const response = getSupportResponse(message);
          addMessage(response, "support");
        },
        1500 + Math.random() * 1000,
      );
    });
  }

  // === ДОБАВЛЕНИЕ СООБЩЕНИЯ ===
  function addMessage(text, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message message--${sender}`;

    const time = new Date().toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });

    messageDiv.innerHTML = `
      <div class="message__content">
        <p>${text}</p>
      </div>
      <div class="message__meta">
        <span class="message__time">${time}</span>
        ${
          sender === "user"
            ? `
          <span class="message__status">
            <i class="fa-solid fa-check"></i>
          </span>
        `
            : ""
        }
      </div>
    `;

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // === ПОКАЗ ИНДИКАТОРА ПЕЧАТИ ===
  function showTyping() {
    if (chatTyping) {
      chatTyping.classList.add("chat-typing--active");
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }

  // === СКРЫТИЕ ИНДИКАТОРА ПЕЧАТИ ===
  function hideTyping() {
    if (chatTyping) {
      chatTyping.classList.remove("chat-typing--active");
    }
  }

  // === ОТВЕТЫ ПОДДЕРЖКИ ===
  function getSupportResponse(message) {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("время") || lowerMessage.includes("доставк")) {
      return "Доставка занимает 30-45 минут. Мы работаем круглосуточно! 🚀";
    } else if (
      lowerMessage.includes("цена") ||
      lowerMessage.includes("стоим") ||
      lowerMessage.includes("сколько")
    ) {
      return "Цены указаны в меню. При заказе от 1000₽ доставка бесплатная! ";
    } else if (
      lowerMessage.includes("оплат") ||
      lowerMessage.includes("платит")
    ) {
      return "Принимаем наличные и карты при получении. Также можно оплатить онлайн! 💳";
    } else if (lowerMessage.includes("адрес") || lowerMessage.includes("где")) {
      return "Мы находимся по адресу: ул. Галактическая, 42. Работаем по всей Москве! 📍";
    } else if (
      lowerMessage.includes("спасиб") ||
      lowerMessage.includes("благодар")
    ) {
      return "Всегда рады помочь! Приятного аппетита! 🌟";
    } else if (
      lowerMessage.includes("привет") ||
      lowerMessage.includes("здравств")
    ) {
      return "Привет! 👋 Чем можем помочь?";
    } else {
      return "Спасибо за сообщение! Наш оператор скоро ответит вам. Обычно это занимает до 5 минут. ⏱️";
    }
  }

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
