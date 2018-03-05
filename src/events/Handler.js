export class Handler {
  static get events() {
    return this._events || Object.defineProperty(
      this,
      '_events',
      {
        value: Object.getOwnPropertyNames(this.prototype)
          .filter(type => (/^on/).test(type))
          .map(type => type.slice(2).toLowerCase()),
      }
    )._events;
  }

  constructor(context) {
    const { element } = context;
    const events = this.constructor.events || [];

    events.forEach((e, i) => {
      element.addEventListener(events[i], this);
    });
  }

  handleEvent(e) {
    const type = e.type.charAt(0).toUpperCase() + e.type.slice(1);

    this[`on${type}`](e);
  }
}
