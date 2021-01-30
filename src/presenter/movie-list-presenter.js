import {render, remove, filter} from '../utils';
import {SortType, UserAction, ModelMethod, FilmCardContainer} from '../const';

import SiteSortView from '../view/site-sort-view';
import CatalogFilmsView from '../view/catalog-films-view';
import ShowMoreButtonView from '../view/show-more-button-view';
import TopRatingContainer from '../view/top-rating-container';
import MostCommentContainer from '../view/most-comment-container';
import LoadingView from '../view/loading-view';
import NoFilmsView from '../view/no-films-view';
import MoviePresenter from './movie-presenter';


export default class MovieListPresenter {
  constructor(filmsmodel, filterModel, commentsModel) {
    this._filmsModel = filmsmodel;
    this._filterModel = filterModel;
    this._commentsModel = commentsModel;

    this._siteSortView = null;
    this._noFilmsView = null;
    this._userIconView = null;
    this._siteMenuView = null;
    this._siteCatalog = null;
    this._filmsSortedByDate = null;

    this._showMoreButton = new ShowMoreButtonView();
    this._topRatedContainerView = new TopRatingContainer();
    this._mostCommentedContainerView = new MostCommentContainer();
    this._loadingView = new LoadingView();

    this._filmCardPresenterGroups = {
      catalog: {},
      rated: {},
      commented: {}
    };
    this._currentSortType = SortType.DEFAULT;
    this._isLoading = true;

    this._FILMS_CARDS_NUMBER = 5;
    this._FILMS_STEP_LOAD = 5;
    this._FILMS_TOP_RATED_CARDS_NUMBER = 2;
    this._FILMS_MOST_COMMENTED_CARDS_NUMBER = 2;
    this._renderedFilms = this._FILMS_CARDS_NUMBER;

    this._onShowMoreButtonClick = this._onShowMoreButtonClick.bind(this);
    this._closeAllPopups = this._closeAllPopups.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewAction = this._onViewAction.bind(this);
    this._onfilmUpdate = this._onfilmUpdate.bind(this);
    this._onFilterUpdate = this._onFilterUpdate.bind(this);
    this._onFilmsLoad = this._onFilmsLoad.bind(this);
    this.updateMostCommentedBlock = this.updateMostCommentedBlock.bind(this);
  }

  init(container = this._container) {
    this._container = container;

    this._presenterGroupNames = Object.keys(this._filmCardPresenterGroups);
    this._siteMain = container;
    this._filmsModel.addObserver(ModelMethod.UPDATE_FILM, this._onfilmUpdate);
    this._filmsModel.addObserver(ModelMethod.SET_FILMS, this._onFilmsLoad);
    this._filterModel.addObserver(ModelMethod.UPDATE_FILTER, this._onFilterUpdate);
    this._renderCatalog();
  }

  destroy() {
    this._clearCatalog({resetRenderedFilms: true, resetSort: true});

    remove(this._topRatedContainerView);
    remove(this._mostCommentedContainerView);
    remove(this._siteCatalog);

    this._filmsModel.removeObserver(ModelMethod.UPDATE_FILM, this._onfilmUpdate);
    this._filmsModel.removeObserver(ModelMethod.SET_FILMS, this._onFilmsLoad);
    this._filterModel.removeObserver(ModelMethod.UPDATE_FILTER, this._onFilterUpdate);
  }

