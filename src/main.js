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
const FILMS_TOP_RAITED_CARDS_NUMBER = 2;
const FILMS_MOST_COMMENTED_CARDS_NUMBER = 2;

const render = (container, place, content) => {
  container.insertAdjacentHTML(place, content);
};

const siteHeader = document.querySelector(`.header`);
render(siteHeader, `beforeend`, createUserIcon());

const siteMain = document.querySelector(`.main`);
render(siteMain, `afterbegin`, createMenu());
render(siteMain, `beforeend`, createSort());
render(siteMain, `beforeend`, createCatalogFilms());

const filmsListContainer = siteMain.querySelector(`.films-list__container`);
for (let i = 0; i < FILMS_CARDS_NUMBER; i++) {
  render(filmsListContainer, `beforeend`, createCardFilm());
}

const filmsCatalog = siteMain.querySelector(`.films-list`);
render(filmsCatalog, `beforeend`, createShowMoreButton());

const filmsContainer = siteMain.querySelector(`.films`);
render(filmsContainer, `beforeend`, createTopRating());
render(filmsContainer, `beforeend`, createMostCommentedContainer());

const topRaitedFilmsContainer = filmsContainer.querySelector(`.films-list--extra .films-list__container`);
for (let i = 0; i < FILMS_TOP_RAITED_CARDS_NUMBER; i++) {
  render(topRaitedFilmsContainer, `beforeend`, createCardFilm());
}

const mostCommentedFilmsContainer = filmsContainer.querySelector(`.films-list--commented .films-list__container`);
for (let i = 0; i < FILMS_MOST_COMMENTED_CARDS_NUMBER; i++) {
  render(mostCommentedFilmsContainer, `beforeend`, createCardFilm());
}

const siteFooter = document.querySelector(`.footer`);
const footerStats = siteFooter.querySelector(`.footer__statistics`);
render(footerStats, `beforeend`, createNumberFilms());
