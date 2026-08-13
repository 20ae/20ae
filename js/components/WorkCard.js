import { createPlaceholder, escapeHtml } from "../utils.js";

export function createWorkCard(work, index) {
  const placeholder = createPlaceholder(work.title);
  const baseImage = escapeHtml(work.cardImage || work.image);
  const hoverImage = escapeHtml(work.hoverImage || "");
  const hasHoverThumb = Boolean(work.hoverThumb && hoverImage);

  return `
    <li class="work-card ${hasHoverThumb ? "work-card--hover-thumb" : ""}">
      <button
        type="button"
        class="work-card_trigger"
        data-work-index="${index}"
        aria-label="${escapeHtml(work.title)} 상세 보기"
      >
        <figure class="work-card_thumb">
          <img
            class="work-card_thumb_image work-card_thumb_image--base"
            src="${baseImage}"
            alt="${escapeHtml(work.alt)}"
            data-fallback-src="${escapeHtml(placeholder)}"
          >
          ${hasHoverThumb ? `
            <img
              class="work-card_thumb_image work-card_thumb_image--hover"
              src="${hoverImage}"
              alt=""
              aria-hidden="true"
            >
          ` : ""}
        </figure>
        <div class="work-card_body">
          <h3>${escapeHtml(work.title)}</h3>
          <p>${escapeHtml(work.category)}</p>
        </div>
      </button>
    </li>
  `;
}
