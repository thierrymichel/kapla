import { Handler } from '../events';

export class Component extends Handler {
  constructor(context) {
    super(context);
    this.context = context;

    const { props } = this.scope;

    if (props) {
      for (const prop in props) {
        if (Object.prototype.hasOwnProperty.call(props, prop)) {
          if (this[prop]) {
            this.context.handleError(`[${prop}] already exists!`, 'initializing props');
          } else {
            this[prop] = props[prop];
          }
        }
      }
    }
  }

  get scope() {
    return this.context.scope;
  }

  get $el() {
    return this.scope.element;
  }

  get $refs() {
    return this.scope.refs;
  }

  get slug() {
    return this.scope.slug;
  }

  get data() {
    return this.scope.data;
  }

  /* eslint-disable no-empty-function, class-methods-use-this */
  load() {}
  init() {}
  destroy() {}
  /* eslint-enable no-empty-function, class-methods-use-this */
}

export const mixComponent = (...mixins) => {
  class base extends Component {
    constructor (...args) {
      const [context, ...params] = args;

      super(context);

      mixins.forEach(Mixin => {
        copyProps(this, new Mixin(...params));
      });
    }
  }

  // Copy all properties and symbols, filtering out some special ones
  const copyProps = (target, source) => {
    Object
      .getOwnPropertyNames(source)
      .concat(Object.getOwnPropertySymbols(source))
      .forEach(prop => {
        if (!prop.match(/^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/)) {
          Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(source, prop));
        }
      });
  };

  // Outside contructor() to allow aggregation(A,B,C).staticFunction() to be called etc.
  mixins.forEach(mixin => {
    copyProps(base.prototype, mixin.prototype);
    copyProps(base, mixin);
  });

  return base;
};
