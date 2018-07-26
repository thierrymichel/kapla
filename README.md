# kapla 👷‍

![stability-wip](https://img.shields.io/badge/stability-work_in_progress-lightgrey.svg?style=flat-square)
[![NPM version](https://img.shields.io/npm/v/kapla.svg?style=flat-square)](https://www.npmjs.com/package/kapla)
[![Coverage Status](https://img.shields.io/coveralls/thierrymichel/kapla/master.svg?style=flat-square)](https://travis-ci.com/thierrymichel/kapla)

> Tiny JS framework to manage DOM components

## wip

### Overview

The main goal is to make easier to implement common tasks/features:

- Component declaration and instanciation
- Component init and destroy (Barba.js or load more…)
- Access to `$el` et `$refs`
- Use of `data-attribute`
- Events handling with the right context (standard or custom)

Main features :

- Components `autoload` + declaration `data-component="foo"`
- Component lifecycle : `load`, `init`, `destroy`
- Easy references:
    - `data-component="foo"` -> `this.$el`
    - `data-ref="foo.child"` -> `this.$refs.child`
- Provide simple API to manage `dataset`:
    - `data-foo-prop="value"` ->
        - `this.data.has('prop')` // true
        - `this.data.get('prop')` // value
        - `this.data.set('prop', 'another value')` // another value
- Events binding/unbinding with `onClick() {}` ou `onCustomEvent() {}`

### Start application

```html
<main class="app"></main>
```

```js
import {
  Application,
  autoLoad,
} from 'kapla';

import MyComponent from 'kapla-register/MyComponent';

const context = require.context('./kapla', true, /\.js$/);
const app = Application.start(document.querySelector('.app')); // If no element -> document.body

// Auto loading
// Everything inside "context folder" and named in PascalCase
app.load(autoLoad(context));
// Manual registering
app.register('my-component', MyComponent);
```

### Pass "properties" to all components

```js
const app = Application.start(document.body, undefined, {
  prop: 'value',
});
```

Properties will be accessible in all components through `this.prop`.

> The second paramater is for "custom schema" ([more info](src/core/schema.js))

### Use components

#### Basics

```html
<div data-component="foo"></div>
<div data-component="sub--bar-baz"></div>
```

- `scripts/kapla/Foo.js`
- `scripts/kapla/sub/BarBaz.js`

```js
import { Component } from 'kapla';

export default class extends Component {
    load() {}
    init() {}
    destroy() {}
}
```

> Component filename must be `PascalCase.js` for autoload.
> Same element can be used multiple components: `data-component="foo bar baz"`.

#### References

```html
<div data-component="foo">
    <button type="submit" data-ref="foo.submit">Submit</button>
</div>
```

```js
this.$el // DIV
this.$refs.submit // BUTTON
```

> Same element can be ref for multiple components: `data-ref="foo.submit bar.button"`.

#### Data

```html
<div data-component="foo" data-foo-prop="qux"></div>
```

```js
this.data.has('prop') // true
this.data.get('prop') // 'qux'
this.data.set('prop', 'quux') // 'quux'
```

#### Events

##### Native

Automatic binding/unbinding through lifecycle (init/destroy).

```js
export default class extends Component {
    onClick(e) {}
    onBlur(e) {}
    …
}
```

##### Mixed

Automatic binding/unbinding through lifecycle (init/destroy).

```js
export default class extends Component {
    onEnter(e) {}
    onLeave(e) {}
    onMove(e) {}
    onOver(e) {}
    onOut(e) {}
}
```

##### Native/mixed + delegate

```js
export default class extends Component {
    init() {
        this.delegateClick = 'selector'; // CSS selector
        this.delegateClick = this.$refs.child; // HTMLElement
        this.delegateClick = document.querySelectorAll('selector'); // HTMLCollection (or Array of elements)

        this.delegateMove = 'selector';
    }
    onClick(e, target) {} // extra "target" parameter
    onMove(e, target) {}
    …
}
```

##### Custom

Need to be 'registered' (before component registration).

```js
import { myCustomEvent } from './my-custom-events';

app.use('myCustomEvent', myCustomEvent);
```

Then, automatic binding/unbinding through lifecycle (init/destroy).

```js
export default class extends Component {
    onMyCustomEvent(...args) {}
}
```

###### CustomEvent examples

Should have `bind` and `unbind` methods which receive `component` and `ee` as parameters.
Can be 'scoped' to `component` (default) or `global` (see second example).
In this case, you can choose to log the event name when it is emitted…
Also, global custom events are binded only when components are listening to them.
They are unbinded when no more components are listening to them.

`clickOutside.js`

```js
import { CustomEvent } from 'kapla';

class MyEvent extends CustomEvent {
  constructor(...args) {
    super(...args);
  }

  bind(component) {
    const { element } = component.context;

    this.eventByElement.set(element, this.callback(component));
    window.addEventListener('scroll', this.eventByElement.get(element));
  }

  unbind(component) {
    const { element } = component.context;

    window.removeEventListener('scroll', this.eventByElement.get(element));
  }

  callback(component) { // eslint-disable-line class-methods-use-this
    return function callbacl(e) {
      if (!component.context.element.contains(e.target)) {
        component.onClickOutside(e);
      }
    };
  }
};

export const clickOutside = new MyEvent('clickOutside');
```

`raf.js`

```js
import { CustomEvent } from 'kapla';

class MyEvent extends CustomEvent {
  constructor(...args) {
    super(...args);

    this.scope = 'global';
    this.log = false;
  }

  bind(component, ee) {
    const { element } = component.context;

    this.ee = ee;
    this.eventByElement.set(element, this.callback(component));


    this.ee.on('raf', this.eventByElement.get(element));
    this.onTick = this.onTick.bind(this);
    this.time = window.performance.now();
    this.raf = window.requestAnimationFrame(this.onTick);
  }

  unbind(component, ee) {
    ee.off('raf', this.eventByElement.get(component.context.element));
    window.cancelAnimationFrame(this.raf);
  }

  onTick(now) {
    this.time = now;
    this.delta = (now - this.oldTime) / 1000;
    this.oldTime = now;
    this.ee.emit('raf', this.delta, now);
    this.raf = window.requestAnimationFrame(this.onTick);
  }

  callback(component) { // eslint-disable-line class-methods-use-this
    return function callback(delta, now) {
      component.onRaf(delta, now);
    };
  }
}

export const raf = new MyEvent('raf');
```

##### Manual

Native, mixed or custom events can be 'binded' or 'unbinded' manually.

```js
export default class extends Component {
    method() {
        this.bind('click');
        this.bind('enter');
        this.bind('myCustomEvent');
    }
}
```

#### Communication between components

You can "subscribe" to another component. It makes communication easier between components:

- `const subscriber = this.subscribe('other-component')`

This returns the "subscriber", then you can "listen" for some custom event…

- __Component.js__: `subscriber.on('some-event', cb)`
- __OtherComponent.js__: `this.emit('some-event'[, args])`

> NB: `.on` method returns the "subscriber" and then can be chained (`this.subscribe('c').on('foo', cb).on('bar', cb)…`).
