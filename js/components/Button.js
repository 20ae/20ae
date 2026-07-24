/**
 * Shared action button (link or button).
 * Variants: primary | secondary | icon
 */
export function createButton({
  tag = "a",
  label = "",
  href,
  variant = "primary",
  className = "",
  type = "button",
  attrs = {},
  html,
} = {}) {
  const el = document.createElement(tag);
  const classes = ["button", `button--${variant}`];

  if (className) classes.push(className);
  el.className = classes.join(" ");

  if (tag === "a") {
    if (href) el.href = href;
    if (attrs.target) el.target = attrs.target;
    if (attrs.rel) el.rel = attrs.rel;
  } else {
    el.type = type;
  }

  Object.entries(attrs).forEach(([key, value]) => {
    if (key === "target" || key === "rel") return;
    if (value == null) return;
    el.setAttribute(key, String(value));
  });

  if (html != null) {
    el.innerHTML = html;
  } else {
    el.textContent = label;
  }

  return el;
}
