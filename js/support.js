document.addEventListener("DOMContentLoaded", () => {
  const chatMessages = document.getElementById("chatMessages");
  const chatInput = document.getElementById("chatInput");
  const messageField = document.getElementById("messageField");
  const chatTyping = document.getElementById("chatTyping");

  let messageId = 1;

  // Отправка сообщения
  chatInput.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = messageField.value.trim();
    if (!message) return;

    // Добавляем сообщение пользователя
    addUserMessage(message);
    messageField.value = "";

    // Показываем индикатор "печатает"
    showTyping();

    // Имитация ответа через 2-4 секунды
    setTimeout(
      () => {
        hideTyping();
        addSupportMessage(getRandomResponse());
      },
      2000 + Math.random() * 2000,
    );
  });

  // Добавление сообщения пользователя
  function addUserMessage(text) {
    const messageDiv = document.createElement("div");
    messageDiv.className = "message message--user";
    messageDiv.innerHTML = `
      <div class="message__content">
        <p>${text}</p>
      </div>
      <div class="message__meta">
        <span class="message__time">${getCurrentTime()}</span>
        <span class="message__status message__status--sent">
          <i class="fa-solid fa-check"></i>
        </span>
      </div>
    `;

    chatMessages.appendChild(messageDiv);
    scrollToBottom();

    // Обновляем статус на "прочитано" через 1 секунду
    setTimeout(() => {
      const statusIcon = messageDiv.querySelector(".message__status i");
      statusIcon.className = "fa-solid fa-check-double";
      messageDiv
        .querySelector(".message__status")
        .classList.remove("message__status--sent");
      messageDiv
        .querySelector(".message__status")
        .classList.add("message__status--read");
    }, 1000);
  }

  // Добавление сообщения поддержки
  function addSupportMessage(text) {
    const messageDiv = document.createElement("div");
    messageDiv.className = "message message--support";
    messageDiv.innerHTML = `
      <div class="message__content">
        <p>${text}</p>
      </div>
      <div class="message__meta">
        <span class="message__time">${getCurrentTime()}</span>
      </div>
    `;

    chatMessages.appendChild(messageDiv);
    scrollToBottom();
  }

  // Показать индикатор печати
  function showTyping() {
    chatTyping.classList.add("chat-typing--active");
    scrollToBottom();
  }

  // Скрыть индикатор печати
  function hideTyping() {
    chatTyping.classList.remove("chat-typing--active");
  }

  // Прокрутка вниз
  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Текущее время
  function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Случайные ответы для демо
  function getRandomResponse() {
    const responses = [
      "Спасибо за ваше сообщение! Мы обязательно свяжемся с вами в ближайшее время. 🚀",
      "Понял вас! Сейчас проверю информацию и отвечу. ☕",
      "Отличный вопрос! Дайте мне пару минут, чтобы найти точный ответ. ",
      "Хорошо, я вас услышал. Сейчас уточню детали у нашей команды. 👨‍🍳",
      "Благодарю за обращение! Мы ценим ваших клиентов и постараемся помочь как можно скорее. 💫",
      "Интересная ситуация! Позвольте мне изучить это подробнее. 🌟",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Мобильное меню
  const burgerBtn = document.querySelector(".burger-btn");
  const nav = document.querySelector(".nav");

  if (burgerBtn) {
    burgerBtn.addEventListener("click", () => {
      const isActive = nav.classList.toggle("nav--active");
      burgerBtn.setAttribute("aria-expanded", isActive);
      burgerBtn.classList.toggle("burger-btn--active");
    });
  }
});
