import {render, remove, filter} from '../utils';
import {SortType, UserAction, ModelMethod, FilmCardContainer} from '../const';

import SiteSortView from '../view/site-sort';
import SiteCatalogView from '../view/catalog-films';
import NoFilmsView from '../view/no-films';
import LoadingView from '../view/loading';
import ShowMoreButtonView from '../view/show-more-button';
import TopRatingContainerView from '../view/top-rating';
import MostCommentedContainerView from '../view/most-commented-container';

import MoviePresenter from './movie';

const FILMS_CARDS_COUNT = 5;
const FILMS_TOP_RATED_CARDS_NUMBER = 2;
const FILMS_MOST_COMMENTED_CARDS_NUMBER = 2;

export default class MovieList {
  constructor(filmsModel, filterModel, commentsModel) {
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._commentsModel = commentsModel;

    this._showMoreButton = new ShowMoreButtonView();
    this._topRaitedView = new TopRatingContainerView();
    this._mostCommentedView = new MostCommentedContainerView();
    this._loadingView = new LoadingView();

    this._renderedFilms = FILMS_CARDS_COUNT;
    this._currentSortType = SortType.DEFAULT;
    this._isLoading = true;

    this._onShowMoreButtonClick = this._onShowMoreButtonClick.bind(this);
    this._closeAllPopups = this._closeAllPopups.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewAction = this._onViewAction.bind(this);
    this._onfilmUpdate = this._onfilmUpdate.bind(this);
    this._onFilterUpdate = this._onFilterUpdate.bind(this);
    this._onFilmsLoad = this._onFilmsLoad.bind(this);
    this.updateMostCommentedBlock = this.updateMostCommentedBlock.bind(this);

    this._moviePresenterGroups = {
      catalog: {},
      rated: {},
      commented: {}
    };
  }

  init(container) {

    this._presenterBlockNames = Object.keys(this._moviePresenterGroups);
    this._siteMain = container;

    this._filmsModel.addObserver(ModelMethod.UPDATE_FILM, this._onfilmUpdate);
    this._filmsModel.addObserver(ModelMethod.SET_FILMS, this._onFilmsLoad);
    this._filterModel.addObserver(ModelMethod.UPDATE_FILTER, this._onFilterUpdate);

    this._renderCatalog();
  }

  destroy() {
    this._clearCatalog({resetRenderedFilms: true, resetSort: true});

    this._filmsModel.removeObserver(ModelMethod.UPDATE_FILM, this._onfilmUpdate);
    this._filmsModel.removeObserver(ModelMethod.SET_FILMS, this._onFilmsLoad);
    this._filterModel.removeObserver(ModelMethod.UPDATE_FILTER, this._onFilterUpdate);

    remove(this._topRaitedView);
    remove(this._mostCommentedView);
    remove(this._siteCatalog);
  }

