import {render, remove, replace, isKeyPressed} from '../utils.js';
import FilmPopupView from '../view/popup-film';
import FilmCardView from '../view/film-card';
import categories from '../view/popup-film';

const pageBody = document.querySelector(`body`);

export default class Movie {
  constructor(filmContainer, changeData, viewChange) {
    this._filmContainer = filmContainer;
    this._changeData = changeData;
    this._viewChange = viewChange;
    this._onOpenPopup = this._onOpenPopup.bind(this);
    this._onClosePopup = this._onClosePopup.bind(this);
    this._onPopupEscPress = this._onPopupEscPress.bind(this);
    this._card = null;

    this._handlerFavoriteClick = this._handlerFavoriteClick.bind(this);
    this._handlerWatchListClick = this._handlerWatchListClick.bind(this);
    this._handlerWatchedListClick = this._handlerWatchedListClick.bind(this);
    this.cardUpdateHandler = this.cardUpdateHandler.bind(this);

  }

  init(container, filmCard) {
    this._filmCard = filmCard;
    const prevFilmCard = this._card;

    this._card = new FilmCardView(this._filmCard);
    // render(container, this._card);

    this._card.setClickPopupHandler(this._onOpenPopup);

    this._card.setWatchedListClickHandler(this._handlerWatchedListClick);
    this._card.setWatchListClickHandler(this._handlerWatchListClick);
    this._card.setFavoriteClickHandler(this._handlerFavoriteClick);

    if (prevFilmCard === null) {
      render(container, this._card);
      return;
    }

    if (container.contains(prevFilmCard.getElement())) {
      replace(this._card, prevFilmCard);
    }

    remove(prevFilmCard);
  }

  destroy() {
    remove(this._card);
  }

  _onOpenPopup() {
    this._popup = new FilmPopupView(this._filmCard);

    pageBody.classList.add(`hide-overflow`);
    pageBody.appendChild(this._popup.getElement());
    this._popup.setCloseClickHandler(this._onClosePopup);
    this._card.setWatchedListClickHandler(this._handlerWatchedListClick);
    this._card.setWatchListClickHandler(this._handlerWatchListClick);
    this._card.setFavoriteClickHandler(this._handlerFavoriteClick);
    document.addEventListener(`keydown`, this._onPopupEscPress);
  }

  _onClosePopup() {
    if (this._popup) {
      pageBody.classList.remove(`hide-overflow`);
      pageBody.removeChild(this._popup.getElement());
      document.removeEventListener(`keydown`, this._onPopupEscPress);
      this._card.setClickPopupHandler(this._onOpenPopup);
      this._popup = null;
    }
  }

  cardUpdateHandler(category) {
    switch (category) {
      case categories.WATCHLIST:
        this._watchListClickHandler();
        break;
      case categories.WATCHEDLIST:
        this._watchedListClickHandler();
        break;
      case categories.FAVOURITES:
        this._cardFavouriteClickHandler();
        break;
    }
  }

  _onPopupEscPress(evt) {
    isKeyPressed(evt, this._onClosePopup, `Escape`);
  }

  closePopup() {
    this._onClosePopup();
  }

  _handlerFavoriteClick() {
    this._changeData(
        Object.assign(
            {},
            this._filmCard,
            {
              favorite: !this._filmCard.favorite
            }
        )
    );
  }

  _handlerWatchListClick() {
    this._changeData(
        Object.assign(
            {},
            this._filmCard,
            {
              watchList: !this._filmCard.watchList
            }
        )
    );
  }

  _handlerWatchedListClick() {
    this._changeData(
        Object.assign(
            {},
            this._filmCard,
            {
              watched: !this._filmCard.watched
            }
        )
    );
  }
}
