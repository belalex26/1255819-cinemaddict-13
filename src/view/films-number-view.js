import AbstractView from './abstract-view';

const createFilmsNumber = (filmsNumber) => {
  return `<p>${filmsNumber} movies inside</p>`;
};

export default class FilmsNumberView extends AbstractView {
  constructor(filmsNumber) {
    super();
    this._filmsNumber = filmsNumber;
  }

  getTemplate() {
    return createFilmsNumber(this._filmsNumber);
  }
}
