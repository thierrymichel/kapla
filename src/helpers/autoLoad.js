/**
 * Load definitions from webpack context
 *
 * @export
 * @param {any} context webpack context
 * @param {object} options options
 * @returns {Array} definitions
 */
export function autoLoad(context, options = {
  stripFolders: 1,
}) {
  return context.keys()
    .map(key => getDefinition(context, key, options))
    .filter(value => value);
}

/**
 * Get the definition using slug
 *
 * @param {any} context webpack context
 * @param {String} key component filename/path
 * @param {object} options options
 * @returns {Object} definition
 */
function getDefinition(context, key, options) {
  const slug = getSlug(key, options.stripFolders);

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
 * Get slug from filename/path
 *
 * @param {String} key component filename/path
 * @param {Number} stripFolders strip folders from path (starts from "base")
 * @returns {String} component name
 */
function getSlug(key, stripFolders) {
  // [folder/[subfolders/]]MyComponentFileName.js
  const regex = /^(?:\.\/)?([A-Z]{1}[A-Za-z]+|[a-z-/]+\/[A-Z]{1}[A-Za-z]+)(?:\.js?)$/;
  let [, logicalName] = key.match(regex) || [];

  if (logicalName) {
    for (let i = 0; i < stripFolders; i++) {
      logicalName = logicalName.replace(/^([a-zA-Z]+\/)/, '');
    }

    return logicalName // Ex: 1. AbbAbb || 2. bb/bb/AbbAbb
      .replace(/([A-Z])/g, '-$1') // 1. -Abb-Abb || 2. bb/bb/-Abb-Abb
      .replace(/^-/, '') // 1. Abb-Abb
      .replace(/\/-/g, '/') // 2. bb/bb/Abb-Abb
      .replace(/\//g, '--') // 2. bb--bb--Abb-Abb
      .toLowerCase(); // 1. abb-abb || 2. bb--bb--abb-abb
  }

  return false;
}