  _getFilms(sortType) {
    const chosenFilter = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
    const filteredFilms = filter[chosenFilter](films);

    const chosenSortType = sortType || this._currentSortType;
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

  updateMostCommentedBlock(filmId) {
    if (!this._getFilms(SortType.COMMENTS).slice(0, this._FILMS_MOST_COMMENTED_CARDS_NUMBER).some((film) => film.id === filmId)) {
      return;
    }
    remove(this._mostCommentedContainerView);
    this._renderMostCommentedFilms();
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

  _updatePresenters(film) {
    this._presenterGroupNames.forEach((presenterGroup) => {
      const filmPresenter = this._filmCardPresenterGroups[presenterGroup][film.id];
      if (filmPresenter) {
        filmPresenter.init(film);
      }
    });
  }

  _clearCatalog({resetRenderedFilms = false, resetSort = false} = {}) {
    this._presenterGroupNames.forEach((presenterGroup) => {
      Object.values(this._filmCardPresenterGroups[presenterGroup]).forEach((presenter) => presenter.destroy());
      this._filmCardPresenterGroups[presenterGroup] = {};
    });

    remove(this._siteSortView);
    remove(this._noFilmsView);
    remove(this._showMoreButton);
    remove(this._loadingView);
    remove(this._topRatedContainerView);
    remove(this._mostCommentedContainerView);

    this._renderedFilms = resetRenderedFilms ? this._renderedFilms = this._FILMS_CARDS_NUMBER : Math.min(this._renderedFilms, this._getFilms().length);

    if (resetSort) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _closeAllPopups() {
    this._presenterGroupNames.forEach((presenterGroup) => {
      Object.values(this._filmCardPresenterGroups[presenterGroup]).forEach((presenter) => presenter.closePopup());
    });
  }

  _renderNoFilms() {
    this._noFilmsView = new NoFilmsView();
    render(this._siteMain, this._noFilmsView);
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
        this._filmCardPresenterGroups.rated[film.id] = filmPresenter;
        break;
      case FilmCardContainer.COMMENTED:
        this._filmCardPresenterGroups.commented[film.id] = filmPresenter;
        break;
      default:
        this._filmCardPresenterGroups.catalog[film.id] = filmPresenter;
    }
  }

  _renderFilmCards() {
    const films = this._getFilms();
    films.slice(0, this._renderedFilms).forEach((film) => this._renderCard(this._filmsListContainer, film));
  }

  _onShowMoreButtonClick() {
    this._getFilms().slice(this._renderedFilms, this._renderedFilms + this._FILMS_STEP_LOAD).forEach((film) => this._renderCard(this._filmsListContainer, film));

    this._renderedFilms += this._FILMS_STEP_LOAD;

    if (this._renderedFilms >= this._getFilms().length) {
      remove(this._showMoreButton);
    }
  }

  _renderShowMoreButton() {
    if (this._getFilms().length > Math.max(this._FILMS_STEP_LOAD, this._FILMS_CARDS_NUMBER)) {

      render(this._siteCatalog.getElement().querySelector(`.films-list`), this._showMoreButton);

      this._showMoreButton.setClickHandler(this._onShowMoreButtonClick);
    }
  }

  _renderTopRatedFilms() {
    if (!this._getFilms(SortType.RATING)[0].rating) {
      return;
    }
    render(this._siteCatalog, this._topRatedContainerView);
    const topRatedFilmsContainer = this._siteCatalog.getElement().querySelector(`.films-list--extra .films-list__container`);
    this._getFilms(SortType.RATING).slice(0, this._FILMS_TOP_RATED_CARDS_NUMBER).forEach((film) => this._renderCard(topRatedFilmsContainer, film, `rated`));
  }

  _renderMostCommentedFilms() {
    if (!this._getFilms(SortType.COMMENTS)[0].comments.length) {
      return;
    }
    render(this._siteCatalog, this._mostCommentedContainerView);
    const mostCommentedFilmsContainer = this._siteCatalog.getElement().querySelector(`.films-list--commented .films-list__container`);
    this._getFilms(SortType.COMMENTS).slice(0, this._FILMS_MOST_COMMENTED_CARDS_NUMBER).forEach((film) => this._renderCard(mostCommentedFilmsContainer, film, `commented`));
  }

  _renderLoading() {
    render(this._siteMain, this._loadingView);
  }

  _renderCatalog() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    if (!(this._siteCatalog)) {
      this._siteCatalog = new CatalogFilmsView();
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
    this._renderTopRatedFilms();
    this._renderMostCommentedFilms();
  }
}
