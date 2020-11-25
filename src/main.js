import {createUserIcon} from './view/user-icon';
import {createMenu} from './view/menu';
import {createSort} from './view/sort';
import {createNumberFilms} from './view/number-films';
import {createCardFilm} from './view/card-film';
import {createCatalogFilms} from './view/catalog-films';
import {createShowMoreButton} from './view/show-more-button';
import {createTopRating} from './view/top-rating';
import {createMostCommentedContainer} from './view/most-commented-container';

const FILMS_CARDS_NUMBER = 5;
const FILMS_TOP_RATED_CARDS_NUMBER = 2;
const FILMS_MOST_COMMENTED_CARDS_NUMBER = 2;

const render = (container, content, place = `beforeend`) => {
  container.insertAdjacentHTML(place, content);
};

const siteHeader = document.querySelector(`.header`);
render(siteHeader, createUserIcon());

const siteMain = document.querySelector(`.main`);
render(siteMain, createMenu(), `afterbegin`);
render(siteMain, createSort());
render(siteMain, createCatalogFilms());

const filmsListContainer = siteMain.querySelector(`.films-list__container`);
for (let i = 0; i < FILMS_CARDS_NUMBER; i++) {
  render(filmsListContainer, createCardFilm());
}

const filmsCatalog = siteMain.querySelector(`.films-list`);
render(filmsCatalog, createShowMoreButton());

const filmsContainer = siteMain.querySelector(`.films`);
render(filmsContainer, createTopRating());
render(filmsContainer, createMostCommentedContainer());

const topRatedFilmsContainer = filmsContainer.querySelector(`.films-list--extra .films-list__container`);
for (let i = 0; i < FILMS_TOP_RATED_CARDS_NUMBER; i++) {
  render(topRatedFilmsContainer, createCardFilm());
}

const mostCommentedFilmsContainer = filmsContainer.querySelector(`.films-list--commented .films-list__container`);
for (let i = 0; i < FILMS_MOST_COMMENTED_CARDS_NUMBER; i++) {
  render(mostCommentedFilmsContainer, createCardFilm());
}

const siteFooter = document.querySelector(`.footer`);
const footerStats = siteFooter.querySelector(`.footer__statistics`);
render(footerStats, createNumberFilms());
