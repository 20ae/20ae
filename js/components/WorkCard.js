import { createPlaceholder, escapeHtml } from "../utils.js";

export function createWorkCard(work, index) {
  const placeholder = createPlaceholder(work.title);

  return `
    <li class="work-card">
      <button
        type="button"
        class="work-card_trigger"
        data-work-index="${index}"
        aria-label="${escapeHtml(work.title)} 상세 보기"
      >
        <figure class="work-card_thumb">
          <img
            src="${escapeHtml(work.image)}"
            alt="${escapeHtml(work.alt)}"
            data-fallback-src="${escapeHtml(placeholder)}"
          >
        </figure>
        <div class="work-card_body">
          <h3>${escapeHtml(work.title)}</h3>
          <p>${escapeHtml(work.category)}</p>
        </div>
      </button>
    </li>
  `;
}
