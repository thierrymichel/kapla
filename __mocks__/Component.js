import { Component } from '../src';

export class TestComponent extends Component {
  constructor(context) {
    super(context);
    this.increment = 0;
  }

  init() {
    this.increment += 1;
  }

  destroy() {
    this.increment -= 1;
  }
}
