const BOT_TOKEN = "8946313981:AAHENxzOhnkfYzPSk8q41-yUW3j5VWQRz38";
const CHAT_ID = "5234629479"; // УБЕДИСЬ, ЧТО ТУТ ТВОИ ЦИФРЫ!

export function sendOrderToTelegram(orderData) {
  const text = `
🚀 НОВЫЙ ЗАКАЗ ИЗ SPACE BURGER!
-----------------------------
👤 Имя: ${orderData.name}
📱 Телефон: ${orderData.phone}
📍 Адрес: ${orderData.address}
💬 Комментарий: ${orderData.comment || "Нет"}
-----------------------------
🛒 Состав заказа:
${orderData.items.map((item) => `- ${item.name} x${item.quantity} = ${item.price * item.quantity} ₽`).join("\n")}
-----------------------------
💰 ИТОГО: ${orderData.total} ₽
  `.trim();

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: CHAT_ID, text: text }),
  }).then((response) => {
    if (!response.ok) {
      return response.json().then((err) => {
        console.error("❌ Ошибка Telegram API:", err.description);
        throw new Error(err.description);
      });
    }
    return response.json();
  });
}
