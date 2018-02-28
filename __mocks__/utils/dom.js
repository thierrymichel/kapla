/**
 * Add an component element
 *
 * @export
 * @param {String} name component name
 * @returns {HTMLElement} component element
 */
export function addElement(name) {
  const element = document.createElement('div');

  element.setAttribute('data-component', name);
  document.body.appendChild(element);

  return element;
}

/**
 * Remove an component element
 *
 * @export
 * @param {String} name component name
 * @returns {undefined}
 */
export function removeElement(name) {
  const element = document.body.querySelector(`[data-component="${name}"]`);

  element.remove();
}
