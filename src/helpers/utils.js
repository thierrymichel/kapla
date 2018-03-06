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
