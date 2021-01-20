import dayjs from "dayjs";
import SmartView from './smart-view';
import {categories} from '../utils';

const emotions = [
  `smile`,
  `sleeping`,
  `puke`,
  `angry`
];

const emotionsImg = {
  smile: `./images/emoji/smile.png`,
  sleeping: `./images/emoji/sleeping.png`,
  puke: `./images/emoji/puke.png`,
  angry: `./images/emoji/angry.png`
};

const maxLengthDescription = 140;
const genreOneTitle = document.getElementsByClassName(`genres`);


const createPopupTemplate = (filmCard) => {
  const {filmName, originalName, rating, date, duration, genre, poster, description, comments, director, writers, actors, country, ageLimit, watchList,
    watched, favorite, userComment, chosenSmile} = filmCard;

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

  const filmComments = comments.map((value, index) => {
    const {text, author, commentDate, emotion} = comments[index];

    return `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
    </span>
    <div>
  <p class="film-details__comment-text">${text}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${dayjs(commentDate).format(`YYYY/MM/DD HH:mm`)}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`;
  }).join(``);


  const emojiRadio = emotions.map((value, index) => {
    const emotion = emotions[index];
    return `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emotion}" value="${emotion}" ${(emotion === chosenSmile) ? ` checked` : ``}>
    <label class="film-details__emoji-label" for="emoji-${emotion}">
      <img src="./images/emoji/${emotion}.png" width="30" height="30" alt="emoji">
    </label>`;
  }).join(``);

  const smileImg = chosenSmile ? `<img src="${emotionsImg[chosenSmile]}" width="55" height="55" alt="emoji-${chosenSmile}">` : ``;
  const commentValue = userComment || `Select reaction below and write comment here`;

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
        <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${watchList ? ` checked` : ``}>
        <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>
        <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${watched ? ` checked` : ``}>
        <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>
        <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${favorite ? ` checked` : ``}>
        <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
      </section>
    </div>
    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
        <ul class="film-details__comments-list">${filmComments}</ul>
        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">
            ${smileImg}
          </div>
          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="${commentValue}" name="comment"></textarea>
          </label>
          <div class="film-details__emoji-list"> ${emojiRadio}</div>
        </div>
      </section>
    </div>
  </form>
</section>`;
};

export default class PopupFilm extends SmartView {
  constructor(film, cardUpdateHandler) {
    super();
    this._filmCard = this._parseFilmToData(film);
    this._cardUpdateHandler = cardUpdateHandler;
    this._closeClickHandler = this._closeClickHandler.bind(this);

    this._commentChangeHandler = this._commentChangeHandler.bind(this);
    this._emojiInputClickHandler = this._emojiInputClickHandler.bind(this);

    this._watchedListClickHandler = this._watchedListClickHandler.bind(this);
    this._watchListClickHandler = this._watchListClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);

    this._setHandlers();
  }

  getTemplate() {
    return createPopupTemplate(this._filmCard);
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
    this.getElement().querySelector(`.film-details__comment-input`).addEventListener(`input`, this._commentChangeHandler);
    this.getElement().querySelector(`.film-details__emoji-list`).addEventListener(`click`, this._emojiInputClickHandler);
    this.getElement().querySelector(`#watchlist`).addEventListener(`click`, this._onWatchListClick);
    this.getElement().querySelector(`#watched`).addEventListener(`click`, this._onWatchedListClick);
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

  _commentChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({userComment: evt.target.value}, true);
  }

  _emojiInputClickHandler(evt) {
    if (evt.target.tagName !== `INPUT`) {
      return;
    }
    this._getScroll();
    this.updateData({chosenSmile: evt.target.value});
    this._scrollToY();
  }

  _favoriteClickHandler() {
    this._cardUpdateHandler(categories.FAVORITE);
    this._filmCard.favorite = !this._filmCard.favorite;
  }

  _watchListClickHandler() {
    this._cardUpdateHandler(categories.WATCHLIST);
    this._filmCard.watchList = !this._filmCard.watchList;
  }

  _watchedListClickHandler() {
    this._cardUpdateHandler(categories.WATCHEDLIST);
    this._filmCard.watchedList = !this._filmCard.watchedList;
  }

  _restoreHandlers() {
    this._setHandlers();
    this.setCloseClickHandler(this._callback.closeClick);
  }

  _scrollToY() {
    this.getElement().scroll(0, this._scroll);
  }

  _getScroll() {
    this._scroll = this.getElement().scrollTop;
  }
}
