import {render, remove, isKeyPressed, generateId, CATEGORIES, UserAction, ModelMethod} from '../utils.js';
import FilmPopupView from '../view/popup-film';
import FilmCardView from '../view/film-card';

import CommentPresenter from './comment-presenter';

const pageBody = document.querySelector(`body`);

export default class Movie {
  constructor(commentsModel, changeData) {
    this._changeData = changeData;

    this._commentsModel = commentsModel;
    this._commentPresenters = {};

    this._onOpenPopup = this._onOpenPopup.bind(this);
    this._onClosePopup = this._onClosePopup.bind(this);
    this._onPopupEscPress = this._onPopupEscPress.bind(this);
    this._card = null;
    this._popup = null;

    this._onFavoriteClick = this._onFavoriteClick.bind(this);
    this._onWatchClick = this._onWatchClick.bind(this);
    this._onHistoryClick = this._onHistoryClick.bind(this);
    this.cardUpdateHandler = this.cardUpdateHandler.bind(this);

    this.onCommentDelete = this.onCommentDelete.bind(this);
    this.onViewAction = this.onViewAction.bind(this);
    this._onCommentAdd = this._onCommentAdd.bind(this);
    this._renderCommentsToPopup = this._renderCommentsToPopup.bind(this);
    this.addComment = this.addComment.bind(this);

    this._commentsModel.addObserver(ModelMethod.DELETE_COMMENT, this.onCommentDelete);
    this._commentsModel.addObserver(ModelMethod.ADD_COMMENT, this.addComment);
  }

  init(filmCard, container) {
    this._filmCard = filmCard;
    const prevFilmCard = this._card;

    this._card = new FilmCardView(this._filmCard);

    this._card.setClickPopupHandler(this._onOpenPopup);

    this._card.setWatchedListClickHandler(this._onWatchClick);
    this._card.setWatchListClickHandler(this._onHistoryClick);
    this._card.setFavoriteClickHandler(this._onFavoriteClick);

    if (prevFilmCard === null) {
      render(container, this._card);
      return;
    }
    // remove(prevFilmCard);
  }

  destroy() {
    remove(this._card);
  }

  onViewAction(eventType, update) {
    switch (eventType) {
      case UserAction.DELETE_COMMENT:
        this._commentsModel.deleteComment(update);
        break;
      case UserAction.ADD_COMMENT:
        this._commentsModel.addComment(update);
        break;
    }
  }

  onCommentDelete(deletedComment) {
    if (this._commentPresenters[deletedComment.id]) {
      this._commentPresenters[deletedComment.id].destroy();
      delete this._commentPresenters[deletedComment.id];

      this._popup.changeComment(Object.keys(this._commentPresenters));
      Object.values(this._commentPresenters).forEach((commentPresenter) => commentPresenter.init(this._popup.getElement().querySelector(`.film-details__comments-list`)));

      this._popup.scrollToY();

      this._changeData(UserAction.UPDATE_FILM_CATEGORY, Object.assign(
          {},
          this._filmCard,
          {
            comments: Object.keys(this._commentPresenters)
          }
      ));
    }
  }

  _onCommentAdd(evt) {
    if (evt.keyCode === 13 && evt.ctrlKey) {
      if (this._popup.getNewCommentData() === null) {
        return;
      }
      const comment = Object.assign({},
          this._popup.getNewCommentData(),
          {
            id: generateId(),
            date: new Date(),
            author: `local user`
          });
      this._popup.clearInput();
      this.onViewAction(UserAction.ADD_COMMENT, comment);
    }
  }

  addComment(comment) {
    if (this._popup) {

      const commentPresenter = new CommentPresenter(this.onViewAction, comment);
      this._commentPresenters[comment.id] = commentPresenter;

      this._popup.changeComment(Object.keys(this._commentPresenters));

      this._renderCommentsToPopup();
      commentPresenter.init(this._popup.getElement().querySelector(`.film-details__comments-list`));

      this._popup.scrollToY();


      this._changeData(UserAction.UPDATE_FILM_CATEGORY, Object.assign(
          {},
          this._filmCard,
          {
            comments: Object.keys(this._commentPresenters)
          }
      ));

    }
  }

  _renderCommentsToPopup() {
    const comments = this._commentsModel.getComments();

    this._filmCard.comments.forEach((commentId) => {
      const comment = comments.find((recievedComment) => (String(recievedComment.id) === String(commentId)));

      const commentPresenter = new CommentPresenter(this.onViewAction, comment);
      commentPresenter.init(this._popup.getElement().querySelector(`.film-details__comments-list`));
      this._commentPresenters[comment.id] = commentPresenter;
    });
  }

  _onOpenPopup() {
    this._popup = new FilmPopupView(this._filmCard, this.cardUpdateHandler, this._renderCommentsToPopup);

    this._renderCommentsToPopup();

    pageBody.classList.add(`hide-overflow`);
    pageBody.appendChild(this._popup.getElement());
    this._popup.setCloseClickHandler(this._onClosePopup);

    this._card.setWatchedListClickHandler(this._onWatchClick);
    this._card.setWatchListClickHandler(this._onHistoryClick);
    this._card.setFavoriteClickHandler(this._onFavoriteClick);

    document.addEventListener(`keydown`, this._onPopupEscPress);
    document.addEventListener(`keydown`, this._onCommentAdd);
  }

  _onClosePopup() {
    if (this._popup) {
      pageBody.classList.remove(`hide-overflow`);
      pageBody.removeChild(this._popup.getElement());
      document.removeEventListener(`keydown`, this._onCommentAdd);
      document.removeEventListener(`keydown`, this._onPopupEscPress);
      this._card.setClickPopupHandler(this._onOpenPopup);
      this._popup = null;

      Object.values(this._commentPresenters).forEach((presenter) => {
        presenter.destroy();
      });

      this._commentPresenters = {};
    }
  }

  cardUpdateHandler(category) {
    switch (category) {
      case CATEGORIES.WATCHLIST:
        this._onWatchClick();
        break;
      case CATEGORIES.HISTORY:
        this._onHistoryClick();
        break;
      case CATEGORIES.FAVOURITES:
        this._onFavoriteClick();
        break;
    }
  }

  _onPopupEscPress(evt) {
    isKeyPressed(evt, this._onClosePopup, `Escape`);
  }

  closePopup() {
    this._onClosePopup();
  }

  _onWatchClick() {
    this._changeData(UserAction.UPDATE_FILM_CATEGORY,
        Object.assign(
            {},
            this._filmCard,
            {
              isInWatchlist: !this._filmCard.isInWatchlist
            }
        )
    );
  }

  _onHistoryClick() {
    this._changeData(UserAction.UPDATE_FILM_CATEGORY,
        Object.assign(
            {},
            this._filmCard,
            {
              isInHistory: !this._filmCard.isInHistory
            }
        )
    );
  }

  _onFavoriteClick() {
    this._changeData(UserAction.UPDATE_FILM_CATEGORY,
        Object.assign(
            {},
            this._filmCard,
            {
              isFavourite: !this._filmCard.isFavourite
            }
        )
    );
  }
}
