import AbstractView from './abstract-view';
import {SortType} from "../utils";

const createSort = (sortType) => {

  const getActiveClass = (elementSortType) => {
    return (elementSortType === sortType) ? ` sort__button--active` : ``;
  };

  return `<ul class="sort">
  <li><a href="#" class="sort__button${getActiveClass(SortType.DEFAULT)}" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
  <li><a href="#" class="sort__button${getActiveClass(SortType.DATE)}" data-sort="${SortType.DATE}">Sort by date</a></li>
  <li><a href="#" class="sort__button${getActiveClass(SortType.RATING)}" data-sort="${SortType.RATING}">Sort by rating</a></li>
</ul>`;
};

export default class SiteSort extends AbstractView {
  constructor(sortType) {
    super();
    this._sortType = sortType;
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
  }

  getTemplate() {
    return createSort(this._sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChangeHandler = callback;
    this.getElement().addEventListener(`click`, this._sortTypeChangeHandler);
  }

  _onSortTypeChange(evt) {
    if (evt.target.tagName !== `A`) {
      return;
    }
    evt.preventDefault();
    this._callback.sortTypeChangeHandler(evt.target.dataset.sortType);
  }
}
