import dayjs from 'dayjs';
import SmartView from './smart-view';
import {EMOTIONS, EMOTION_PICS, CATEGORIES} from '../utils';

const maxLengthDescription = 140;
const genreOneTitle = document.getElementsByClassName(`genres`);


const createPopupTemplate = (filmCard) => {
  const {filmName, originalName, rating, date, duration, genre, poster, description, comments, director, writers, actors, country, ageLimit, isInWatchlist, isInHistory, isFavourite, userComment, chosenSmile} = filmCard;

  const genres = genre.map((value, index) => {

    return `<span class="film-details__genre">${genre[index]}</span>`;
  }).join(`,`);

  const insertGenre = () => {

    let genreTitle = genreOneTitle.innerHTML = `Genre`;

    if (genre.length >= 2) {
      genreTitle = genreOneTitle.innerHTML = `Genres`;
    }
    return genreTitle;
  };

  const insertGenreTitle = insertGenre();

  const shorten = (text, maxLength) => {
    const descriptionText = text;
    if (descriptionText.length > maxLength) {
      const cutText = descriptionText.substr(0, maxLength) + ` ...`;
      return cutText;
    }
    return descriptionText;
  };

  const shortenDescription = shorten(description, maxLengthDescription);

  const emojiRadio = EMOTIONS.map((value, index) => {
    const emotion = EMOTIONS[index];
    return `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emotion}" value="${emotion}" ${(emotion === chosenSmile) ? ` checked` : ``} value="${emotion}">
    <label class="film-details__emoji-label" for="emoji-${emotion}">
      <img src="./images/emoji/${emotion}.png" width="30" height="30" alt="emoji">
    </label>`;
  }).join(``);

  const smileImg = chosenSmile ? `<img src="${EMOTION_PICS[chosenSmile]}" width="55" height="55" alt="emoji-${chosenSmile}">` : ``;
  const commentValue = userComment || ``;

  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="./images/posters/${poster}" alt="">
          <p class="film-details__age">${ageLimit}</p>
        </div>
        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${filmName}</h3>
              <p class="film-details__title-original">${originalName}</p>
            </div>
            <div class="film-details__rating">
              <p class="film-details__total-rating">${rating}</p>
            </div>
          </div>
          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writers.join(`, `)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors.join(`, `)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${dayjs(date).format(`DD MMMM YYYY`)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${duration}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term genres">${insertGenreTitle}</td>
              <td class="film-details__cell">
              ${genres}
            </tr>
          </table>
          <p class="film-details__film-description">
            ${shortenDescription}
          </p>
        </div>
      </div>
      <section class="film-details__controls">
        <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${isInWatchlist ? ` checked` : ``}>
        <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>
        <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${isInHistory ? ` checked` : ``}>
        <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>
        <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${isFavourite ? ` checked` : ``}>
        <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
      </section>
    </div>
    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
        <ul class="film-details__comments-list"></ul>
        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">
            ${smileImg}
          </div>
          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${commentValue}</textarea>
          </label>
          <div class="film-details__emoji-list"> ${emojiRadio}</div>
        </div>
      </section>
    </div>
  </form>
</section>`;
};

export default class PopupFilm extends SmartView {
  constructor(film, cardUpdateHandler, renderCommentsCb) {
    super();
    this._filmCard = this._parseFilmToData(film);
    this._cardUpdateHandler = cardUpdateHandler;
    this._renderComments = renderCommentsCb;
    this._closeClickHandler = this._closeClickHandler.bind(this);

    this._onCommentChange = this._onCommentChange.bind(this);
    this._onEmojiInputClick = this._onEmojiInputClick.bind(this);

    this._onWatchListClick = this._onWatchListClick.bind(this);
    this._onHistoryClick = this._onHistoryClick.bind(this);
    this._onFavoriteClick = this._onFavoriteClick.bind(this);

    this._setHandlers();
  }

  getTemplate() {
    return createPopupTemplate(this._filmCard);
  }

  changeComment(sentComments) {
    this._getScroll();
    this.updateData({comments: sentComments});
  }

  _parseFilmToData(filmCard) {
    return Object.assign(
        {},
        filmCard,
        {
          userComment: ``,
          chosenSmile: ``,
          scroll: null
        }
    );
  }

  _parseDataToFilm(filmCard) {
    filmCard = Object.assign({}, filmCard);
    delete filmCard.userComment;
    delete filmCard.chosenSmile;
    delete filmCard.scroll;
    return filmCard;
  }

  _setHandlers() {
    this.getElement().querySelector(`.film-details__comment-input`).addEventListener(`input`, this._onCommentChange);
    this.getElement().querySelector(`.film-details__emoji-list`).addEventListener(`click`, this._onEmojiInputClick);
    this.getElement().querySelector(`#watchlist`).addEventListener(`click`, this._onWatchListClick);
    this.getElement().querySelector(`#watched`).addEventListener(`click`, this._onHistoryClick);
    this.getElement().querySelector(`#favorite`).addEventListener(`click`, this._onFavoriteClick);
  }

  _closeClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeClick();
  }

  setCloseClickHandler(callback) {
    this._callback.closeClick = callback;
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, this._closeClickHandler);
  }

  _onCommentChange(evt) {
    evt.preventDefault();
    this.updateData({userComment: evt.target.value}, true);
  }

  _onEmojiInputClick(evt) {
    if (evt.target.tagName !== `INPUT` || evt.target.value === this._filmCard.chosenSmile) {
      return;
    }
    this._getScroll();
    this.updateData({chosenSmile: evt.target.value});
    this._renderComments();
    this.scrollToY();
  }

  _onFavoriteClick() {
    this._cardUpdateHandler(CATEGORIES.FAVOURITES);
    this._filmCard.isInFavourites = !this._filmCard.isInFavourites;
  }

  _onHistoryClick() {
    this._cardUpdateHandler(CATEGORIES.HISTORY);
    this._filmCard.isInHistory = !this._filmCard.isInHistory;
  }

  _onWatchListClick() {

    this._cardUpdateHandler(CATEGORIES.WATCHLIST);
    this._filmCard.isInWatchlist = !this._filmCard.isInWatchlist;
  }

  _restoreHandlers() {
    this._setHandlers();
    this.setCloseClickHandler(this._callback.closeClick);
  }

  scrollToY() {
    this.getElement().scroll(0, this._scroll);
  }

  _getScroll() {
    this._scroll = this.getElement().scrollTop;
  }

  getNewCommentData() {
    if (!this._filmCard.chosenSmile || !this._filmCard.userComment) {
      return null;
    }
    const emotion = this._filmCard.chosenSmile;
    const text = this._filmCard.userComment;
    return {
      text,
      emotion
    };
  }

  clearInput() {
    this._filmCard.chosenSmile = null;
    this._filmCard.userComment = null;
  }
}
