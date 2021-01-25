import {render, remove, replace} from '../utils';
import {ModelMethod} from '../const';

import FilmsNumberView from '../view/films-number';

export default class FilmsCounter {
  constructor(filmsModel) {
    this._filmsModel = filmsModel;

    this._onFilmsGet = this._onFilmsGet.bind(this);

    this._filmsModel.addObserver(ModelMethod.SET_FILMS, this._onFilmsGet);
  }

  init(container) {
    const prevCounterView = this._counterView;

    this._filmNumber = this._filmsModel.getFilms().length;
    this._counterView = new FilmsNumberView(this._filmNumber);

    if (!prevCounterView) {
      render(container, this._counterView);
      return;
    }

    replace(this._counterView, prevCounterView);
    remove(prevCounterView);
  }

  _onFilmsGet() {
    this.init();
  }
}
