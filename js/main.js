(function () {
  const header = document.querySelector("[data-header]");
  const menuButton = document.querySelector("[data-menu-button]");
  const siteNav = document.querySelector("[data-site-nav]");
  const returnTop = document.querySelector("[data-return-top]");
  const scrollProgress = document.querySelector("[data-scroll-progress]");
  const heroBlurs = document.querySelectorAll(".hero__blur");

  const toggleScrolledState = () => {
    const isScrolled = window.scrollY > 20;
    header?.classList.toggle("is-scrolled", isScrolled);
    returnTop?.classList.toggle("is-visible", window.scrollY > 500);

    // Update scroll progress bar
    if (scrollProgress) {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / scrollHeight) * 100;
      scrollProgress.style.width = scrolled + "%";
    }
  };

  const closeMenu = () => {
    document.body.classList.remove("menu-open");
    siteNav?.classList.remove("is-open");
    menuButton?.setAttribute("aria-expanded", "false");
  };

  const initMenu = () => {
    menuButton?.addEventListener("click", () => {
      const isOpen = siteNav?.classList.toggle("is-open");
      document.body.classList.toggle("menu-open", Boolean(isOpen));
      menuButton.setAttribute("aria-expanded", String(Boolean(isOpen)));
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
    if (window.AOS) {
      window.AOS.init({
        duration: 800,
        once: true,
        offset: 80,
      });
    }

    if (window.gsap && heroBlurs.length) {
      heroBlurs.forEach((blur, index) => {
        window.gsap.to(blur, {
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

  const resetScrollPosition = () => {
    if (history.scrollRestoration) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  };

  window.addEventListener("scroll", toggleScrolledState, { passive: true });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      closeMenu();
    }
  });

  resetScrollPosition();
  window.addEventListener("load", resetScrollPosition, { once: true });

  toggleScrolledState();
  initMenu();
  initReturnTop();
  initAnimations();
})();
