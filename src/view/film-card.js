import AbstractView from './abstract-view';
import {getDuration} from '../utils';

const createFilmCard = (film) => {

  const getActiveClass = (property) => {
    return (film[property] === true) ? ` film-card__controls-item--active` : ``;
  };

  const {title, rating, date, duration, genre, poster, description, comments} = film;

  const maxLengthDescription = 139;

  const shorten = (text, maxLength) => {
    const descriptionText = text;
    if (descriptionText.length > maxLength) {
      const cutText = descriptionText.substr(0, maxLength) + ` ...`;
      return cutText;
    }
    return descriptionText;
  };

  const shortenDescription = shorten(description, maxLengthDescription);

  return `<article class="film-card">
  <h3 class="film-card__title">${title}</h3>
  <p class="film-card__rating">${rating}</p>
  <p class="film-card__info">
    <span class="film-card__year">${new Date(date).getFullYear()}</span>
    <span class="film-card__duration">${getDuration(duration)}</span>
    <span class="film-card__genre">${genre.join(` `)}</span>
  </p>
  <img src="${poster}" alt="" class="film-card__poster">
  <p class="film-card__description">${shortenDescription}</p>
  <a class="film-card__comments">${comments.length} ${comments.length === 1 ? `comment` : `comments`}</a>
  <div class="film-card__controls">
    <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist${getActiveClass(`isInWatchlist`)}" type="button">Add to watchlist</button>
    <button class="film-card__controls-item button film-card__controls-item--mark-as-watched${getActiveClass(`isInHistory`)}" type="button">Mark as watched</button>
    <button class="film-card__controls-item button film-card__controls-item--favorite${getActiveClass(`isFavourite`)}" type="button">Mark as favorite</button>
  </div>
</article>`;
};

export default class FilmCard extends AbstractView {
  constructor(film) {
    super();
    this._film = film;
    this._onPosterClick = this._onPosterClick.bind(this);
    this._onTitleClick = this._onTitleClick.bind(this);
    this._onCommentsClick = this._onCommentsClick.bind(this);
    this._onToWatchListButtonClick = this._onToWatchListButtonClick.bind(this);
    this._onToFavouritesButtonClick = this._onToFavouritesButtonClick.bind(this);
    this._onWatchedButtonClick = this._onWatchedButtonClick.bind(this);
  }

  getTemplate() {
    return createFilmCard(this._film);
  }

  _onPosterClick(evt) {
    evt.preventDefault();
    this._callback.posterClick(evt);
  }

  _onTitleClick(evt) {
    evt.preventDefault();
    this._callback.titleClick(evt);
  }

  _onCommentsClick(evt) {
    evt.preventDefault();
    this._callback.commentsClick(evt);
  }

  _onToWatchListButtonClick(evt) {
    evt.preventDefault();
    this._callback.watchListClick();
  }

  _onToFavouritesButtonClick(evt) {
    evt.preventDefault();
    this._callback.favouritesClick();
  }

  _onWatchedButtonClick(evt) {
    evt.preventDefault();
    this._callback.watchedClick();
  }

  setPosterClickHandler(callback) {
    this._callback.posterClick = callback;
    this.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, this._onPosterClick);
  }

  setTitleClickHandler(callback) {
    this._callback.titleClick = callback;
    this.getElement().querySelector(`.film-card__title`).addEventListener(`click`, this._onTitleClick);
  }

  setCommentsClickHandler(callback) {
    this._callback.commentsClick = callback;
    this.getElement().querySelector(`.film-card__comments`).addEventListener(`click`, this._onCommentsClick);
  }

  setToWatchListButtonClickHandler(callback) {
    this._callback.watchListClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, this._onToWatchListButtonClick);
  }

  setToFavouritesButtonClickHandler(callback) {
    this._callback.favouritesClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, this._onToFavouritesButtonClick);
  }

  setWatchedButtonClickHandler(callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, this._onWatchedButtonClick);
  }
}
