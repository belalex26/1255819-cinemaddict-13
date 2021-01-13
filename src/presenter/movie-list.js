import {render, remove} from '../utils';
import {renderCard} from '../render-card';

import SiteSortView from '../view/site-sort';
import SiteCatalogView from '../view/catalog-films';
import ShowMoreButtonView from '../view/show-more-button';
import TopRatingContainerView from '../view/top-rating';
import MostCommentedContainerView from '../view/most-commented-container';

const FILMS_CARDS_COUNT = 5;
const FILMS_TOP_RATED_CARDS_NUMBER = 2;
const FILMS_MOST_COMMENTED_CARDS_NUMBER = 2;
const MAX_FILMS_CARDS = 20;

export default class MovieList {
  constructor() {
    this._moviePresenter = {};
    this._siteMain = document.querySelector(`.main`);
    this._siteCatalog = new SiteCatalogView();
    this._siteSort = new SiteSortView();
    this._loadMoreButton = new ShowMoreButtonView();
    this._topRatedFilmsContainer = new TopRatingContainerView();
    this._mostCommentedFilmsContainer = new MostCommentedContainerView();

  }
  init(filmCards) {
    this._filmCards = filmCards;
    this._sourcedFilmCards = filmCards;

    this._renderTheWholeCatalog();
  }

  _clearMovieList() {
    Object
      .value(this._moviePresenter)
      .forEach((presenter) => presenter.destroy());
    this._moviePresenter = {};
    this._renderFilmCount = FILMS_CARDS_COUNT;
    remove(this._loadMoreButton);
  }

  _renderNoFims(filmsListContainer) {
    render(filmsListContainer, `<h2 class="films-list__title">There are no movies in our database</h2>`);
  }

  _renderSort() {
    render(this._siteMain, new SiteSortView());
  }

  _renderFilmCards(filmsListContainer) {
    if (this._filmCards.length !== 0) {
      this._filmCards.slice(0, FILMS_CARDS_COUNT).forEach((film) => renderCard(filmsListContainer, film));
    } else {
      this._renderNoFims();
    }
  }

  _renderLoadMoreButton(filmsListContainer) {
    let renderedFilmCount = FILMS_CARDS_COUNT;
    const loadMoreButton = new ShowMoreButtonView();
    render(filmsListContainer, loadMoreButton, `afterend`);


    const onShowMoreButtonClick = () => {
      this._filmCards.slice(renderedFilmCount, renderedFilmCount + FILMS_CARDS_COUNT).forEach((film) => renderCard(filmsListContainer, film));
      renderedFilmCount += FILMS_CARDS_COUNT;

      if (renderedFilmCount >= this._filmCards.length) {
          loadMoreButton.getElement().remove();
      }
    };
    loadMoreButton.setClickHandler(onShowMoreButtonClick);
  }

  _renderfilmsCardTopRated(filmsContainer) {
    render(filmsContainer, new TopRatingContainerView());

    const filmsCardTopRated = this._filmCards.slice().sort((previous, current) => {
      return current.rating - previous.rating;
    });

    const topRatedFilmsContainer = filmsContainer.querySelector(`.films-list--extra .films-list__container`);
    filmsCardTopRated.slice(0, FILMS_TOP_RATED_CARDS_NUMBER).forEach((film) => renderCard(topRatedFilmsContainer, film));

  }

  _renderFilmsCardMostCommented(filmsContainer) {
    render(filmsContainer, new MostCommentedContainerView());

    const filmsCardMostCommented = this._filmCards.slice().sort((previous, current) => {
      return current.comments.length - previous.comments.length;
    });

    const mostCommentedFilmsContainer = filmsContainer.querySelector(`.films-list--commented .films-list__container`);
    filmsCardMostCommented.slice(0, FILMS_MOST_COMMENTED_CARDS_NUMBER).forEach((film) => renderCard(mostCommentedFilmsContainer, film));
  }

  _renderTheWholeCatalog() {
    const siteCatalog = new SiteCatalogView(MAX_FILMS_CARDS < 1);
    const containerFilms = siteCatalog.getElement();

    if (MAX_FILMS_CARDS < 1) {
      render(this._siteMain, containerFilms);
      return;
    }

    this._renderSort();

    render(this._siteMain, containerFilms);

    const filmsListContainer = this._siteMain.querySelector(`.films-list__container`);
    
    this._renderFilmCards(filmsListContainer);


    if (this._filmCards.length > FILMS_CARDS_COUNT) {
      this._renderLoadMoreButton(filmsListContainer);
    }

    const filmsContainer = this._siteMain.querySelector(`.films`);

    this._renderfilmsCardTopRated(filmsContainer);
    this._renderFilmsCardMostCommented(filmsContainer);
  }
}

