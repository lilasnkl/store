export function fmt(value) {
  return '$' + Number(value || 0).toFixed(2);
}

export function discountPrice(product) {
  const discount = product?.discountPercentage || 0;
  const price = product?.price || 0;
  return +(price * (1 - discount / 100)).toFixed(2);
}

export function capitalize(value) {
  if (!value) return '';
  return String(value).replace(/\b\w/g, character => character.toUpperCase());
}

export function debounce(fn, delay = 250) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function starHtml(rating, className = 'plp-card-star') {
  const full = Math.round(Number(rating || 0));
  return Array.from({ length: 5 }, (_, index) => (
    `<span class="${className}${index + 1 <= full ? '' : ' empty'}">&#9733;</span>`
  )).join('');
}
