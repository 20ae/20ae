(function () {
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.querySelector(".site-nav");
  const returnTop = document.querySelector(".return-top");
  const scrollProgress = document.querySelector(".header-progress");
  const hero = document.querySelector(".hero");
  const heroBackground = document.querySelector(".hero_background");
  const heroOrbs = document.querySelectorAll(".hero_orb");
  const heroRevealTexts = document.querySelectorAll(".hero_reveal_text");
  const aboutSection = document.querySelector("#about");
  const aboutImageStage = document.querySelector(".about_image_stage");
  const aboutRevealTargets = [
    document.querySelector(".about_image"),
    document.querySelector(".about_text h2"),
    document.querySelector(".about_text p"),
    document.querySelector(".about_links"),
  ].filter(Boolean);
  const profileTimeline = document.querySelector(".profile-timeline");
  const timelinePanels = profileTimeline?.querySelectorAll(".timeline") || [];

  const AURORA_TRAIL_INTERVAL_MS = 70;
  const HEART_BURST_INTERVAL_MS = 2600;
  const HEART_BURST_COUNT = 12;
  const HEART_COLORS = ["#e85d8f", "#ff6b9d", "#f472b6", "#fb7185", "#ec4899", "#f9a8d4"];

  let lastTrailTime = 0;

  const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const updateScrollState = () => {
    const isScrolled = window.scrollY > 20;
    header?.classList.toggle("is-scrolled", isScrolled);
    returnTop?.classList.toggle("is-visible", window.scrollY > 500);

    if (scrollProgress) {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
      scrollProgress.style.width = `${scrolled}%`;
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
    if (!window.gsap || !heroOrbs.length) return;

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
  };

  const initHeroIntro = () => {
    if (!heroRevealTexts.length || !window.gsap) return;

    if (prefersReducedMotion()) {
      window.gsap.set(heroRevealTexts, { clearProps: "all" });
      return;
    }

    window.gsap.set(heroRevealTexts, {
      yPercent: 110,
      autoAlpha: 0,
    });

    window.gsap.to(heroRevealTexts, {
      yPercent: 0,
      autoAlpha: 1,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.18,
      delay: 0.15,
    });
  };

  const initHeroAurora = () => {
    if (!hero || !heroBackground) return;

    hero.addEventListener("pointermove", (event) => {
      const now = window.performance.now();

      if (now - lastTrailTime < AURORA_TRAIL_INTERVAL_MS) return;

      lastTrailTime = now;

      const rect = hero.getBoundingClientRect();
      const trail = document.createElement("span");

      trail.className = "hero_aurora-trail";
      trail.style.setProperty("--trail-x", `${event.clientX - rect.left}px`);
      trail.style.setProperty("--trail-y", `${event.clientY - rect.top}px`);

      heroBackground.appendChild(trail);
      trail.addEventListener("animationend", () => trail.remove(), { once: true });
    });
  };

  const initScrollReveal = (section, targets, options = {}) => {
    if (!section || !targets.length || !window.gsap) return;

    const { fromX = -56, duration = 0.88, stagger = 0.14, threshold = 0.25 } = options;

    if (prefersReducedMotion()) {
      window.gsap.set(targets, { clearProps: "all" });
      return;
    }

    window.gsap.set(targets, {
      x: fromX,
      autoAlpha: 0,
    });

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          window.gsap.to(targets, {
            x: 0,
            autoAlpha: 1,
            duration,
            ease: "power3.out",
            stagger,
          });

          obs.unobserve(entry.target);
        });
      },
      { threshold }
    );

    observer.observe(section);
  };

  const initProfileHeartBurst = () => {
    if (!aboutImageStage || !aboutSection || prefersReducedMotion()) return;

    let burstTimer = null;

    const burstHearts = () => {
      for (let i = 0; i < HEART_BURST_COUNT; i += 1) {
        const heart = document.createElement("span");
        const angle = (Math.PI * 2 * i) / HEART_BURST_COUNT + (Math.random() - 0.5) * 0.45;
        const distance = 72 + Math.random() * 88;

        heart.className = "about_heart";
        heart.setAttribute("aria-hidden", "true");
        heart.textContent = "♥";
        heart.style.setProperty("--tx", `${Math.cos(angle) * distance}px`);
        heart.style.setProperty("--ty", `${Math.sin(angle) * distance}px`);
        heart.style.setProperty("--size", `${12 + Math.random() * 14}px`);
        heart.style.setProperty("--duration", `${1.1 + Math.random() * 0.7}s`);
        heart.style.setProperty("--rotate", `${-30 + Math.random() * 60}deg`);
        heart.style.setProperty("--heart-color", HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)]);

        aboutImageStage.appendChild(heart);
        heart.addEventListener("animationend", () => heart.remove(), { once: true });
      }
    };

    const startBurst = () => {
      if (burstTimer) return;

      burstHearts();
      burstTimer = window.setInterval(burstHearts, HEART_BURST_INTERVAL_MS);
    };

    const stopBurst = () => {
      if (!burstTimer) return;

      window.clearInterval(burstTimer);
      burstTimer = null;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startBurst();
          } else {
            stopBurst();
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(aboutSection);
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
  initHeroIntro();
  initHeroAurora();
  initScrollReveal(aboutSection, aboutRevealTargets, {
    fromX: -56,
    duration: 0.88,
    stagger: 0.14,
    threshold: 0.25,
  });
  initScrollReveal(profileTimeline, timelinePanels, {
    fromX: -48,
    duration: 0.85,
    stagger: 0.22,
    threshold: 0.28,
  });
  initProfileHeartBurst();
})();
