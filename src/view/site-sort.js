import AbstractView from './abstract-view';
import {sortType} from "../utils";

const createSort = () => {
  return `<ul class="sort">
  <li><a href="#" class="sort__button sort__button--active" data-sort-type="${sortType.DEFAULT}">Sort by default</a></li>
  <li><a href="#" class="sort__button" data-sort="${sortType.DATE}">Sort by date</a></li>
  <li><a href="#" class="sort__button" data-sort="${sortType.RATING}">Sort by rating</a></li>
</ul>`;
};

export default class SiteSort extends AbstractView {
  constructor() {
    super();
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSort();
  }

  _removeActiveClass() {
    const sortButton = this.getElement().querySelectorAll(`.sort__button`);
    sortButton.forEach((button) => {
      button.classList.remove(`sort__button--active`);
    });
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChangeHandler = callback;
    this.getElement().addEventListener(`click`, this._sortTypeChangeHandler);
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== `A`) {
      return;
    }
    evt.preventDefault();
    this._removeActiveClass();
    this._callback.sortTypeChangeHandler(evt.target.dataset.sortType);
  }
}
