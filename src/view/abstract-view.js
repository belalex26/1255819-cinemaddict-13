import {createElement} from '../utils.js';

export default class AbstractView {
  constructor() {
    if (new.target === AbstractView) {
      throw new Error(`Can't create Abstract class`);
    }
    this._element = null;
    this._callback = {};
  }

  getTemplate() {
    throw new Error(`Can't run abstract method`);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
