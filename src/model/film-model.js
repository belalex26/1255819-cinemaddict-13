import {ModelMethod} from '../const';
import Observer from './observer';

export default class FilmModel extends Observer {
  constructor(api) {
    super();
    this._api = api;
    this._films = [];
    this._observers = {
      updateFilm: [],
      updateFilmWithRerender: [],
      setFilms: []
    };
  }

  setFilms(films) {
    this._films = films.slice();
    this.notify(ModelMethod.SET_FILMS, films);
  }

  getFilms() {
    return this._films.slice();
  }

  updateFilm({filmToUpdate = {}, isNotificationNeeded = true}) {
    return this._api.updateFilm(filmToUpdate).then((updatedFilm) => {
      this.replaceFilm({filmToUpdate: updatedFilm, isNotificationNeeded});
    });
  }

  replaceFilm({filmToUpdate = {}, isNotificationNeeded = true}) {
    const index = this._films.findIndex((element) => element.id === filmToUpdate.id);
    this._films.splice(index, 1, filmToUpdate);

    const modelMethod = isNotificationNeeded ? ModelMethod.UPDATE_FILM : ModelMethod.UPDATE_FILM_WITH_RERENDER;
    this.notify(modelMethod, filmToUpdate);
  }
}
