# kapla 👷‍

![stability-wip](https://img.shields.io/badge/stability-work_in_progress-lightgrey.svg?style=flat-square)
[![NPM version](https://img.shields.io/npm/v/kapla.svg?style=flat-square)](https://www.npmjs.com/package/kapla)
[![Coverage Status](https://img.shields.io/coveralls/thierrymichel/kapla/master.svg?style=flat-square)](https://coveralls.io/github/thierrymichel/kapla?branch=master)

> Tiny JS framework to manage DOM components

## wip

### Overview

The main goal is to make easier to implement common tasks/features:

- Component declaration and instanciation
- Component init and destroy (Barba.js ou load more…)
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
import { Application } from 'kapla/es';
import { autoLoad } from 'kapla/es/helpers';

import MyComponent from 'components/MyComponent';

const context = require.context('./components', true, /\.js$/);
const app = Application.start(qs('.app')); // If no element -> body

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

- `scripts/components/Foo.js`
- `scripts/components/sub/BarBaz.js`

```js
import { Component } from 'kapla/es';

export default class extends Component {
    load() {}
    init() {}
    destroy() {}
}
```

> Component filename must be `PascalCase.js`

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
