import {render, remove} from '../utils';
import {UserAction} from '../const';

import CommentView from '../view/comment';

const DeleteButtonText = {
  COMMON: `Delete`,
  DISABLED: `Deleting...`
};

const SHAKE_DURATION = 500;

export default class Comment {
  constructor(commentsChange, comment) {
    this._comment = comment;
    this._isCommentDisabled = false;
    this._commentsChange = commentsChange;

    this._deleteComment = this._deleteComment.bind(this);
    this.onUserCommentError = this.onUserCommentError.bind(this);
  }

  init(container) {
    this._commentView = new CommentView(this._comment);
    this._commentView.setDeleteButtonClickHandler(this._deleteComment);
    render(container, this._commentView);
  }

  destroy() {
    remove(this._commentView);
  }

  onUserCommentError() {
    const comment = this._commentView.getElement();
    comment.style.animation = `shake ${SHAKE_DURATION / 1000}s`;
    setTimeout(() => {
      comment.style.animation = ``;
    }, SHAKE_DURATION);
  }

  _deleteComment() {
    this._commentsChange(UserAction.DELETE_COMMENT, this._comment);
  }

  changeDeleteButtonState() {
    const deleteButton = this._commentView.getElement().querySelector(`.film-details__comment-delete`);
    deleteButton.textContent = this._isCommentDisabled ? DeleteButtonText.COMMON : DeleteButtonText.DISABLED;
    deleteButton.disabled = !this._isCommentDisabled;
    this._isCommentDisabled = !this._isCommentDisabled;
  }
}
