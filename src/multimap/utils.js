/**
 * Add key, value to multimap
 *
 * @export
 * @param {Map} map multimap
 * @param {any} key key
 * @param {any} value value
 * @returns {undefined}
 */
export function add(map, key, value) {
  fetch(map, key).add(value);
}

/**
* Delete key, value to multimap
*
* @export
* @param {Map} map multimap
* @param {any} key key
* @param {any} value value
@returns {undefined}
*/
export function del(map, key, value) {
  fetch(map, key).delete(value);
  prune(map, key);
}

/**
 * Fetch multimap value
 *
 * @export
 * @param {Map} map multimap
 * @param {any} key key
 * @returns {Set} multimap value
 */
export function fetch(map, key) {
  let values = map.get(key);

  if (!values) {
    values = new Set();
    map.set(key, values);
  }

  return values;
}

/**
* Clean multimap key
*
* @export
* @param {Map} map multimap
* @param {any} key key
* @returns {Set} multimap value
*/
export function prune(map, key) {
  const values = map.get(key);

  if (values !== null && values.size === 0) {
    map.delete(key);
  }
}
