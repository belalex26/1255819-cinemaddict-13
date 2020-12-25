
import {createElement} from './../utils';

const createFilmsCatalog = (isCatalogEmpty) => {
  return `<section class="films">
  <section class="films-list">
    ${isCatalogEmpty ?
    `<h2 class="films-list__title">There are no movies in our database</h2>` :
    `<h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
    <div class="films-list__container"></div>`}
  </section>`;
};

export default class CatalogFilms {
  constructor(isEmpty) {
    this._element = null;
    this._isEmpty = isEmpty;
  }

  getTemplate() {
    return createFilmsCatalog(this._isEmpty);
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
