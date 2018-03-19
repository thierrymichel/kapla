/**
 * First letter to uppercase
 *
 * @export
 * @param {String} string string to modify
 * @returns {String} modified string
 */
export function ucfirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * First letter to lowercase
 *
 * @export
 * @param {String} string string to modify
 * @returns {String} modified string
 */
export function lcfirst(string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}

/**
 * Find the element's parent with the given CSS selector
 *
 * @param {HTMLElement} element child element
 * @param {String} selector CSS selector
 * @returns {HTMLElement|undefined} parent DOM Element
 * @example
 * $parent(qs('a'), 'div');
 */
export function $parent(element, selector) {
  if (!element.parentNode || typeof element.parentNode.matches !== 'function') {
    return undefined;
  }

  if (element.parentNode.matches(selector)) {
    return element.parentNode;
  }

  return $parent(element.parentNode, selector);
}
