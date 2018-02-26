# 'Features'

- Déclaration de composants
    - Quid de `bar-qux` ou `foo--bar-qux` ? Too much ? Keep it simple ?
- `data-…` API
    - Seulement sur élément du composant ?
- Déclaration de références
    - Possibilité de "référencer" en dehors du composant ? Semble difficile si plusieurs instance du composant de base… Pourrait fonctionner avec première ou instance unique…
- Gestion des events
    - natifs: ajouter méthode ~~`click()`~~ directement. Ou `onClick()`
    - eventemitter: pouvoir ajouter `onCustomEvent()` ?
    - l'usage du `on…` semble plus cohérent, voire explicite…
    - voir l'intérêt d'un `data-action` ou `data-on` ou `data-bind` ou … ?

---

```html
<div data-component="qux"
     data-qux-value="something">
  <span data-ref="qux.child"></span>
</div>

<!-- <span data-ref="qux.outer-child"></span> -->

<div data-component="bar-qux"
     data-bar-qux-value="something">
  <span data-ref="bar-qux.child"></span>
</div>

<div data-component="foo--bar-qux"
     data-foo--bar-qux-value="something">
  <span data-ref="foo--bar-qux.child"></span>
</div>
```

`components/Qux.js`

> Utiliser le $ pour tout référence au dom ? ($el, $refs, $data)

```js
import { Component } from 'kapla/es';

export default class extends Component {
  // constructor() {} ???

  load() {
    // "Root" element
    this.($)el(ement); // $ or no $? -> garder le $el :)
    this.$el;
    // Data API
    this.data.get('value'); // returns 'something'
    this.data.has('value'); // returns true
    this.data.set('value', 'somethingelse'); // returns … ?
    this.$data; // ??? pour être consistent avec Vue ?
    // References
    this.$refs.child; // === SPANElement
  }

  init() {}
  destroy() {}
}
```
