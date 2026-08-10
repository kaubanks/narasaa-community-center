(() => {
  const sliders = document.querySelectorAll("[data-slider]");
  if (!sliders.length) return;

  sliders.forEach((slider) => {
    const track = slider.querySelector(".slider__track");
    const slides = slider.querySelectorAll(".slider__slide");
    const prev = slider.querySelector("[data-slider-prev]");
    const next = slider.querySelector("[data-slider-next]");
    if (!track || slides.length < 2) return;

    let index = 0;
    let timer;

    const goTo = (i) => {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
    };

    const start = () => {
      stop();
      timer = window.setInterval(() => goTo(index + 1), 6000);
    };

    const stop = () => {
      if (timer) window.clearInterval(timer);
    };

    prev?.addEventListener("click", () => {
      goTo(index - 1);
      start();
    });

    next?.addEventListener("click", () => {
      goTo(index + 1);
      start();
    });

    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", start);
    slider.addEventListener("focusin", stop);
    slider.addEventListener("focusout", start);

    goTo(0);
    start();
  });
})();
