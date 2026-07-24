import { escapeHtml, toClassName } from "../utils.js";

export function createSkillItem(skill) {
  const iconHtml =
    skill.iconType === "image"
      ? `<img src="${escapeHtml(skill.icon)}" alt="" class="skills_icon">`
      : `<i class="${escapeHtml(skill.icon)}" aria-hidden="true"></i>`;

  return `
    <li>
      <button
        type="button"
        class="skills_item skills_item_${toClassName(skill.name)}"
        data-skill-name="${escapeHtml(skill.name)}"
        data-skill-desc="${escapeHtml(skill.description)}"
        aria-pressed="false"
        aria-label="${escapeHtml(skill.name)}"
      >
        <span class="skills_item_icon">${iconHtml}</span>
        <span class="skills_item_name">${escapeHtml(skill.name)}</span>
      </button>
    </li>
  `;
}
