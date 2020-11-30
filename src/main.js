import {createUserIcon} from './view/user-icon';
import {createFilterTemplate} from './view/filter';
import {createSort} from './view/sort';
import {createTotalFilmsTemplate} from './view/total-films';
import {createCardFilm} from './view/card-film';
import {createCatalogFilms} from './view/catalog-films';
import {createShowMoreButton} from './view/show-more-button';
import {createTopRating} from './view/top-rating';
import {createMostCommentedContainer} from './view/most-commented-container';

import {generateFilmCard} from "./mock/card";
import {generateFilter} from "./mock/films-filter";
import {generateUserStats} from "./mock/user-stats";
import {createStatistics} from "./view/statistics";

const siteMain = document.querySelector(`body`);
const siteHeader = siteMain.querySelector(`.header`);

const FILMS_CARDS_NUMBER = 5;
const FILMS_TOP_RATED_CARDS_NUMBER = 2;
const FILMS_MOST_COMMENTED_CARDS_NUMBER = 2;
const MAX_FILMS_CARDS = 20;

const filmCard = new Array(MAX_FILMS_CARDS).fill().map(generateFilmCard);
const filters = generateFilter(filmCard);
const rank = generateUserStats(filmCard, filters);

const render = (container, content, place = `beforeend`) => {
  container.insertAdjacentHTML(place, content);
};

render(siteHeader, createUserIcon());
render(siteMain, createFilterTemplate(filters));
render(siteMain, createSort());
render(siteMain, createCatalogFilms());

const filmsListContainer = siteMain.querySelector(`.films-list__container`);

if (filmCard.length !== 0) {

  for (let i = 0; i < Math.min(filmCard.length, FILMS_CARDS_NUMBER); i++) {
    render(filmsListContainer, createCardFilm(filmCard[i]));
  }
} else {
  render(filmsListContainer, `<h2 class="films-list__title">There are no movies in our database</h2>`);
}

if (filmCard.length > FILMS_CARDS_NUMBER) {
  render(filmsListContainer, createShowMoreButton(), `afterend`);


  const renderedFilmCount = FILMS_CARDS_NUMBER;
  const loadMoreButton = siteMain.querySelector(`.films-list__show-more`);

  loadMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    filmCard
      .slice(renderedFilmCount, renderedFilmCount + FILMS_CARDS_NUMBER)
      .forEach((card) => render(filmsListContainer, createCardFilm(card)));

    renderedFilmCount += FILMS_CARDS_NUMBER;

    if (renderedFilmCount >= filmCard.length) {
      loadMoreButton.remove();
    }
  });
}

const filmsContainer = siteMain.querySelector(`.films`);

render(filmsContainer, createTopRating());
render(filmsContainer, createMostCommentedContainer());

const topRatedFilmsContainer = filmsContainer.querySelector(`.films-list--extra .films-list__container`);
for (let i = 0; i < FILMS_TOP_RATED_CARDS_NUMBER; i++) {
  render(topRatedFilmsContainer, createCardFilm(filmCard[i]));
}

const mostCommentedFilmsContainer = filmsContainer.querySelector(`.films-list--commented .films-list__container`);
for (let i = 0; i < FILMS_MOST_COMMENTED_CARDS_NUMBER; i++) {
  render(mostCommentedFilmsContainer, createCardFilm(filmCard[i]));
}

const siteFooter = siteMain.querySelector(`.footer`);
const footerStats = siteFooter.querySelector(`.footer__statistics`);

render(footerStats, createTotalFilmsTemplate());
render(siteMain, createStatistics(rank));
