import { Data } from './Data';

export class Scope {
  constructor(schema, slug, element, props) {
    this.schema = schema;
    this.slug = slug;
    this.element = element;
    this.props = props;
    this.data = new Data(this);
  }

  get refs() {
    return this.getRefs();
  }

  get refAttribute() {
    return this.schema.refAttribute;
  }

  get refSelector() {
    return `[${this.refAttribute}*='${this.slug}.']`;
  }

  getRefs() {
    const refs = {};
    const elements = this.element.querySelectorAll(this.refSelector);

    for (const element of Array.from(elements)) {
      const name = this.getRefName(element);

      if (refs[name]) {
        if (Array.isArray(refs[name])) {
          refs[name].push(element);
        } else {
          refs[name] = [refs[name], element];
        }
      } else {
        refs[name] = element;
      }
    }

    return refs;
  }

  getRefName(element) {
    return element
      .getAttribute(this.refAttribute)
      .replace(`${this.slug}.`, '');
  }
}
