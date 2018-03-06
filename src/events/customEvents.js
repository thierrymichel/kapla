// DEV
// onClickOutside
// onAppear

export const clickOutside = {
  eventsByElements: new Map(),
  bind(component) {
    this.eventsByElements.set(component.context.element, this.listener(component));

    window.addEventListener('click', this.eventsByElements.get(component.context.element));
  },
  unbind(component) {
    window.removeEventListener('click', this.eventsByElements.get(component.context.element));
  },
  listener(component) {
    return function listener(e) {
      if (!component.context.element.contains(e.target)) {
        component.onClickOutside(e);
      }
    };
  },
};
