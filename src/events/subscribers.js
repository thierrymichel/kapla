import { Multimap } from '../multimap';

class Subscriber {
  constructor(component) {
    this._component = component;
    this._callbacksByName = new Multimap();
  }

  get component() {
    return this._component;
  }

  on(name, cb) {
    this._callbacksByName.add(name, cb);

    return this;
  }

  trigger(name, ...params) {
    this._callbacksByName.getValuesForKey(name).forEach(cb => {
      cb.apply(this._component, ...params);
    });
  }
}

class Subscribers {
  constructor() {
    this._componentsBySlug = new Multimap();
    this._subscribersBySlug = new Multimap();
  }

  add(component, slug) {
    if (this._componentsBySlug.has(slug, component)) {
      return this._subscribersBySlug
        .getValuesForKey(slug)
        .filter(subscriber => subscriber.component === component)[0];
    }

    const subscriber = new Subscriber(component);

    this._componentsBySlug.add(slug, component);
    this._subscribersBySlug.add(slug, subscriber);

    return subscriber;
  }

  remove(component) {
    if (this._componentsBySlug.hasValue(component)) {
      this._componentsBySlug.getKeysForValue(component).forEach(slug => {
        this._componentsBySlug.delete(slug, component);

        this._subscribersBySlug.getValuesForKey(slug).forEach(subscriber => {
          if (subscriber.component === component) {
            this._subscribersBySlug.delete(slug, subscriber);
          }
        });
      });
    }
  }

  emit(component, ...args) {
    const { slug } = component;
    const [name, ...params] = args;

    if (this._subscribersBySlug.hasKey(slug)) {
      this._subscribersBySlug.getValuesForKey(slug).forEach(subscriber => {
        subscriber.trigger(name, params);
      });
    }
  }
}

export const subscribers = new Subscribers();
