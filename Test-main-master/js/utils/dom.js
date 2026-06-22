export const byId = id => document.getElementById(id);
export const qs = (selector, root = document) => root.querySelector(selector);
export const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];

export function on(target, event, handler, options) {
  target?.addEventListener(event, handler, options);
}

export function setHidden(element, hidden) {
  if (element) element.hidden = hidden;
}
