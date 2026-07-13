(function () {
  const data = window.PORTFOLIO_DATA;

  if (!data) {
    return;
  }

  const skillsSection = document.querySelector(".skills");
  const skillsTip = document.querySelector(".skills_tip");
  const skillsTipName = document.querySelector(".skills_tip_name");
  const skillsTipDesc = document.querySelector(".skills_tip_desc");
  const projectModal = document.querySelector(".project-modal");
  const projectModalTitle = document.querySelector(".project-modal_title");
  const projectModalFrame = document.querySelector(".project-modal_frame");
  const projectModalOpen = document.querySelector(".project-modal_open");
  const projectModalFallbackLink = document.querySelector(".project-modal_fallback_link");
  const projectModalClose = document.querySelector(".project-modal_close");
  const projectModalBackdrop = document.querySelector(".project-modal_backdrop");
  const MODAL_FALLBACK_DELAY_MS = 1600;
  let activeSkillName = null;
  let modalFallbackTimer = null;

  const createPlaceholder = (title) => {
    const encodedTitle = encodeURIComponent(title);
    return `https://placehold.co/900x560/efe8db/6a4e3a?text=${encodedTitle}`;
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

  const hideSkillTip = () => {
    if (!skillsTip) return;

    skillsTip.hidden = true;
    activeSkillName = null;
  };

  const updateSkillTip = (button) => {
    if (!skillsTip || !skillsTipName || !skillsTipDesc) return;

    skillsTipName.textContent = button.dataset.skillName;
    skillsTipDesc.textContent = button.dataset.skillDesc;
    skillsTip.hidden = false;
    activeSkillName = button.dataset.skillName;
  };

  const createSkillItem = (skill) => {
    const iconHtml =
      skill.iconType === "image"
        ? `<img src="${escapeAttr(skill.icon)}" alt="" class="skills_icon">`
        : `<i class="${escapeAttr(skill.icon)}" aria-hidden="true"></i>`;

    return `
      <button
        type="button"
        class="skills_item skills_item_${toClassName(skill.name)}"
        data-skill-name="${escapeAttr(skill.name)}"
        data-skill-desc="${escapeAttr(skill.description)}"
        aria-label="${escapeAttr(skill.name)} 설명 보기"
      >${iconHtml}</button>
    `;
  };

  const buildSkillGroupHtml = () => {
    const itemWidth = 120;
    const minWidth = Math.max(window.innerWidth, 960);
    let items = [];

    while (items.length * itemWidth < minWidth) {
      items = items.concat(data.skills);
    }

    return items.map(createSkillItem).join("");
  };

  const renderSkills = () => {
    const track = document.querySelector(".skills_track");

    if (!track) {
      return;
    }

    const groupHtml = buildSkillGroupHtml();
    track.innerHTML = `
      <div class="skills_group">${groupHtml}</div>
      <div class="skills_group" aria-hidden="true">${groupHtml}</div>
    `;

    if (activeSkillName) {
      const activeButton = track.querySelector(`.skills_item[data-skill-name="${CSS.escape(activeSkillName)}"]`);
      if (activeButton) {
        updateSkillTip(activeButton);
      }
    }
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
    if (!skillsSection || !skillsTip) return;

    skillsSection.addEventListener("click", (event) => {
      const button = event.target.closest(".skills_item");

      if (!button) return;

      event.stopPropagation();

      if (activeSkillName === button.dataset.skillName) {
        hideSkillTip();
        return;
      }

      updateSkillTip(button);
    });

    document.addEventListener("click", (event) => {
      if (skillsSection?.contains(event.target)) return;
      hideSkillTip();
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
      if (event.key === "Escape") {
        hideSkillTip();
        if (!projectModal.hidden) closeProjectModal();
      }
    });
  };

  renderSkills();
  renderWorks();
  initSkillTips();
  initProjectModal();

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(renderSkills, 200);
  });
})();
