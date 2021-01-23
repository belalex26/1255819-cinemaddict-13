import {render, remove, filter, SortType, UserAction, ModelMethod} from '../utils';

import SiteSortView from '../view/site-sort';
import SiteMenuView from '../view/site-menu';
import SiteCatalogView from '../view/catalog-films';
import NoFilmsView from '../view/no-films';
import ShowMoreButtonView from '../view/show-more-button';
import TopRatingContainerView from '../view/top-rating';
import MostCommentedContainerView from '../view/most-commented-container';
import MoviePresenter from './movie';

const FILMS_CARDS_COUNT = 5;
const FILMS_TOP_RATED_CARDS_NUMBER = 2;
const FILMS_MOST_COMMENTED_CARDS_NUMBER = 2;

export default class MovieList {
  constructor(filmsmodel, filterModel, commentsModel) {

    this._filmsModel = filmsmodel;
    this._filterModel = filterModel;
    this._commentsModel = commentsModel;

    this._userIconView = null;
    this._siteSortView = null;
    this._noFilmsView = null;
    this._siteSortView = null;

    this._siteMain = document.querySelector(`.main`);
    this._renderedFilms = FILMS_CARDS_COUNT;
    this._siteCatalog = new SiteCatalogView();
    this._siteSort = new SiteSortView();
    this._showMoreButton = new ShowMoreButtonView();
    this._topRatedFilmsContainer = new TopRatingContainerView();
    this._mostCommentedFilmsContainer = new MostCommentedContainerView();

    // this._handleFilmChange = this._handleFilmChange.bind(this);
    this._setDefaultView = this._setDefaultView.bind(this);
    // this._handleSortChange = this._handleSortChange.bind(this);
    this._currentSortType = SortType.DEFAULT;
    this._renderedFilmCount = null;

    this._onShowMoreButtonClick = this._onShowMoreButtonClick.bind(this);
    this._onViewAction = this._onViewAction.bind(this);

    this._onfilmUpdate = this._onfilmUpdate.bind(this);
    this._onFilterUpdate = this._onFilterUpdate.bind(this);

    this._filmsModel.addObserver(ModelMethod.UPDATE_FILM, this._onfilmUpdate);
    this._filterModel.addObserver(ModelMethod.UPDATE_FILTER, this._onFilterUpdate);

    this._moviePresenterGroup = {
      catalog: {},
      raited: {},
      commented: {}
    };
  }

  init(container) {
    this._presenterBlocks = Object.keys(this._moviePresenterGroup);
    this._siteMenuView = new SiteMenuView(this._getFilms());
    this._siteMain = container;
    this._renderCatalog();

  }

  _getFilms(sortType) {
    const chosenFilter = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
    const filteredFilms = filter[chosenFilter](films);

    const chosenSortType = sortType || this._currentSortType;
    switch (chosenSortType) {
      case SortType.DATE:
        return filteredFilms.sort((previous, current) => {
          return current.date - previous.date;
        });
      case SortType.RATING:
        return filteredFilms.sort((previous, current) => {
          return current.raiting - previous.raiting;
        });
      case SortType.COMMENTS:
        return filteredFilms.sort((previous, current) => {
          return current.comments.length - previous.comments.length;
        });
      default:
        return filteredFilms;
    }
  }

  _setDefaultView() {
    Object.values(this._moviePresenterGroup).forEach((presenter) => {
      presenter.closePopup();
    });
  }

  _renderNoFims() {
    this._noFilmsView = new NoFilmsView();
    render(this._siteMain, this._noFilmsView);
  }

  _renderCard(container, film, block) {
    const filmPresenter = new MoviePresenter(this._commentsModel, this._onViewAction, this._setDefaultView);
    filmPresenter.init(film, container);
    switch (block) {
      case `raiting`:
        this._moviePresenterGroup.raited[film.id] = filmPresenter;
        break;
      case `commented`:
        this._moviePresenterGroup.commented[film.id] = filmPresenter;
        break;
      default:
        this._moviePresenterGroup.catalog[film.id] = filmPresenter;
    }
  }

