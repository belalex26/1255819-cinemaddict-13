import Observer from './observer';
import {ModelMethod, UserRating} from '../const';

export default class UserModel extends Observer {
  constructor(filmsModel) {
    super();
    this._filmsModel = filmsModel;
    this._userRating = UserRating.NOVICE;
    this._observers = {
      updateRating: []
    };

    this.updateRating = this.updateRating.bind(this);

    this._filmsModel.addObserver(ModelMethod.SET_FILMS, this.updateRating);
    this._filmsModel.addObserver(ModelMethod.UPDATE_FILM, this.updateRating);
    this._filmsModel.addObserver(ModelMethod.UPDATE_FILM_WITH_RERENDER, this.updateRating);
  }

  getRating() {
    return this._userRating;
  }

  _getUserRaiting(watchedFilms) {
    if (watchedFilms > 20) {
      return UserRating.MOVIE_BUFF;
    } else if (watchedFilms > 10 && watchedFilms <= 20) {
      return UserRating.FAN;
    } else if (watchedFilms > 0 && watchedFilms <= 10) {
      return UserRating.NOVICE;
    }
    return null;
  }

  updateRating() {
    const watchedFilms = this._getWatchedFilmsNumber(this._filmsModel.getFilms());
    const userRating = this._getUserRaiting(watchedFilms);

    if (this._userRating === userRating) {
      return;
    }
    this._userRating = userRating;

    this.notify(ModelMethod.UPDATE_USER_RATING, this._userRating);
  }

  _getWatchedFilmsNumber(films) {
    return films.reduce((acc, currentFilm) => acc + currentFilm.isInHistory, 0);
  }
}
