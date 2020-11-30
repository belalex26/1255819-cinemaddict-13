import {createElement} from "../utils";

export const createTotalFilmsTemplate = (total) => {
  return `<p>${total} movies inside</p>`;
};

export class TotalFilms {
  constructor(total) {
    this._element = null;
    this._total = total;
  }

  getTemplate() {
    return createTotalFilmsTemplate(this._total);
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
