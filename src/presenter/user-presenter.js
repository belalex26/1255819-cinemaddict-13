import {render, remove, replace} from '../utils';
import {ModelMethod} from '../const';

import UserIconView from '../view/user-icon';

export default class UserPresenter {
  constructor(userModel) {
    this._userModel = userModel;

    this._onUserRaitingChange = this._onUserRaitingChange.bind(this);

    this._userModel.addObserver(ModelMethod.UPDATE_USER_RAITING, this._onUserRaitingChange);
  }

  init(container) {
    const prevUserView = this._userView;

    this._userView = new UserIconView(this._userModel.getRaiting());

    if (!prevUserView) {
      render(container, this._userView);
      return;
    }

    replace(this._userView, prevUserView);
    remove(prevUserView);
  }

  _onUserRaitingChange() {
    this.init();
  }

  _getWatchedFilmsNumber(films) {
    return films.reduce((acc, currentFilm) => acc + currentFilm.isInHistory, 0);
  }
}
