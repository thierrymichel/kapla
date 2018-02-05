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
  // [folder/[subfolders/]]MyComponentFileName.js
  const regex = /^(?:\.\/)?([A-Z]{1}[A-Za-z]+|[a-z/]+\/[A-Z]{1}[A-Za-z]+)(?:\.js?)$/;
  const [, logicalName] = key.match(regex) || [];

  if (logicalName) {
    return logicalName // Ex: 1. AbbAbb || 2. bb/bb/AbbAbb
      .replace(/([A-Z])/g, '-$1') // 1. -Abb-Abb || 2. bb/bb/-Abb-Abb
      .replace(/^-/, '') // 1. Abb-Abb
      .replace(/\/-/g, '/') // 2. bb/bb/Abb-Abb
      .replace(/\//g, '--') // 2. bb--bb--Abb-Abb
      .toLowerCase(); // 1. abb-abb || 2. bb--bb--abb-abb
  }

  return false;
}
