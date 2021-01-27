import {render, remove, replace} from '../utils';
import {ModelMethod} from '../const';

import UserIconView from '../view/user-icon';

export default class UserPresenter {
  constructor(userModel) {
    this._userModel = userModel;

    this._onUserRatingChange = this._onUserRatingChange.bind(this);

    this._userModel.addObserver(ModelMethod.UPDATE_USER_RATING, this._onUserRatingChange);
  }

  init(container = this._container) {
    this._container = container;
    const prevUserView = this._userView;

    this._userView = new UserIconView(this._userModel.getRating());

    if (!prevUserView) {
      render(this._container, this._userView);
      return;
    }

    replace(this._userView, prevUserView);
    remove(prevUserView);
  }

  _getWatchedFilmsNumber(films) {
    return films.reduce((acc, currentFilm) => acc + currentFilm.isInHistory, 0);
  }

  _onUserRatingChange() {
    this.init();
  }
}
