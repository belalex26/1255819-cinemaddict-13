import {render, remove, isKeyPressed} from '../utils.js';
import FilmPopupView from '../view/popup-film';
import FilmCardView from '../view/film-card';

const pageBody = document.querySelector(`body`);

export default class Movie {
  constructor(changeData, viewChange) {
    this._changeData = changeData;
    this._viewChange = viewChange;
    this._onOpenPopup = this._onOpenPopup.bind(this);
    this._onClosePopup = this._onClosePopup.bind(this);
    this._onPopupEscPress = this._onPopupEscPress.bind(this);
    this._card = null;

    this._handlerFavoriteClick = this._handlerFavoriteClick.bind(this);
    this._handlerWatchlistClick = this._handlerWatchlistClick.bind(this);
    this._handlerWatchedlistClick = this._handlerWatchedlistClick.bind(this);

  }
  destroy() {
    remove(this._card);
  }

  init(container, filmCard) {
    this._filmCard = filmCard;

    this._card = new FilmCardView(this._filmCard);
    render(container, this._card);

    this._card.setClickPopupHandler(this._onOpenPopup);
    this._card.setWatchedlistClickHandler(this._handlerWatchedlistClick);
    this._card.setWatchlistClickHandler(this._handlerWatchlistClick);
    this._card.setFavoriteClickHandler(this._handlerFavoriteClick);
  }

  _onOpenPopup() {
    // this._viewChange();
    this._popup = new FilmPopupView(this._filmCard);

    pageBody.classList.add(`hide-overflow`);
    pageBody.appendChild(this._popup.getElement());
    this._popup.setCloseClickHandler(this._onClosePopup);
    this._card.setWatchedlistClickHandler(this._handlerWatchedlistClick);
    this._card.setWatchlistClickHandler(this._handlerWatchlistClick);
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
            this._card,
            {
              favorite: !this._card.favorite
            }
        )
    );

  }

  _handlerWatchlistClick() {
    this._changeData(
        Object.assign(
            {},
            this._card,
            {
              watchList: !this._card.watchList
            }
        )
    );
  }

  _handlerWatchedlistClick() {
    this._changeData(
        Object.assign(
            {},
            this._card,
            {
              watched: !this._card.watched
            }
        )
    );
  }
}
