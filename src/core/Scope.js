import { Data } from './Data';

export class Scope {
  constructor(schema, slug, element) {
    this.schema = schema;
    this.slug = slug;
    this.element = element;
    this.refs = this.getRefs();
    this.data = new Data(this);
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
      const name = element
        .getAttribute(this.refAttribute)
        .replace(`${this.slug}.`, '');

      refs[name] = element;
    }

    return refs;
  }
}
