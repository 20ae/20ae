(function () {
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.querySelector(".site-nav");
  const siteLogoLink = document.querySelector(".site-logo a");
  const returnTop = document.querySelector(".return-top");
  const scrollProgress = document.querySelector(".header-progress");
  const heroOrbs = document.querySelectorAll(".hero_orb");
  const heroRevealTexts = document.querySelectorAll(".hero_reveal_text");
  const aboutSection = document.querySelector("#about");
  const projectSection = document.querySelector("#project");
  const contactSection = document.querySelector("#contact");
  const aboutRevealTargets = [
    document.querySelector(".about_image"),
    document.querySelector(".about_text h2"),
    document.querySelector(".about_text p"),
    document.querySelector(".about_links"),
  ].filter(Boolean);
  const profileTimeline = document.querySelector(".profile-timeline");
  const timelinePanels = profileTimeline?.querySelectorAll(".timeline") || [];
  const projectRevealTargets = [
    document.querySelector("#project .section-heading"),
    document.querySelector(".works_grid"),
  ].filter(Boolean);
  const contactRevealTargets = [
    document.querySelector(".contact_inner .section-label"),
    document.querySelector(".contact_inner h2"),
    document.querySelector(".contact_mail"),
    document.querySelector(".contact_inner p:last-child"),
  ].filter(Boolean);

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

  const playHeroIntro = () => {
    if (!heroRevealTexts.length || !window.gsap) return;

    if (prefersReducedMotion()) {
      window.gsap.set(heroRevealTexts, { clearProps: "all" });
      return;
    }

    window.gsap.killTweensOf(heroRevealTexts);
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
      delay: 0.08,
    });
  };

  const createRevealController = (section, targets, options = {}) => {
    const {
      fromX = 0,
      fromY = 0,
      duration = 0.88,
      stagger = 0.14,
      threshold = 0.25,
      rootMargin = "0px",
    } = options;
    let hasPlayed = false;

    if (!section || !targets.length || !window.gsap) {
      return { play: () => {}, observe: () => {} };
    }

    if (prefersReducedMotion()) {
      window.gsap.set(targets, { clearProps: "all" });
      return { play: () => {}, observe: () => {} };
    }

    window.gsap.set(targets, {
      x: fromX,
      y: fromY,
      autoAlpha: 0,
    });

    const play = () => {
      window.gsap.killTweensOf(targets);
      window.gsap.fromTo(
        targets,
        { x: fromX, y: fromY, autoAlpha: 0 },
        {
          x: 0,
          y: 0,
          autoAlpha: 1,
          duration,
          ease: "power3.out",
          stagger,
          overwrite: true,
        }
      );
      hasPlayed = true;
    };

    const observe = () => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting || hasPlayed) return;
            play();
          });
        },
        { threshold, rootMargin }
      );

      observer.observe(section);
    };

    return { play, observe };
  };

  const aboutReveal = createRevealController(aboutSection, aboutRevealTargets, {
    fromX: -56,
    duration: 0.88,
    stagger: 0.14,
    threshold: 0.25,
  });

  const timelineReveal = createRevealController(profileTimeline, [...timelinePanels], {
    fromX: -48,
    duration: 0.85,
    stagger: 0.22,
    threshold: 0.28,
  });

  const projectReveal = createRevealController(
    document.querySelector("#project .section-heading") || projectSection,
    projectRevealTargets,
    {
      fromY: -48,
      duration: 0.7,
      stagger: 0.12,
      threshold: 0.05,
      rootMargin: "0px 0px 18% 0px",
    }
  );

  const contactReveal = createRevealController(contactSection, contactRevealTargets, {
    fromX: -36,
    duration: 0.75,
    stagger: 0.12,
    threshold: 0.2,
  });

  const replaySection = (hash) => {
    window.setTimeout(() => {
      if (hash === "#main") {
        playHeroIntro();
        return;
      }

      if (hash === "#about") {
        aboutReveal.play();
        timelineReveal.play();
        return;
      }

      if (hash === "#project") {
        projectReveal.play();
        return;
      }

      if (hash === "#contact") {
        contactReveal.play();
      }
    }, 120);
  };

  const initMenu = () => {
    navToggle?.addEventListener("click", () => {
      const isOpen = siteNav?.classList.toggle("is-open");
      document.body.classList.toggle("is-menu-open", Boolean(isOpen));
      navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
    });

    siteNav?.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        closeMenu();
        replaySection(link.getAttribute("href"));
      });
    });

    siteLogoLink?.addEventListener("click", () => {
      closeMenu();
      replaySection("#main");
    });
  };

  const initReturnTop = () => {
    returnTop?.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      replaySection("#main");
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
  playHeroIntro();
  aboutReveal.observe();
  timelineReveal.observe();
  projectReveal.observe();
  contactReveal.observe();
})();
