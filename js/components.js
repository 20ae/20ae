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
  const projectDetail = document.querySelector(".project-detail");
  const projectDetailCategory = document.querySelector(".project-detail_category");
  const projectDetailTitle = document.querySelector(".project-detail_title");
  const projectDetailDesc = document.querySelector(".project-detail_desc");
  const projectDetailActions = document.querySelector(".project-detail_actions");
  const projectDetailNumber = document.querySelector(".project-detail_number");
  const projectDetailImage = document.querySelector(".project-detail_image");
  const projectDetailClose = document.querySelector(".project-detail_close");
  const projectDetailRoles = document.querySelector(".project-detail_roles");
  const projectDetailTech = document.querySelector(".project-detail_tech");
  const projectDetailFeatures = document.querySelector(".project-detail_features");
  const projectDetailBlockRoles = document.querySelector(".project-detail_block_roles");
  const projectDetailBlockTech = document.querySelector(".project-detail_block_tech");
  const projectDetailBlockFeatures = document.querySelector(".project-detail_block_features");
  const projectDetailPlay = document.querySelector(".project-detail_play");
  const projectDetailPlayIframeWrap = document.querySelector(".project-detail_play_iframe_wrap");
  const projectDetailPlayVideoWrap = document.querySelector(".project-detail_play_video_wrap");
  const projectDetailPlayFrame = document.querySelector(".project-detail_play_frame");
  const projectDetailPlayVideo = document.querySelector(".project-detail_play_video");
  let activeSkillName = null;
  let activeSkillIndex = -1;
  let skillScrollLock = false;
  let skillScrollLockTimer = null;
  let skillPanelAnimTimer = null;
  let skillScrollRaf = 0;
  let playVideoUrls = [];
  let playVideoIndex = 0;
  let playVideoEndedHandler = null;
  let isProjectDetailOpen = false;
  let skipDetailHashSync = false;

  const PROJECT_LIST_HASH = "#project";
  const PROJECT_DETAIL_HASH_RE = /^#project\/(\d+)$/;

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

  const getProjectDetailIndexFromHash = (hash = location.hash) => {
    const match = hash.match(PROJECT_DETAIL_HASH_RE);
    if (!match) return null;

    const index = Number(match[1]) - 1;
    return Number.isInteger(index) && index >= 0 && index < data.works.length ? index : null;
  };

  const getProjectDetailHash = (index) => `#project/${index + 1}`;

  const hideProjectDetail = () => {
    if (!projectDetail) return;

    projectDetail.hidden = true;
    document.body.classList.remove("is-detail-open");
    stopDetailPlayMedia();
    isProjectDetailOpen = false;
  };

  const showProjectDetail = (work, index) => {
    if (!projectDetail || !projectDetailTitle || !projectDetailDesc || !projectDetailImage) return;

    const placeholder = createPlaceholder(work.title);

    if (projectDetailCategory) {
      projectDetailCategory.textContent = work.category;
    }

    projectDetailTitle.textContent = work.title;
    projectDetailDesc.textContent = work.description || work.category;

    if (projectDetailNumber) {
      projectDetailNumber.textContent = formatProjectNumber(index);
    }

    projectDetailImage.src = work.image;
    projectDetailImage.alt = work.alt;
    projectDetailImage.dataset.fallbackSrc = placeholder;

    renderDetailActions(work);
    renderDetailMeta(work);

    projectDetail.hidden = false;
    projectDetail.scrollTop = 0;
    document.body.classList.add("is-detail-open");
    isProjectDetailOpen = true;
    projectDetailClose?.focus();
  };

  const closeProjectDetail = () => {
    if (!isProjectDetailOpen) return;

    if (PROJECT_DETAIL_HASH_RE.test(location.hash)) {
      history.back();
      return;
    }

    hideProjectDetail();

    if (location.hash !== PROJECT_LIST_HASH) {
      skipDetailHashSync = true;
      history.replaceState(null, "", PROJECT_LIST_HASH);
      skipDetailHashSync = false;
    }
  };

  const openProjectDetail = (work, index) => {
    showProjectDetail(work, index);

    const detailHash = getProjectDetailHash(index);

    if (location.hash === detailHash) return;

    if (location.hash !== PROJECT_LIST_HASH) {
      history.pushState({ portfolioView: "project-list" }, "", PROJECT_LIST_HASH);
    }

    history.pushState({ portfolioView: "project-detail", workIndex: index }, "", detailHash);
  };

  const syncProjectDetailFromLocation = () => {
    if (skipDetailHashSync) return;

    const detailIndex = getProjectDetailIndexFromHash();

    if (detailIndex != null) {
      const work = data.works[detailIndex];
      if (!work) return;
      showProjectDetail(work, detailIndex);
      return;
    }

    if (isProjectDetailOpen) {
      hideProjectDetail();
    }
  };

  const stopDetailPlayMedia = () => {
    if (projectDetailPlayFrame) {
      projectDetailPlayFrame.removeAttribute("src");
    }

    if (projectDetailPlayIframeWrap) {
      projectDetailPlayIframeWrap.hidden = true;
    }

    if (projectDetailPlayVideo) {
      if (playVideoEndedHandler) {
        projectDetailPlayVideo.removeEventListener("ended", playVideoEndedHandler);
        playVideoEndedHandler = null;
      }

      projectDetailPlayVideo.pause();
      projectDetailPlayVideo.removeAttribute("src");
      projectDetailPlayVideo.load();
      projectDetailPlayVideo.loop = false;
    }

    if (projectDetailPlayVideoWrap) {
      projectDetailPlayVideoWrap.hidden = true;
    }

    playVideoUrls = [];
    playVideoIndex = 0;

    if (projectDetailPlay) {
      projectDetailPlay.hidden = true;
    }
  };

  const playDetailVideoAt = (index) => {
    if (!projectDetailPlayVideo || !playVideoUrls.length) return;

    playVideoIndex = ((index % playVideoUrls.length) + playVideoUrls.length) % playVideoUrls.length;
    projectDetailPlayVideo.src = playVideoUrls[playVideoIndex];
    projectDetailPlayVideo.play().catch(() => {});
  };

  const startDetailVideoPlaylist = (urls) => {
    if (!projectDetailPlayVideo || !projectDetailPlayVideoWrap || !urls.length) return;

    playVideoUrls = urls;
    playVideoIndex = 0;
    projectDetailPlayVideoWrap.hidden = false;
    projectDetailPlayVideo.muted = true;
    projectDetailPlayVideo.playsInline = true;
    projectDetailPlayVideo.loop = urls.length === 1;

    if (playVideoEndedHandler) {
      projectDetailPlayVideo.removeEventListener("ended", playVideoEndedHandler);
    }

    if (urls.length > 1) {
      playVideoEndedHandler = () => {
        playDetailVideoAt(playVideoIndex + 1);
      };
      projectDetailPlayVideo.addEventListener("ended", playVideoEndedHandler);
    } else {
      playVideoEndedHandler = null;
    }

    playDetailVideoAt(0);
  };

  const renderDetailPlay = (work) => {
    stopDetailPlayMedia();

    if (!projectDetailPlay) return;

    if (work.previewUrl && projectDetailPlayFrame && projectDetailPlayIframeWrap) {
      projectDetailPlay.hidden = false;
      projectDetailPlayIframeWrap.hidden = false;
      projectDetailPlayFrame.src = work.previewUrl;
      return;
    }

    if (work.videoUrls?.length) {
      projectDetailPlay.hidden = false;
      startDetailVideoPlaylist(work.videoUrls);
    }
  };

  const formatProjectNumber = (index) => {
    return String(index + 1).padStart(2, "0");
  };

  const createDetailActionLink = (label, className, href) => {
    const link = document.createElement("a");
    link.className = `project-detail_action ${className}`;
    link.href = href;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = label;
    return link;
  };

  const renderDetailActions = (work) => {
    if (!projectDetailActions) return;

    projectDetailActions.replaceChildren();

    if (work.visitUrl) {
      projectDetailActions.appendChild(
        createDetailActionLink("사이트 방문", "project-detail_action_visit", work.visitUrl)
      );
    }

    if (work.detailUrl) {
      projectDetailActions.appendChild(
        createDetailActionLink("상세 설명", "project-detail_action_detail", work.detailUrl)
      );
    }
  };

  const renderListItems = (listEl, items, itemClassName) => {
    if (!listEl) return;

    listEl.replaceChildren();

    (items || []).forEach((item) => {
      const li = document.createElement("li");
      if (itemClassName) li.className = itemClassName;
      li.textContent = item;
      listEl.appendChild(li);
    });
  };

  const renderDetailMeta = (work) => {
    const roles = work.roles || [];
    const tech = work.tech || [];
    const features = work.features || [];

    renderListItems(projectDetailRoles, roles);
    renderListItems(projectDetailTech, tech, "project-detail_tech_item");
    renderListItems(projectDetailFeatures, features);

    if (projectDetailBlockRoles) {
      projectDetailBlockRoles.hidden = roles.length === 0;
    }

    if (projectDetailBlockTech) {
      projectDetailBlockTech.hidden = tech.length === 0;
    }

    if (projectDetailBlockFeatures) {
      projectDetailBlockFeatures.hidden = features.length === 0;
    }

    renderDetailPlay(work);
  };

  const renderWorkCard = (work, index) => {
    const placeholder = createPlaceholder(work.title);

    return `
      <li class="work-card">
        <button
          type="button"
          class="work-card_trigger"
          data-work-index="${index}"
          aria-label="${escapeAttr(work.title)} 상세 보기"
        >
          <figure class="work-card_thumb">
            <img src="${escapeAttr(work.image)}" alt="${escapeAttr(work.alt)}" data-fallback-src="${escapeAttr(placeholder)}">
          </figure>
          <div class="work-card_body">
            <h3>${work.title}</h3>
            <p>${work.category}</p>
          </div>
        </button>
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
    attachImageFallbacks(projectDetail || document);
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

  const initProjectDetail = () => {
    const list = document.querySelector(".works_grid");

    if (!list || !projectDetail) return;

    list.addEventListener("click", (event) => {
      const trigger = event.target.closest("[data-work-index]");

      if (!trigger) return;

      const index = Number(trigger.dataset.workIndex);
      const work = data.works[index];

      if (!work) return;

      openProjectDetail(work, index);
    });

    projectDetailClose?.addEventListener("click", closeProjectDetail);

    projectDetailImage?.addEventListener("error", () => {
      if (projectDetailImage.dataset.fallbackSrc) {
        projectDetailImage.src = projectDetailImage.dataset.fallbackSrc;
      }
    });

    window.addEventListener("popstate", syncProjectDetailFromLocation);
    syncProjectDetailFromLocation();

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && projectDetail && !projectDetail.hidden) {
        closeProjectDetail();
      }
    });
  };

  renderSkills();
  renderWorks();
  initSkillTips();
  initSkillScrollPin();
  initProjectDetail();
})();
