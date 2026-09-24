(() => {
  const hero = document.querySelector('[data-hero-slider]');
  if (!hero) return;

  const slides = [...hero.querySelectorAll('.hero__slide')];
  const dots = [...hero.querySelectorAll('[data-hero-dot]')];
  const pause = hero.querySelector('[data-hero-pause]');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0;
  let paused = motion.matches;
  let hovering = false;
  let focused = false;
  let timer;

  const show = (next) => {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === index);
      slide.setAttribute('aria-hidden', String(i !== index));
      dots[i].setAttribute('aria-pressed', String(i === index));
    });
  };

  const schedule = () => {
    window.clearInterval(timer);
    pause.textContent = paused ? 'Play' : 'Pause';
    pause.setAttribute('aria-label', paused ? 'Play slideshow' : 'Pause slideshow');
    if (!paused && !hovering && !focused && !document.hidden) {
      timer = window.setInterval(() => show(index + 1), 6500);
    }
  };

  hero.querySelector('[data-hero-prev]').addEventListener('click', () => { show(index - 1); schedule(); });
  hero.querySelector('[data-hero-next]').addEventListener('click', () => { show(index + 1); schedule(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { show(i); schedule(); }));
  pause.addEventListener('click', () => { paused = !paused; schedule(); });
  hero.addEventListener('mouseenter', () => { hovering = true; schedule(); });
  hero.addEventListener('mouseleave', () => { hovering = false; schedule(); });
  hero.addEventListener('focusin', () => { focused = true; schedule(); });
  hero.addEventListener('focusout', (event) => { focused = hero.contains(event.relatedTarget); schedule(); });
  document.addEventListener('visibilitychange', schedule);
  motion.addEventListener('change', () => { paused = motion.matches; schedule(); });
  hero.querySelector('.hero__controls').hidden = false;
  show(0);
  schedule();
})();
