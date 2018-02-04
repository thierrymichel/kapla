/**
 * Load definitions from webpack context
 *
 * @export
 * @param {any} context webpack context
 * @returns {Array} definitions
 */
export function autoLoad(context) {
  return context.keys()
    .map(key => getDefinition(context, key))
    .filter(value => value);
}

/**
 * Get the definition using slug
 *
 * @param {any} context webpack context
 * @param {String} key component filename/path ?
 * @returns {Object} definition
 */
function getDefinition(context, key) {
  const slug = getSlug(key);

  if (slug) {
    return buildDefinition(context(key), slug);
  }

  return false;
}

/**
 * Build definition
 *
 * @param {Function} module component constructor
 * @param {String} slug component name
 * @returns {Object} definition
 */
function buildDefinition(module, slug) {
  const ComponentConstructor = module.default;

  if (typeof ComponentConstructor === 'function') {
    return {
      slug,
      ComponentConstructor,
    };
  }

  return false;
}

/**
 * Get slug from filename/path ?
 *
 * @param {String} key component filename/path ?
 * @returns {String} component name
 */
function getSlug(key) {
  const [, logicalName] = key.match(/^(?:\.\/)?([a-z-_/]+)(?:\.js?)$/) || [];

  if (logicalName) {
    return logicalName.replace(/_/g, '-').replace(/\//g, '--');
  }

  return false;
}
