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
- Easy references through `data-ref="foo.child"` -> `this.$refs.child`
- Replace `dataset` with simple API `data-foo-prop="value"` -> `this.data.has('prop')`, `this.data.get('prop')`, `this.data.set('prop', 'another value')`
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

import MyComponent from 'kapla/MyComponent';

const context = require.context('./kapla', true, /\.js$/);
const app = Application.start(document.querySelector('.app')); // If no element -> body

// Auto loading
app.load(autoLoad(context));
// Manual loading
app.register('my-component', MyComponent);
```

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

> Component filename must be `PascalCase.js`
> Same element can be used multiple components: `data-component="foo bar baz"`

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
    onMove(e) {}
    onLeave(e) {}
}
```

##### Native/mixed + delegate

```js
export default class extends Component {
    init() {
        this.delegateClick = 'selector';
        this.delegateMove = 'selector';
    }
    onClick(e, target) {}
    onMove(e, target) {}
    …
}
```

##### Custom

Need to be 'registered' (before component registration).

```js
import { myCustomEvent } from './events';

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

```js
export const clickOutside = {
  eventsByElement: new Map(),
  bind(component) {
    this.eventsByElement.set(component.context.element, this.listener(component));

    window.addEventListener('click', this.eventsByElement.get(component.context.element));
  },
  unbind(component) {
    window.removeEventListener('click', this.eventsByElement.get(component.context.element));
  },
  listener(component) {
    return function listener(e) {
      if (!component.context.element.contains(e.target)) {
        component.onClickOutside(e);
      }
    };
  },
};
```

```js
export const raf = {
  scope: 'global',
  log: false,
  eventsByElement: new Map(),
  bind(component, ee) {
    this.ee = ee;
    this.eventsByElement.set(component.context.element, this.listener(component));

    this.ee.on('raf', this.eventsByElement.get(component.context.element));
    this.onTick = this.onTick.bind(this);
    this.time = window.performance.now();
    this.raf = window.requestAnimationFrame(this.onTick);
  },
  unbind() {
    window.cancelAnimationFrame(this.raf);
  },
  onTick(now) {
    this.time = now;
    this.delta = (now - this.oldTime) / 1000;
    this.oldTime = now;
    this.ee.emit('raf', this.delta, now);
    this.raf = window.requestAnimationFrame(this.onTick);
  },
  listener(component) {
    return function listener(delta, now) {
      component.onRaf(delta, now);
    };
  },
};
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

You can "subscribe" to another component:

- `const subscriber = this.subscribe('otherComponent')` (à tester : `other-component`)

This returns the "subscriber", then you can "listen" for some custom event…

- __component__: `subscriber.on('some-event', cb)`
- __otherComponent__: `subscriber.emit('some-event'[, args])`
