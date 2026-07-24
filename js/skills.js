import { createSkillItem } from "./components/SkillItem.js";
import { prefersReducedMotion } from "./utils.js";

export function initSkills(data) {
  const skillsSection = document.querySelector(".skills");
  const skillsPanel = document.querySelector(".skills_panel");
  const skillsTipName = document.querySelector(".skills_tip_name");
  const skillsTipDesc = document.querySelector(".skills_tip_desc");
  const skillPinTrack = document.querySelector(".skill-pin_track");

  let activeSkillName = null;
  let activeSkillIndex = -1;
  let skillScrollLock = false;
  let skillScrollLockTimer = null;
  let skillPanelAnimTimer = null;
  let skillScrollRaf = 0;

  const getSkillButtons = () => [...(skillsSection?.querySelectorAll(".skills_item") || [])];

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

  const renderSkills = () => {
    const grid = document.querySelector(".skills_grid");
    if (!grid) return;

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

  renderSkills();
  initSkillTips();
  initSkillScrollPin();
}
