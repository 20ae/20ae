(function () {
  const data = window.PORTFOLIO_DATA;

  if (!data) {
    return;
  }

  const skillsSection = document.querySelector(".skills");
  const skillsPanel = document.querySelector(".skills_panel");
  const skillsTipName = document.querySelector(".skills_tip_name");
  const skillsTipDesc = document.querySelector(".skills_tip_desc");
  const skillPinTrack = document.querySelector(".skill-pin_track");
  const projectModal = document.querySelector(".project-modal");
  const projectModalTitle = document.querySelector(".project-modal_title");
  const projectModalFrame = document.querySelector(".project-modal_frame");
  const projectModalOpen = document.querySelector(".project-modal_open");
  const projectModalFallbackLink = document.querySelector(".project-modal_fallback_link");
  const projectModalClose = document.querySelector(".project-modal_close");
  const projectModalBackdrop = document.querySelector(".project-modal_backdrop");
  const MODAL_FALLBACK_DELAY_MS = 1600;
  let activeSkillName = null;
  let activeSkillIndex = -1;
  let modalFallbackTimer = null;
  let skillScrollLock = false;
  let skillScrollLockTimer = null;
  let skillPanelAnimTimer = null;
  let skillScrollRaf = 0;

  const createPlaceholder = (title) => {
    const encodedTitle = encodeURIComponent(title);
    return `https://placehold.co/900x560/e8e6df/b93d3d?text=${encodedTitle}`;
  };

  const toClassName = (value) => {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/(^_|_$)/g, "");
  };

  const escapeAttr = (value) => {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  };

  const isNotionUrl = (url) => {
    return /notion\.(com|so)/i.test(url);
  };

  const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const getSkillButtons = () => {
    return [...(skillsSection?.querySelectorAll(".skills_item") || [])];
  };

  const setSkillButtonsState = (activeButton) => {
    getSkillButtons().forEach((item) => {
      const isActive = item === activeButton;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  };

  const updateSkillTip = (button, { animate = true } = {}) => {
    if (!skillsPanel || !skillsTipName || !skillsTipDesc || !button) return;

    const nextName = button.dataset.skillName;
    const nextDesc = button.dataset.skillDesc;
    const buttons = getSkillButtons();
    const nextIndex = buttons.indexOf(button);

    if (nextName === activeSkillName && nextIndex === activeSkillIndex) {
      setSkillButtonsState(button);
      return;
    }

    setSkillButtonsState(button);
    activeSkillName = nextName;
    activeSkillIndex = nextIndex;
    skillsPanel.classList.add("is-ready");

    const applyContent = () => {
      skillsTipName.textContent = nextName;
      skillsTipDesc.textContent = nextDesc;
      skillsPanel.classList.remove("is-updating");
    };

    if (!animate || prefersReducedMotion()) {
      applyContent();
      return;
    }

    clearTimeout(skillPanelAnimTimer);
    skillsPanel.classList.add("is-updating");
    skillPanelAnimTimer = window.setTimeout(applyContent, 120);
  };

  const getSkillTrackMetrics = () => {
    if (!skillPinTrack) return null;

    const trackTop = skillPinTrack.getBoundingClientRect().top + window.scrollY;
    const trackHeight = skillPinTrack.offsetHeight;
    const viewportHeight = window.innerHeight;
    const scrollable = Math.max(trackHeight - viewportHeight, 1);

    return { trackTop, scrollable };
  };

  const getScrollYForSkillIndex = (index, count) => {
    const metrics = getSkillTrackMetrics();
    if (!metrics || count <= 0) return window.scrollY;

    const progress = count === 1 ? 0 : (index + 0.5) / count;
    return metrics.trackTop + metrics.scrollable * progress;
  };

  const getSkillIndexFromScroll = (count) => {
    const metrics = getSkillTrackMetrics();
    if (!metrics || count <= 0) return 0;

    const scrolled = Math.min(metrics.scrollable, Math.max(0, window.scrollY - metrics.trackTop));
    const progress = scrolled / metrics.scrollable;
    return Math.min(count - 1, Math.floor(progress * count));
  };

  const selectSkillByIndex = (index, { syncScroll = false } = {}) => {
    const buttons = getSkillButtons();
    const button = buttons[index];
    if (!button) return;

    updateSkillTip(button);

    if (!syncScroll || !skillPinTrack || prefersReducedMotion()) return;

    skillScrollLock = true;
    clearTimeout(skillScrollLockTimer);
    window.scrollTo({
      top: getScrollYForSkillIndex(index, buttons.length),
      behavior: "smooth",
    });
    skillScrollLockTimer = window.setTimeout(() => {
      skillScrollLock = false;
    }, 700);
  };

  const createSkillItem = (skill) => {
    const iconHtml =
      skill.iconType === "image"
        ? `<img src="${escapeAttr(skill.icon)}" alt="" class="skills_icon">`
        : `<i class="${escapeAttr(skill.icon)}" aria-hidden="true"></i>`;
    return `
      <li>
        <button
          type="button"
          class="skills_item skills_item_${toClassName(skill.name)}"
          data-skill-name="${escapeAttr(skill.name)}"
          data-skill-desc="${escapeAttr(skill.description)}"
          aria-pressed="false"
          aria-label="${escapeAttr(skill.name)}"
        >
          <span class="skills_item_icon">${iconHtml}</span>
          <span class="skills_item_name">${escapeAttr(skill.name)}</span>
        </button>
      </li>
    `;
  };

  const renderSkills = () => {
    const grid = document.querySelector(".skills_grid");

    if (!grid) {
      return;
    }

    grid.innerHTML = data.skills.map(createSkillItem).join("");

    if (skillPinTrack) {
      skillPinTrack.style.setProperty("--skill-count", String(data.skills.length));
    }

    const preferred =
      (activeSkillName &&
        grid.querySelector(`.skills_item[data-skill-name="${CSS.escape(activeSkillName)}"]`)) ||
      grid.querySelector(".skills_item");

    if (preferred) {
      updateSkillTip(preferred, { animate: false });
    }
  };

  const initSkillScrollPin = () => {
    if (!skillPinTrack || !skillsSection) return;

    const syncFromScroll = () => {
      if (skillScrollLock || prefersReducedMotion()) return;

      const count = getSkillButtons().length;
      if (!count) return;

      const nextIndex = getSkillIndexFromScroll(count);
      if (nextIndex === activeSkillIndex) return;

      const button = getSkillButtons()[nextIndex];
      if (button) updateSkillTip(button);
    };

    const onScroll = () => {
      if (skillScrollRaf) return;
      skillScrollRaf = window.requestAnimationFrame(() => {
        skillScrollRaf = 0;
        syncFromScroll();
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", syncFromScroll);
    syncFromScroll();
  };

  const closeProjectModal = () => {
    if (!projectModal) return;

    clearTimeout(modalFallbackTimer);
    projectModal.hidden = true;
    projectModal.classList.remove("is-fallback");
    document.body.classList.remove("is-modal-open");

    if (projectModalFrame) {
      projectModalFrame.removeAttribute("src");
    }
  };

  const openProjectModal = (title, embedUrl, detailUrl) => {
    if (!projectModal || !projectModalTitle || !projectModalFrame) return;

    projectModalTitle.textContent = title;
    projectModal.classList.remove("is-fallback");

    if (projectModalOpen) projectModalOpen.href = detailUrl;
    if (projectModalFallbackLink) projectModalFallbackLink.href = detailUrl;

    projectModal.hidden = false;
    document.body.classList.add("is-modal-open");
    projectModalFrame.src = embedUrl;

    clearTimeout(modalFallbackTimer);
    if (isNotionUrl(embedUrl)) {
      modalFallbackTimer = setTimeout(() => {
        projectModal.classList.add("is-fallback");
      }, MODAL_FALLBACK_DELAY_MS);
    }

    projectModalClose?.focus();
  };

  const renderWorkCard = (work) => {
    const placeholder = createPlaceholder(work.title);

    if (work.openInModal) {
      return `
        <li class="work-card">
          <a
            href="${escapeAttr(work.embedUrl)}"
            data-project-embed-url="${escapeAttr(work.embedUrl)}"
            data-project-detail-url="${escapeAttr(work.detailUrl)}"
            data-project-title="${escapeAttr(work.title)}"
          >
            <figure class="work-card_thumb">
              <img src="${escapeAttr(work.image)}" alt="${escapeAttr(work.alt)}" data-fallback-src="${escapeAttr(placeholder)}">
            </figure>
            <div class="work-card_body">
              <h3>${work.title}</h3>
              <p>${work.category}</p>
            </div>
          </a>
        </li>
      `;
    }

    return `
      <li class="work-card">
        <a href="${escapeAttr(work.url)}" target="_blank" rel="noreferrer">
          <figure class="work-card_thumb">
            <img src="${escapeAttr(work.image)}" alt="${escapeAttr(work.alt)}" data-fallback-src="${escapeAttr(placeholder)}">
          </figure>
          <div class="work-card_body">
            <h3>${work.title}</h3>
            <p>${work.category}</p>
          </div>
        </a>
      </li>
    `;
  };

  const attachImageFallbacks = (root) => {
    root.querySelectorAll("img[data-fallback-src]").forEach((image) => {
      image.addEventListener(
        "error",
        () => {
          if (image.dataset.fallbackSrc) {
            image.src = image.dataset.fallbackSrc;
          }
        },
        { once: true }
      );
    });
  };

  const renderWorks = () => {
    const list = document.querySelector(".works_grid");

    if (!list) {
      return;
    }

    list.innerHTML = data.works.map(renderWorkCard).join("");
    attachImageFallbacks(list);
  };

  const initSkillTips = () => {
    if (!skillsSection || !skillsPanel) return;

    skillsSection.addEventListener("click", (event) => {
      const button = event.target.closest(".skills_item");

      if (!button) return;

      const index = getSkillButtons().indexOf(button);
      if (index < 0) return;

      selectSkillByIndex(index, { syncScroll: true });
    });
  };

  const initProjectModal = () => {
    const list = document.querySelector(".works_grid");

    if (!list || !projectModal) return;

    list.addEventListener("click", (event) => {
      const link = event.target.closest("a[data-project-embed-url]");

      if (!link) return;

      event.preventDefault();
      openProjectModal(link.dataset.projectTitle, link.dataset.projectEmbedUrl, link.dataset.projectDetailUrl);
    });

    projectModalClose?.addEventListener("click", closeProjectModal);
    projectModalBackdrop?.addEventListener("click", closeProjectModal);

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !projectModal.hidden) {
        closeProjectModal();
      }
    });
  };

  renderSkills();
  renderWorks();
  initSkillTips();
  initSkillScrollPin();
  initProjectModal();
})();
