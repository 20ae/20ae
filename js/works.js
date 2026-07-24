import { createButton } from "./components/Button.js";
import { createWorkCard } from "./components/WorkCard.js";
import {
  attachImageFallbacks,
  createPlaceholder,
  formatProjectNumber,
  renderListItems,
} from "./utils.js";

export function initWorks(data) {
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

  let playVideoUrls = [];
  let playVideoIndex = 0;
  let playVideoEndedHandler = null;
  let isProjectDetailOpen = false;
  let skipDetailHashSync = false;

  const PROJECT_LIST_HASH = "#project";
  const PROJECT_DETAIL_HASH_RE = /^#project\/(\d+)$/;

  const getProjectDetailIndexFromHash = (hash = location.hash) => {
    const match = hash.match(PROJECT_DETAIL_HASH_RE);
    if (!match) return null;

    const index = Number(match[1]) - 1;
    return Number.isInteger(index) && index >= 0 && index < data.works.length ? index : null;
  };

  const getProjectDetailHash = (index) => `#project/${index + 1}`;

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

  const renderDetailActions = (work) => {
    if (!projectDetailActions) return;

    projectDetailActions.replaceChildren();

    if (work.visitUrl) {
      projectDetailActions.appendChild(
        createButton({
          label: "사이트 방문",
          href: work.visitUrl,
          variant: "primary",
          attrs: { target: "_blank", rel: "noreferrer" },
        })
      );
    }

    if (work.detailUrl) {
      projectDetailActions.appendChild(
        createButton({
          label: "상세 설명",
          href: work.detailUrl,
          variant: "secondary",
          attrs: { target: "_blank", rel: "noreferrer" },
        })
      );
    }
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

  const hideProjectDetail = () => {
    if (!projectDetail) return;

    projectDetail.hidden = true;
    projectDetail.setAttribute("aria-hidden", "true");
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
    projectDetail.setAttribute("aria-hidden", "false");
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

  const renderWorks = () => {
    const list = document.querySelector(".works_grid");
    if (!list) return;

    list.innerHTML = data.works.map(createWorkCard).join("");
    attachImageFallbacks(list);
    attachImageFallbacks(projectDetail || document);
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

  renderWorks();
  initProjectDetail();
}
