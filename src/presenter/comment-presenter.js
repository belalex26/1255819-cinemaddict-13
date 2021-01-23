import {render, remove, UserAction} from '../utils.js';
import CommentView from '../view/comment-view';

export default class Comment {
  constructor(commentsChange, comment) {
    this._comment = comment;
    this._commentsChange = commentsChange;

    this._deleteComment = this._deleteComment.bind(this);
  }

  init(container) {

    this._commentView = new CommentView(this._comment);

    this._commentView.setDeleteButtonClickHandler(this._deleteComment);


    render(container, this._commentView);
  }

  destroy() {
    remove(this._commentView);
  }

  _deleteComment() {
    this._commentsChange(UserAction.DELETE_COMMENT, this._comment);
  }
}