  _clearCatalog({resetRenderedFilms = false, resetSort = false} = {}) {
    this._presenterBlockNames.forEach((presenterGroup) => {
      Object.values(this._moviePresenterGroups[presenterGroup]).forEach((presenter) => presenter.destroy());
      this._moviePresenterGroups[presenterGroup] = {};
    });

    remove(this._siteSortView);
    remove(this._noFilmsView);
    remove(this._showMoreButton);
    remove(this._loadingView);
    remove(this._topRaitedView);
    remove(this._mostCommentedView);

    this._renderedFilms = resetRenderedFilms ? this._renderedFilms = FILMS_CARDS_COUNT : Math.min(this._renderedFilms, this._getFilms().length);

    if (resetSort) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _getFilms(sortType) {
    const chosenFilter = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
    const filteredFilms = filter[chosenFilter](films);

    const chosenSortType = sortType || this._filmsModel;
    switch (chosenSortType) {
      case SortType.DATE:
        return filteredFilms.sort((previous, current) => current.date - previous.date);
      case SortType.RATING:
        return filteredFilms.sort((previous, current) => current.rating - previous.rating);
      case SortType.COMMENTS:
        return filteredFilms.sort((previous, current) => current.comments.length - previous.comments.length);
      default:
        return filteredFilms;
    }
  }

  updateMostCommentedBlock(filmId) {
    if (!this._getFilms(SortType.COMMENTS).slice(0, FILMS_MOST_COMMENTED_CARDS_NUMBER).some((film) => film.id === filmId)) {
      return;
    }
    remove(this._mostCommentedContainerView);
    this._renderMostCommentedFilms();
  }

  _updatePresenters(film) {
    this._presenterBlockNames.forEach((presenterGroup) => {
      const filmPresenter = this._moviePresenterGroups[presenterGroup][film.id];
      if (filmPresenter) {
        filmPresenter.init(film);
      }
    });
  }

  _closeAllPopups() {
    this._presenterBlockNames.forEach((presenterGroup) => {
      Object.values(this._moviePresenterGroups[presenterGroup]).forEach((presenter) => presenter.closePopup());
    });
  }

  _onViewAction(eventType, update) {
    switch (eventType) {
      case UserAction.UPDATE_FILM_CATEGORY:
        this._filmsModel.updateFilm({filmToUpdate: update});
        break;
      case UserAction.REPLACE_FILM:
        this._filmsModel.replaceFilm({filmToUpdate: update});
        break;
      case UserAction.UPDATE_FILM_CATEGORY_WITH_RERENDER:
        this._filmsModel.updateFilm({filmToUpdate: update, isNotificationNeeded: false})
        .then(() => {
          this._clearCatalog();
          this._renderCatalog();
        });
        break;
    }
  }

  _onFilmsLoad() {
    this._isLoading = false;
    remove(this._loadingView);
    this._renderCatalog();
  }

  _onfilmUpdate(updatedFilm) {
    this._updatePresenters(updatedFilm);
  }

  _onFilterUpdate() {
    this._clearCatalog({resetRenderedFilms: true, resetSort: true});
    this._renderCatalog();
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
    this._currentSortType = type;
    this._clearCatalog({resetRenderedFilms: true});
    this._renderCatalog();
  }

  _onShowMoreButtonClick() {
    this._getFilms().slice(this._renderedFilms, this._renderedFilms + FILMS_CARDS_COUNT).forEach((film) => this._renderCard(this._filmsListContainer, film));

    this._renderedFilms += FILMS_CARDS_COUNT;

    if (this._renderedFilms >= this._getFilms().length) {
      remove(this._showMoreButton);
    }
  }

  _renderNoFilms() {
    this._noFilmsView = new NoFilmsView();
    render(this._siteMain, this._noFilmsView);
  }

  _renderLoading() {
    render(this._siteMain, this._loadingView);
  }

  _renderSort() {
    if (this._siteSortView !== null) {
      this._siteSortView = null;
    }
    this._siteSortView = new SiteSortView(this._currentSortType);
    render(this._siteMain, this._siteSortView);
    this._siteSortView.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  _renderCard(container, film, block) {
    const filmPresenter = new MoviePresenter(this._commentsModel, this._onViewAction, this._closeAllPopups, this._filterModel, this.updateMostCommentedBlock);
    filmPresenter.init(film, container);
    switch (block) {
      case FilmCardContainer.RATED:
        this._moviePresenterGroups.rated[film.id] = filmPresenter;
        break;
      case FilmCardContainer.COMMENTED:
        this._moviePresenterGroups.commented[film.id] = filmPresenter;
        break;
      default:
        this._moviePresenterGroups.catalog[film.id] = filmPresenter;
    }
  }

  _renderFilmCards() {
    const films = this._getFilms();
    films.slice(0, this._renderedFilms).forEach((film) => this._renderCard(this._filmsListContainer, film));
  }

  _renderShowMoreButton() {
    if (this._getFilms().length > Math.max(FILMS_CARDS_COUNT, this._FILMS_CARDS_NUMBER)) {

      render(this._siteCatalog.getElement().querySelector(`.films-list`), this._showMoreButton);

      this._showMoreButton.setClickHandler(this._onShowMoreButtonClick);
    }
  }

  _renderTopRaitedFilms() {
    if (!this._getFilms(SortType.RATING)[0].rating) {
      return;
    }
    render(this._siteCatalog, this._topRaitedView);
    this._getFilms(SortType.RATING).slice(0, FILMS_TOP_RATED_CARDS_NUMBER).forEach((film) => this._renderCard(topRaitedFilmsContainer, film, `rated`));
    const topRaitedFilmsContainer = this._siteCatalog.getElement().querySelector(`.films-list--extra .films-list__container`);
  }

  _renderMostCommentedFilms() {
    if (!this._getFilms(SortType.COMMENTS)[0].comments.length) {
      return;
    }
    render(this._siteCatalog, this._mostCommentedView);
    const mostCommentedFilmsContainer = this._siteCatalog.getElement().querySelector(`.films-list--commented .films-list__container`);
    this._getFilms(SortType.COMMENTS).slice(0, FILMS_MOST_COMMENTED_CARDS_NUMBER).forEach((film) => this._renderCard(mostCommentedFilmsContainer, film, `commented`));
  }

  _renderCatalog() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    if (!(this._siteCatalog)) {
      this._siteCatalog = new SiteCatalogView();
    }

    if (!this._getFilms().length) {
      this._renderNoFilms();
      return;
    }

    this._renderSort();
    render(this._siteMain, this._siteCatalog);

    this._filmsListContainer = this._siteCatalog.getElement().querySelector(`.films-list__container`);

    this._renderFilmCards();
    this._renderShowMoreButton();
    this._renderTopRaitedFilms();
    this._renderMostCommentedFilms();
  }
}