  _renderSort() {
    if (this._siteSortView !== null) {
      this._siteSortView = null;
    }
    this._siteSortView = new SiteSortView(this._currentSortType);
    render(this._siteMain, this._siteSortView);
    this._siteSortView.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  _renderFilmCards() {
    const films = this._getFilms();
    films.slice(0, this._renderedFilms).forEach((film) => this._renderCard(this._filmsListContainer, film));
  }

  _onShowMoreButtonClick() {
    this._getFilms().slice(this._renderedFilms, this._renderedFilms + FILMS_CARDS_COUNT).forEach((film) => this._renderCard(this._filmsListContainer, film));
    this._renderedFilms += FILMS_CARDS_COUNT;

    if (this._renderedFilms >= this._getFilms().length) {
      remove(this._showMoreButton);
    }
  }
  _renderShowMoreButton() {
    render(this._siteCatalog.getElement().querySelector(`.films-list`), this._showMoreButton, `afterend`);
    this._showMoreButton.setClickHandler(this._onShowMoreButtonClick);
  }

  _renderTopRaitedContainer() {
    render(this._siteCatalog, this._topRatedFilmsContainer);
  }
  _renderMostCommentedContainer() {
    render(this._siteCatalog, this._mostCommentedFilmsContainer);
  }

  _renderFilmsCardTopRated() {
    const topRaitedFilmsContainer = this._siteCatalog.getElement().querySelector(`.films-list--extra .films-list__container`);
    this._getFilms(SortType.RATING).slice(0, FILMS_TOP_RATED_CARDS_NUMBER).forEach((film) => this._renderCard(topRaitedFilmsContainer, film, `raited`));
  }

  _renderFilmsCardMostCommented() {

    const mostCommentedFilmsContainer = this._siteCatalog.getElement().querySelector(`.films-list--commented .films-list__container`);
    this._getFilms(SortType.COMMENTS).slice(0, FILMS_MOST_COMMENTED_CARDS_NUMBER).forEach((film) => this._renderCard(mostCommentedFilmsContainer, film, `commented`));
  }

  _onViewAction(eventType, update) {
    switch (eventType) {
      case UserAction.UPDATE_FILM_CATEGORY:
        this._filmsModel.updateFilm(update);
        break;
    }
  }

  _onfilmUpdate(updatedFilm) {
    this._updatePresenters(updatedFilm);
  }

  _onFilterUpdate() {
    this._clearCatalog({resetRenderedFilms: true, resetSort: true});
    this._renderCatalog();
  }

  _updatePresenters(film) {
    this._presenterBlocks.forEach((presenterGroup) => {
      if (this._moviePresenterGroup[presenterGroup][film.id]) {
        this._moviePresenterGroup[presenterGroup][film.id].init(film);
      }
    });
  }

  _clearCatalog({resetRenderedFilms = false, resetSort = false} = {}) {
    this._presenterBlocks.forEach((presenterGroup) => {
      Object.values(this._moviePresenterGroup[presenterGroup]).forEach((presenter) => presenter.destroy());
      this._moviePresenterGroup[presenterGroup] = {};
    });

    remove(this._siteSortView);
    remove(this._noFilmsView);
    remove(this._showMoreButton);

    if (resetRenderedFilms) {
      this._renderedFilms = this._FILMS_CARDS_NUMBER;
    } else {
      this._renderedFilms = Math.min(this._renderedFilms, this._getFilms().length);
    }

    if (resetSort) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _onSortTypeChange(type) {
    if (this._currentSortType === type) {
      return;
    }
    if (!this._sortButtons) {
      this._sortButtons = Array.from(this._siteSortView.getElement().querySelectorAll(`.sort__button`));
    }
    this._sortButtons.forEach((sortButton) => {
      if (sortButton.dataset.sortType === type) {
        sortButton.classList.add(`sort__button--active`);
        return;
      }
      sortButton.classList.remove(`sort__button--active`);
    });

    this._clearCatalog({resetRenderedFilms: true});
    this._renderCatalog();
  }

  _renderCatalog() {
    if (!(this._siteCatalog)) {
      this._siteCatalog = new SiteCatalogView();
    }

    if (this._getFilms().length < 1) {
      this._renderNoFilms();
      return;
    }
    this._renderSort();
    render(this._siteMain, this._siteCatalog);
    this._filmsListContainer = this._siteCatalog.getElement().querySelector(`.films-list__container`);
    this._renderFilmCards();
    this._renderShowMoreButton();
    this._renderTopRaitedContainer();
    this._renderMostCommentedContainer();
    this._renderFilmsCardTopRated();
    this._renderFilmsCardMostCommented();
  }
}
