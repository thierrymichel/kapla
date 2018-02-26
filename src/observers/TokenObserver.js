import { ElementObserver } from '../observers';
import { IndexedMultimap } from '../multimap';

export class TokenObserver {
  constructor(element, attributeName, delegate) {
    this.attributeName = attributeName;
    this.delegate = delegate;

    this.elementObserver = new ElementObserver(element, this);
    this.tokensByElement = new IndexedMultimap();
  }

  start() {
    this.elementObserver.start();
  }

  stop() {
    this.elementObserver.stop();
  }

  refresh() {
    this.elementObserver.refresh();
  }

  get selector() {
    return `[${this.attributeName}]`;
  }

  getElementsMatchingToken(token) {
    return this.tokensByElement.getKeysForValue(token);
  }

  // Delegate
  matchElement(element) {
    return element.hasAttribute(this.attributeName);
  }

  matchElementsInTree(tree = this.element) {
    const match = this.matchElement(tree) ? [tree] : [];
    const matches = Array.from(tree.querySelectorAll(this.selector));

    return match.concat(matches);
  }

  elementMatched(element) {
    const newTokens = Array.from(this._readTokenSetForElement(element));

    for (const token of newTokens) {
      this._elementMatchedToken(element, token);
    }
  }

  elementUnmatched(element) {
    const tokens = this._getTokensForElement(element);

    for (const token of tokens) {
      this._elementUnmatchedToken(element, token);
    }
  }

  elementAttributeChanged(element) {
    const newTokenSet = this._readTokenSetForElement(element);

    for (const token of Array.from(newTokenSet)) {
      this.elementMatched(element, token);
    }

    for (const token of this._getTokensForElement(element)) {
      if (!newTokenSet.has(token)) {
        this.elementUnmatched(element, token);
      }
    }
  }

  // Private
  _elementMatchedToken(element, token) {
    if (!this.tokensByElement.has(element, token)) {
      this.tokensByElement.add(element, token);
      if (this.delegate.elementMatchedToken) {
        this.delegate.elementMatchedToken(element, token, this.attributeName);
      }
    }
  }

  _elementUnmatchedToken(element, token) {
    if (this.tokensByElement.has(element, token)) {
      this.tokensByElement.delete(element, token);
      if (this.delegate.elementUnmatchedToken) {
        this.delegate.elementUnmatchedToken(element, token, this.attributeName);
      }
    }
  }

  _getTokensForElement(element) {
    return this.tokensByElement.getValuesForKey(element);
  }

  _readTokenSetForElement(element) {
    const tokens = new Set();
    const value = element.getAttribute(this.attributeName) || '';

    for (const token of value.split(/\s+/)) {
      if (token.length) {
        tokens.add(token);
      }
    }

    return tokens;
  }
}
