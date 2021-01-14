import {render, remove, isKeyPressed, updateUserPropertyArray} from '../utils.js';
import FilmPopupView from '../view/popup-film';
import FilmCardView from '../view/film-card';

const pageBody = document.querySelector(`body`);
let popup;

export default class Movie {
  constructor(filmChangeCb, userChangeCb, closePopupsCb) {
    this._card = null;
    this._popup = null;
    this._pageBody = document.querySelector(`body`);
    this._filmChange = filmChangeCb;
    this._userChange = userChangeCb;
    this._closePopups = closePopupsCb;

    this._closePopup = this._closePopup.bind(this);
    this._openPopup = this._openPopup.bind(this);

    this._onCardPosterClick = this._onCardPosterClick.bind(this);
    this._onCardTitleClick = this._onCardTitleClick.bind(this);
    this._onCardCommentsClick = this._onCardCommentsClick.bind(this);
    this._onPopupEscPress = this._onPopupEscPress.bind(this);
    this._onPopupCrossClick = this._onPopupCrossClick.bind(this);
    this._onCardWatchlistClick = this._onCardWatchlistClick.bind(this);
    this._onCardToHistoryClick = this._onCardToHistoryClick.bind(this);
    this._onCardFavouritesClick = this._onCardFavouritesClick.bind(this);

  }
  destroy() {
    remove(this._card);
  }

  init(container, film) {
    this._card = film;
    this._renderCard(container, film);
    // this._setEventListeners();
  }

  _closePopup() {
    if (this._popup) {
      popup.getElement().remove();
      document.removeEventListener(`keyup`, this._onPopupEscPress);
      pageBody.classList.remove(`hide-overflow`);
    }
  }

  _openPopup(evt) {
    evt.preventDefault();
    this._closePopups();
    this._popup = new FilmPopupView(this._card);
    render(pageBody, this._popup);
    popup.setCrossClickHandler(this._onPopupCrossClick);
    document.addEventListener(`keyup`, this._onPopupEscPress);
    pageBody.classList.add(`hide-overflow`);
  }

  _onCardWatchlistClick() {
    this._userChange(`watchlist`, updateUserPropertyArray(this._user.watchlist, this._film.id), this._film);
  }

  _onCardFavouritesClick() {
    this._filmChange(Object.assign(
        {},
        this._film,
        {
          isFavourite: !this._film.isFavourite
        }
    ));
    this._userChange(`favourites`, updateUserPropertyArray(this._user.favourites, this._film.id), this._film);
  }

  _onCardToHistoryClick() {
    this._filmChange(Object.assign(
        {},
        this._film,
        {
          isInHistory: !this._film.isInHistory
        }
    ));
    this._userChange(`history`, updateUserPropertyArray(this._user.history, this._film.id), this._film);
  }

  _onCardPosterClick(evt) {
    this._openPopup(evt);
  }

  _onCardTitleClick(evt) {
    this._openPopup(evt);
  }

  _onCardCommentsClick(evt) {
    this._openPopup(evt);
  }

  _onPopupEscPress(evt) {
    isKeyPressed(evt, this._closePopup, `Escape`);
  }

  _onPopupCrossClick() {
    this._closePopup();
  }

  _setEventListeners() { // если добавить вызов, появляется ошибка
    this._card.setPosterClickHandler(this._onCardPosterClick);
    this._card.setTitleClickHandler(this._onCardTitleClick);
    this._card.setCommentsClickHandler(this._onCardCommentsClick);
    this._card.setToWatchListButtonClickHandler(this._onCardWatchlistClick);
    this._card.setWatchedButtonClickHandler(this._onCardToHistoryClick);
    this._card.setToFavouritesButtonClickHandler(this._onCardFavouritesClick);
  }

  _renderCard(container) {
    const card = new FilmCardView(this._card);
    render(container, card);
  }
}


