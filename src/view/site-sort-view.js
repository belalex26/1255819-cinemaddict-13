import {SortType} from '../const';
import AbstractView from './abstract-view';

const createSiteSort = (sortType) => {
  const getActiveClass = (elementSortType) => {
    return (elementSortType === sortType) ? ` sort__button--active` : ``;
  };
  return `<ul class="sort">
  <li><a href="#" class="sort__button${getActiveClass(SortType.DEFAULT)}" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
  <li><a href="#" class="sort__button${getActiveClass(SortType.DATE)}" data-sort-type="${SortType.DATE}">Sort by date</a></li>
  <li><a href="#" class="sort__button${getActiveClass(SortType.RATING)}" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
</ul>`;
};

export default class SiteSortView extends AbstractView {
  constructor(sortType) {
    super();
    this.sortType = sortType;
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
  }
  getTemplate() {
    return createSiteSort(this.sortType);
  }

  _onSortTypeChange(evt) {
    if (evt.target.tagName !== `A`) {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener(`click`, this._onSortTypeChange);
  }
}
