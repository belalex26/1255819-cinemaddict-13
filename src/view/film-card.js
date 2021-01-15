import AbstractView from './abstract-view';

const createCardFilm = (cardFilm) => {
  const getActiveClass = (property) => {
    return (cardFilm[property] === true) ? ` film-card__controls-item--active` : ``;
  };

  const {filmName, poster, description, date, rating, genre, comments, duration} = cardFilm;

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

  return `<article class="film-card">
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
    this._clickPopupHandler = this._clickPopupHandler.bind(this);

    this._onWatchedlistClick = this._onWatchedlistClick.bind(this);
    this._onWatchlistClick = this._onWatchlistClick.bind(this);
    this._onFavoriteClick = this._onFavoriteClick.bind(this);
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
    this.getElement().querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, this._onFavoriteClick);
  }

  _onFavoriteClick(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, this._onWatchlistClick);
  }

  _onWatchlistClick(evt) {
    evt.preventDefault();
    this._callback.watchlistClick();
  }

  setWatchedlistClickHandler(callback) {
    this._callback.watchedlistClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, this._onWatchedlistClick);
  }

  _onWatchedlistClick(evt) {
    evt.preventDefault();
    this._callback.watchedlistClick();
  }
}
