(() => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav__toggle");
  const panel = document.querySelector(".nav__panel");
  const backdrop = document.querySelector(".nav__backdrop");
  const links = document.querySelectorAll(".nav__link");
  const megaItems = document.querySelectorAll(".nav__item--has-mega");
  const backToTop = document.querySelector(".back-to-top");
  const desktopQuery = window.matchMedia("(min-width: 1025px)");
  const closeDelay = 180;
  const timers = new WeakMap();

  const isDesktop = () => desktopQuery.matches;

  const closeAllMegas = () => {
    megaItems.forEach((item) => {
      item.classList.remove("is-open");
      const btn = item.querySelector(".nav__subtoggle");
      if (btn) btn.setAttribute("aria-expanded", "false");
    });
  };

  const closeMenu = () => {
    if (!toggle || !panel) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    panel.classList.remove("is-open");
    backdrop?.classList.remove("is-visible");
    document.body.style.overflow = "";
    closeAllMegas();
  };

  const openMenu = () => {
    if (!toggle || !panel) return;
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
    panel.classList.add("is-open");
    backdrop?.classList.add("is-visible");
    document.body.style.overflow = "hidden";
  };

  if (toggle && panel) {
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      if (expanded) closeMenu();
      else openMenu();
    });

    backdrop?.addEventListener("click", closeMenu);

    links.forEach((link) => {
      link.addEventListener("click", () => {
        if (!isDesktop()) closeMenu();
      });
    });

    document.querySelectorAll(".nav__mega a").forEach((link) => {
      link.addEventListener("click", () => {
        if (!isDesktop()) closeMenu();
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  }

  // Desktop mega: open on hover/focus with close delay for usability
  megaItems.forEach((item) => {
    const subtoggle = item.querySelector(".nav__subtoggle");

    const openMega = () => {
      const timer = timers.get(item);
      if (timer) window.clearTimeout(timer);
      if (isDesktop()) {
        megaItems.forEach((other) => {
          if (other !== item) other.classList.remove("is-open");
        });
      }
      item.classList.add("is-open");
      subtoggle?.setAttribute("aria-expanded", "true");
    };

    const scheduleClose = () => {
      if (!isDesktop()) return;
      const timer = window.setTimeout(() => {
        item.classList.remove("is-open");
        subtoggle?.setAttribute("aria-expanded", "false");
      }, closeDelay);
      timers.set(item, timer);
    };

    item.addEventListener("mouseenter", () => {
      if (isDesktop()) openMega();
    });

    item.addEventListener("mouseleave", scheduleClose);

    item.addEventListener("focusin", () => {
      if (isDesktop()) openMega();
    });

    item.addEventListener("focusout", (e) => {
      if (!isDesktop()) return;
      if (!item.contains(e.relatedTarget)) scheduleClose();
    });

    subtoggle?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const open = item.classList.contains("is-open");
      if (open) {
        item.classList.remove("is-open");
        subtoggle.setAttribute("aria-expanded", "false");
      } else {
        if (!isDesktop()) closeAllMegas();
        item.classList.add("is-open");
        subtoggle.setAttribute("aria-expanded", "true");
      }
    });
  });

  desktopQuery.addEventListener("change", () => {
    closeMenu();
  });

  const onScroll = () => {
    const y = window.scrollY || document.documentElement.scrollTop;
    if (header) header.classList.toggle("is-scrolled", y > 8);
    if (backToTop) backToTop.classList.toggle("is-visible", y > 480);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Active nav highlighting by current page
  const path = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
  links.forEach((link) => {
    const href = (link.getAttribute("href") || "").split("#")[0].toLowerCase();
    if (href === path || (path === "" && href === "index.html")) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
  });
})();
