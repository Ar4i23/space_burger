export function initReviews() {
  const reviewsSlides = document.getElementById("reviewsSlides");
  const reviewsDotsContainer = document.getElementById("reviewsDots");
  const prevBtn = document.querySelector(".reviews__btn--prev");
  const nextBtn = document.querySelector(".reviews__btn--next");

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
}
