import AbstractView from './abstract-view';

const createShowMoreButton = () => {
  return `<button class="films-list__show-more">Show more</button>`;
};

export default class ShowMoreButtonView extends AbstractView {
  constructor() {
    super();
    this._onShowMoreButtonClick = this._onShowMoreButtonClick.bind(this);
  }
  getTemplate() {
    return createShowMoreButton();
  }

  _onShowMoreButtonClick(evt) {
    evt.preventDefault();
    this._callback.click(evt);
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().addEventListener(`click`, this._onShowMoreButtonClick);
  }
}
