export class ElementObserver {
  constructor(element, delegate) {
    this.element = element;
    this.delegate = delegate;
    this.started = false;

    this.elements = new Set();
    this.mutationObserver = new MutationObserver(mutations => this._processMutations(mutations));
  }

  // Observer / elements handling
  start() {
    if (!this.started) {
      this.mutationObserver.observe(this.element, {
        attributes: true,
        childList: true,
        subtree: true,
      });
      this.started = true;
      this.refresh();
    }
  }

  stop() {
    if (this.started) {
      this.mutationObserver.takeRecords();
      this.mutationObserver.disconnect();
      this.started = false;
    }
  }

  refresh() {
    if (this.started) {
      const matches = new Set(this._matchElementsInTree());

      for (const element of Array.from(this.elements)) {
        if (!matches.has(element)) {
          this._removeElement(element);
        }
      }

      for (const element of Array.from(matches)) {
        this._addElement(element);
      }
    }
  }

  // Delegate
  _matchElement(element) {
    return this.delegate.matchElement(element);
  }

  _matchElementsInTree(tree = this.element) {
    return this.delegate.matchElementsInTree(tree);
  }

  // Observer callback / process
  _processMutations(mutations) {
    for (const mutation of mutations) {
      this._processMutation(mutation);
    }
  }

  _processMutation(mutation) {
    if (mutation.type === 'attributes') {
      this._processAttributeChange(mutation.target, mutation.attributeName);
    } else if (mutation.type === 'childList') {
      this._processRemovedNodes(mutation.removedNodes);
      this._processAddedNodes(mutation.addedNodes);
    }
  }

  _processAttributeChange(node, attributeName) {
    const element = node;

    if (this.elements.has(element)) {
      if (this.delegate.elementAttributeChanged && this._matchElement(element)) {
        this.delegate.elementAttributeChanged(element, attributeName);
      } else {
        this._removeElement(element);
      }
    } else if (this._matchElement(element)) {
      this._addElement(element);
    }
  }

  _processRemovedNodes(nodes) {
    for (const node of Array.from(nodes)) {
      this._processNode(node, this._removeElement);
    }
  }

  _processAddedNodes(nodes) {
    for (const node of Array.from(nodes)) {
      this._processNode(node, this._addElement);
    }
  }

  _processNode(node, processor) {
    const tree = ElementObserver.elementFromNode(node);

    if (tree) {
      for (const element of this._matchElementsInTree(tree)) {
        processor.call(this, element);
      }
    }
  }

  // Process only Element nodes
  static elementFromNode(node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      return node;
    }

    return false;
  }

  _addElement(element) {
    if (!this.elements.has(element)) {
      this.elements.add(element);
      if (this.delegate.elementMatched) {
        this.delegate.elementMatched(element);
      }
    }
  }

  _removeElement(element) {
    if (this.elements.has(element)) {
      this.elements.delete(element);
      if (this.delegate.elementUnmatched) {
        this.delegate.elementUnmatched(element);
      }
    }
  }
}
