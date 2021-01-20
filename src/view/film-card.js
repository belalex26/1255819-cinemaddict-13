import AbstractView from './abstract-view';

const createCardFilm = (cardFilm) => {

  const {id, filmName, poster, description, date, rating, genre, comments, duration, watched, watchList, favorite} = cardFilm;

  const maxLengthDescription = 140;

  const shorten = (text, maxLength) => {
    const descriptionText = text;
    if (descriptionText.length > maxLength) {
      const cutText = descriptionText.substr(0, maxLength) + ` ...`;
      return cutText;
    }
    return descriptionText;
  };

  const shortenDescription = shorten(description, maxLengthDescription);

  return `<article class="film-card" data-id=${id}>
  <h3 class="film-card__title">${filmName}</h3>
  <p class="film-card__rating">${rating}</p>
  <p class="film-card__info">
    <span class="film-card__year">${date.getFullYear()}</span>
    <span class="film-card__duration">${duration}</span>
    <span class="film-card__genre">${genre.join(`, `)}</span>
  </p>
  <img src="./images/posters/${poster}" alt="" class="film-card__poster">
  <p class="film-card__description">${shortenDescription}</p>
  <a class="film-card__comments">${comments.length} ${comments.length === 1 ? `comment` : `comments`}</a>
  <div class="film-card__controls">
    <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist film-card__controls-item${watchList ? `--active` : ``}" type="button">Add to watchlist</button>
    <button class="film-card__controls-item button film-card__controls-item--mark-as-watched film-card__controls-item${watched ? `--active` : ``}" type="button">Mark as watched</button>
    <button class="film-card__controls-item button film-card__controls-item--favorite film-card__controls-item${favorite ? `--active` : ``}" type="button">Mark as favorite</button>
  </div>
</article>`;
};

export default class FilmCard extends AbstractView {
  constructor(cardFilm) {
    super();
    this._film = cardFilm;
    this._clickPopupHandler = this._clickPopupHandler.bind(this);

    this._watchedListClickHandler = this._watchedListClickHandler.bind(this);
    this._watchListClickHandler = this._watchListClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createCardFilm(this._film);
  }

  _clickPopupHandler(evt) {
    evt.preventDefault();
    this._callback.clickPopup(this._film);
  }

  setClickPopupHandler(callback) {
    this._callback.clickPopup = callback;
    this.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, this._clickPopupHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, this._favoriteClickHandler);
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setWatchListClickHandler(callback) {
    this._callback.watchListClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, this._watchListClickHandler);
  }

  _watchListClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchListClick();
  }

  setWatchedListClickHandler(callback) {
    this._callback.watchedListClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, this._watchedListClickHandler);
  }

  _watchedListClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchedListClick();
  }
}
