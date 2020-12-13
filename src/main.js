import {createUserIcon} from './view/user-icon';
import {createFilterTemplate} from './view/filter';
import {createSort} from './view/sort';
// import {createTotalFilmsTemplate} from './view/total-films';
import {createCardFilm} from './view/card-film';
import {createCatalogFilms} from './view/catalog-films';
import {createShowMoreButton} from './view/show-more-button';
import {createTopRating} from './view/top-rating';
import {createMostCommentedContainer} from './view/most-commented-container';
// import {createStatistics} from "./view/statistics";
import {createPopupTemplate} from "./view/popup-film";

import {user} from './mock/user';
import {generateFilmCard} from "./mock/card";
import {generateFilter} from "./mock/films-filter";

// import {generateUserStats} from "./mock/user-stats";

const FILMS_CARDS_COUNT = 5;
// const FILMS_TOP_RATED_CARDS_NUMBER = 2;
// const FILMS_MOST_COMMENTED_CARDS_NUMBER = 2;
const MAX_FILMS_CARDS = 20;

const siteMain = document.querySelector(`body`);
const siteHeader = siteMain.querySelector(`.header`);

const filmCards = new Array(MAX_FILMS_CARDS).fill().map(generateFilmCard);
const filters = generateFilter(filmCards);
// const rank = generateUserStats(filmCards, filters);

const render = (container, content, place = `beforeend`) => {
  container.insertAdjacentHTML(place, content);
};

render(siteHeader, createUserIcon(user.avatar, user.raiting));
render(siteMain, createFilterTemplate(filters));
render(siteMain, createSort());
render(siteMain, createCatalogFilms());
render(siteMain, createPopupTemplate(filmCards[0])); // попап

const filmsListContainer = siteMain.querySelector(`.films-list__container`);


if (filmCards.length !== 0) {

  filmCards.slice(0, FILMS_CARDS_COUNT).forEach((film) => render(filmsListContainer, createCardFilm(film)));

} else {
  render(filmsListContainer, `<h2 class="films-list__title">There are no movies in our database</h2>`);
}

if (filmCards.length > FILMS_CARDS_COUNT) {
  let renderedFilmCount = FILMS_CARDS_COUNT;

  render(filmsListContainer, createShowMoreButton(), `afterend`);

  const loadMoreButton = siteMain.querySelector(`.films-list__show-more`);

  loadMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    filmCards.slice(renderedFilmCount, renderedFilmCount + FILMS_CARDS_COUNT).forEach((film) => render(filmsListContainer, createCardFilm(film)));

    renderedFilmCount += FILMS_CARDS_COUNT;

    if (renderedFilmCount >= filmCards.length) {
      loadMoreButton.remove();
    }
  });
}

const filmsContainer = siteMain.querySelector(`.films`);

render(filmsContainer, createTopRating());
render(filmsContainer, createMostCommentedContainer());

/*
const topRatedFilmsContainer = filmsContainer.querySelector(`.films-list--extra .films-list__container`);
for (let i = 0; i < FILMS_TOP_RATED_CARDS_NUMBER; i++) {
  render(topRatedFilmsContainer, createCardFilm(filmCards[i]));
}

const mostCommentedFilmsContainer = filmsContainer.querySelector(`.films-list--commented .films-list__container`);
for (let i = 0; i < FILMS_MOST_COMMENTED_CARDS_NUMBER; i++) {
  render(mostCommentedFilmsContainer, createCardFilm(filmCards[i]));
}


const siteFooter = siteMain.querySelector(`.footer`);
const footerStats = siteFooter.querySelector(`.footer__statistics`);

render(footerStats, createTotalFilmsTemplate());
render(siteMain, createStatistics(rank));
*/
