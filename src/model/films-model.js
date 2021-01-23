import Observer from './observer';
import {ModelMethod} from '../utils';

export default class FilmModel extends Observer {
  constructor() {
    super();
    this._filmCards = [];
    this._observers = {
      updateFilm: []
    };
  }

  setFilms(filmCards) {
    this._filmCards = filmCards.slice();
  }

  getFilms() {
    return this._filmCards;
  }

  updateFilm(elementToUpdate) {
    const index = this._filmCards.findIndex((element) => element.id === elementToUpdate.id);
    if (index === -1) {
      throw new Error(`Film doesn't exist`);
    }

    this._filmCards.splice(index, 1, elementToUpdate);

    this.notify(ModelMethod.UPDATE_FILM, elementToUpdate);
  }
}
