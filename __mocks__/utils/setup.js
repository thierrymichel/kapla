import { Application } from '../../src';
import { TestComponent } from '../Component';

/**
 * Create and start a test application
 *
 * @export
 * @param {HTMLElement} [element=undefined] app element
 * @param {Object} [schema=undefined] app schema
 * @returns {Application} app instance
 */
export function createApplication(element = undefined, schema = undefined) {
  return Application.start(element, schema);
}

/**
 * Create a test component
 *
 * @export
 * @param {String} name component name
 * @returns {Component} component Class definition
 */
export function createComponent(name) {
  const element = document.createElement('div');

  element.setAttribute('data-component', name);
  document.body.appendChild(element);

  class Test extends TestComponent {}
  Object.defineProperty(Test, 'name', { value: capitalize(name) });

  return Test;
}

/**
 * Capitalize
 *
 * @param {String} string string to process
 * @returns {String} capitalized string
 */
function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
