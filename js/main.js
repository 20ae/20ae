(function () {
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.querySelector(".site-nav");
  const returnTop = document.querySelector(".return-top");
  const scrollProgress = document.querySelector(".header-progress");
  const hero = document.querySelector(".hero");
  const heroBackground = document.querySelector(".hero_background");
  const heroOrbs = document.querySelectorAll(".hero_orb");
  let lastTrailTime = 0;

  const updateScrollState = () => {
    const isScrolled = window.scrollY > 20;
    header?.classList.toggle("is-scrolled", isScrolled);
    returnTop?.classList.toggle("is-visible", window.scrollY > 500);

    if (scrollProgress) {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / scrollHeight) * 100;
      scrollProgress.style.width = scrolled + "%";
    }
  };

  const closeMenu = () => {
    document.body.classList.remove("is-menu-open");
    siteNav?.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  };

  const initMenu = () => {
    navToggle?.addEventListener("click", () => {
      const isOpen = siteNav?.classList.toggle("is-open");
      document.body.classList.toggle("is-menu-open", Boolean(isOpen));
      navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
    });

    siteNav?.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
  };

  const initReturnTop = () => {
    returnTop?.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  const initAnimations = () => {
    if (window.gsap && heroOrbs.length) {
      heroOrbs.forEach((orb, index) => {
        window.gsap.to(orb, {
          x: index % 2 === 0 ? 80 : -80,
          y: index % 2 === 0 ? -50 : 50,
          rotation: index % 2 === 0 ? 60 : -60,
          duration: 7 + index,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    }
  };

  const initHeroAurora = () => {
    if (!hero || !heroBackground) return;

    hero.addEventListener("pointermove", (event) => {
      const now = window.performance.now();

      if (now - lastTrailTime < 70) return;

      lastTrailTime = now;

      const rect = hero.getBoundingClientRect();
      const trail = document.createElement("span");

      trail.className = "hero_aurora-trail";
      trail.style.setProperty("--trail-x", event.clientX - rect.left + "px");
      trail.style.setProperty("--trail-y", event.clientY - rect.top + "px");

      heroBackground.appendChild(trail);
      trail.addEventListener("animationend", () => trail.remove(), { once: true });
    });
  };

  const resetScrollPosition = () => {
    if (history.scrollRestoration) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  };

  window.addEventListener("scroll", updateScrollState, { passive: true });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      closeMenu();
    }
  });

  resetScrollPosition();
  window.addEventListener("load", resetScrollPosition, { once: true });

  updateScrollState();
  initMenu();
  initReturnTop();
  initAnimations();
  initHeroAurora();
})();
