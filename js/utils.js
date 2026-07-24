export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const toClassName = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/(^_|_$)/g, "");

export const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

export const createPlaceholder = (title) => {
  const encodedTitle = encodeURIComponent(title);
  return `https://placehold.co/900x560/e8e6df/b93d3d?text=${encodedTitle}`;
};

export const formatProjectNumber = (index) => String(index + 1).padStart(2, "0");

export const attachImageFallbacks = (root) => {
  if (!root) return;

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

export const renderListItems = (listEl, items, itemClassName) => {
  if (!listEl) return;

  listEl.replaceChildren();

  (items || []).forEach((item) => {
    const li = document.createElement("li");
    if (itemClassName) li.className = itemClassName;
    li.textContent = item;
    listEl.appendChild(li);
  });
};
