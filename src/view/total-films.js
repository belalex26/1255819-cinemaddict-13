import {createElement} from './../utils';

const createFilmsNumber = (filmsNumber) => {
  return `<p>${filmsNumber} movies inside</p>`;
};

export default class TotalFilms {
  constructor(filmsNumber) {
    this._element = null;
    this._filmsNumber = filmsNumber;
  }

  getTemplate() {
    return createFilmsNumber(this._filmsNumber);
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
