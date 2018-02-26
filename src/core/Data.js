export class Data {
  constructor(scope) {
    this.scope = scope;
  }

  get element() {
    return this.scope.element;
  }

  get slug() {
    return this.scope.slug;
  }

  get(key) {
    const formattedKey = this._getFormattedKey(key);

    return this.element.getAttribute(formattedKey);
  }

  set(key, value) {
    const formattedKey = this._getFormattedKey(key);

    this.element.setAttribute(formattedKey, value);

    return this.get(key);
  }

  has(key) {
    const formattedKey = this._getFormattedKey(key);

    return this.element.hasAttribute(formattedKey);
  }

  delete(key) {
    if (this.has(key)) {
      const formattedKey = this._getFormattedKey(key);

      this.element.removeAttribute(formattedKey);

      return true;
    }

    return false;
  }

  _getFormattedKey(key) {
    return `data-${this.slug}-${kebabcase(key)}`;
  }
}

/**
 * Convert camelCase to kebab-case
 *
 * @param {String} value original
 * @returns {String} kebab-cased
 */
function kebabcase(value) {
  return value
    .toString()
    .replace(
      /([A-Z])/g,
      (_, char) => `-${char.toLowerCase()}`
    );
}
