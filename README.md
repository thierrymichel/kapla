# kapla 👷‍

![stability-wip](https://img.shields.io/badge/stability-work_in_progress-lightgrey.svg?style=flat-square)
[![NPM version](https://img.shields.io/npm/v/kapla.svg?style=flat-square)](https://www.npmjs.com/package/kapla)
[![Coverage Status](https://img.shields.io/coveralls/thierrymichel/kapla/master.svg?style=flat-square)](https://coveralls.io/github/thierrymichel/kapla?branch=master)

> Tiny JS framework to manage DOM components

## wip

### Start application

```html
<main class="app"></main>
```

```js
import { Application } from 'kapla/es';
import { autoLoad } from 'kapla/es/helpers';

import MyComponent from './components/MyComponent';

const context = require.context('./components', true, /\.js$/);
const app = Application.start(qs('.app')); // If no element -> body

// Auto loading
app.load(autoLoad(context));
// Manual loading
app.register('my-component', MyComponent);
```

### Use components

```html
<div data-component="my-component"></div>
<div data-component="sub--my-component"></div>
```

- `scripts/components/MyComponent.js`
- `scripts/components/sub/MyComponent.js`

```js
import { Component } from 'kapla/es';

export default class extends Component {
}
```

> Compoent filename must be `PascalCase.js`
