import {render, remove, updateElement, sortType} from '../utils';
// import {renderCard} from '../render-card';

import SiteSortView from '../view/site-sort';
import SiteCatalogView from '../view/catalog-films';
import ShowMoreButtonView from '../view/show-more-button';
import TopRatingContainerView from '../view/top-rating';
import MostCommentedContainerView from '../view/most-commented-container';
import MoviePresenter from './movie';

const FILMS_CARDS_COUNT = 5;
const FILMS_TOP_RATED_CARDS_NUMBER = 2;
const FILMS_MOST_COMMENTED_CARDS_NUMBER = 2;
const MAX_FILMS_CARDS = 20;


export default class MovieList {
  constructor() {
    this._siteMain = document.querySelector(`.main`);
    this._siteCatalog = new SiteCatalogView();
    this._siteSort = new SiteSortView();
    this._loadMoreButton = new ShowMoreButtonView();
    this._topRatedFilmsContainer = new TopRatingContainerView();
    this._mostCommentedFilmsContainer = new MostCommentedContainerView();

    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._setDefaultView = this._setDefaultView.bind(this);
    this._handleSortChange = this._handleSortChange.bind(this);
    this._currentSortType = sortType.DEFAULT;
    this._renderedFilmCount = null;

    this._moviePresenter = {};
  }

  init(filmCards) {
    this._presenterBlocks = Object.keys(this._moviePresenter);
    this._filmCards = filmCards.slice();
    this._sourcedFilmCards = filmCards.slice();

    this._renderTheWholeCatalog();
  }

  _clearMovieList() {
    Object
      .values(this._moviePresenter)
      .forEach((presenter) => presenter.destroy());
    this._moviePresenter = {};
    this._renderFilmCount = FILMS_CARDS_COUNT;
    remove(this._loadMoreButton);

  }

  _handleFilmChange(updateFilm) {
    this._filmCards = updateElement(this._filmCards, updateFilm);
    if (this._moviePresenter[updateFilm.id]) {
      this._clearMovieList();
      this._moviePresenter[updateFilm.id].init(updateFilm);
    }
  }

  _setDefaultView() {
    Object.values(this._moviePresenter).forEach((presenter) => {
      presenter.closePopup();
    });
  }

  _handleSortChange(sort) {
    if (this._currentSortType === sort) {
      return;
    }
    this._clearMovieList();
    this._sortedFilms(sort);
    this._renderFilmsList();
  }

  _sortedFilms(sort) {
    switch (sort) {
      case sortType.DATE:
        if (!this._filmsSortedByDate) {
          this._filmsSortedByDate = this._filmCards.slice().sort((previous, current) => {
            return current.date - previous.date;
          });
        }
        this._filmCards = this._filmsSortedByDate;
        break;
      case sortType.RATING:
        if (!this._filmsSortedByRaiting) {
          this._filmsSortedByRaiting = this._filmCards.slice().sort((previous, current) => {
            return current.raiting - previous.raiting;
          });
        }
        break;
      case sortType.DEFAULT:
        this._filmCards = this._sourcedFilmCards.slice();
        break;
    }

    this._currentSortType = sort;
  }

  _renderNoFims(filmsListContainer) {
    render(filmsListContainer, `<h2 class="films-list__title">There are no movies in our database</h2>`);
  }

  _renderCard(container, film, block) {
    const renderMoviePresenter = new MoviePresenter(this._handleFilmChange, this._setDefaultView, block);
    renderMoviePresenter.init(container, film);
    this._moviePresenter[film.id] = renderMoviePresenter;
  }

  _renderSort() {
    render(this._siteMain, this._siteSort);
    this._siteSort.setSortTypeChangeHandler(this._handleSortChange);
  }

  _renderFilmCards(filmsListContainer) {
    if (this._filmCards.length !== 0) {
      this._filmCards.slice(0, FILMS_CARDS_COUNT).forEach((film) => this._renderCard(filmsListContainer, film));
    } else {
      this._renderNoFims();
    }
  }

  _renderLoadMoreButton(filmsListContainer) {
    let renderedFilmCount = FILMS_CARDS_COUNT;
    const loadMoreButton = new ShowMoreButtonView();
    render(filmsListContainer, loadMoreButton, `afterend`);


    const onShowMoreButtonClick = () => {
      this._filmCards.slice(renderedFilmCount, renderedFilmCount + FILMS_CARDS_COUNT).forEach((film) => this._renderCard(filmsListContainer, film));
      renderedFilmCount += FILMS_CARDS_COUNT;

      if (renderedFilmCount >= this._filmCards.length) {
        loadMoreButton.getElement().remove();
      }
    };
    loadMoreButton.setClickHandler(onShowMoreButtonClick);
  }
  /*
  _renderFilmsRecommend(block, film) {
    const renderFilmPresenter = new MoviePresenter(this._handleFilmChange, this._setDefaultView, block);
    renderFilmPresenter.init(film);
    this._filmRecommendPresenter[film.id] = renderFilmPresenter;
  }*/

  _renderFilmsList() {
    const siteCatalog = new SiteCatalogView(MAX_FILMS_CARDS < 1);
    const containerFilms = siteCatalog.getElement();

    if (MAX_FILMS_CARDS < 1) {
      render(this._siteMain, containerFilms);
      return;
    }

    render(this._siteMain, containerFilms);

    const filmsListContainer = this._siteMain.querySelector(`.films-list__container`);

    this._renderFilmCards(filmsListContainer);


    if (this._filmCards.length > FILMS_CARDS_COUNT) {
      this._renderLoadMoreButton(filmsListContainer);
    }
  }

  _renderFilmsCardTopRated(filmsContainer) {
    render(filmsContainer, new TopRatingContainerView());
    // const topRated = [...this._filmCards].sort((a, b) => a.rating < b.rating ? 1 : -1);

    const filmsCardTopRated = this._filmCards.slice().sort((previous, current) => {
      return current.rating - previous.rating;
    });

    const topRatedFilmsContainer = filmsContainer.querySelector(`.films-list--extra .films-list__container`);
    filmsCardTopRated.slice(0, FILMS_TOP_RATED_CARDS_NUMBER).forEach((film) => this._renderCard(topRatedFilmsContainer, film));

  }

  _renderFilmsCardMostCommented(filmsContainer) {
    // const mostComment = [...this._filmCards].sort((a, b) => a.comments.length < b.comments.length ? 1 : -1);

    render(filmsContainer, this._mostCommentedFilmsContainer);

    const filmsCardMostCommented = this._filmCards.slice().sort((previous, current) => {
      return current.comments.length - previous.comments.length;
    });

    const mostCommentedFilmsContainer = filmsContainer.querySelector(`.films-list--commented .films-list__container`);
    filmsCardMostCommented.slice(0, FILMS_MOST_COMMENTED_CARDS_NUMBER).forEach((film) => this._renderCard(mostCommentedFilmsContainer, film));
  }

  _renderTheWholeCatalog() {
    this._renderSort();
    this._renderFilmsList();

    const filmsContainer = this._siteMain.querySelector(`.films`);

    this._renderFilmsCardTopRated(filmsContainer);
    this._renderFilmsCardMostCommented(filmsContainer);
  }
}
