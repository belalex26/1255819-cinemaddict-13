import {render} from './utils';
import {renderCard} from './render-card';

import UserIconView from './view/user-icon';
import SiteMenuView from './view/menu-site';
import SiteSortView from './view/site-sort';
import TotalFilmsView from './view/total-films';
// import StatisticsView from './view/statistics';
import SiteCatalogView from './view/catalog-films';
import ShowMoreButtonView from './view/show-more-button';
import TopRatingContainerView from './view/top-rating';
import MostCommentedContainerView from './view/most-commented-container';


import UserMock from './mock/user';
import MockFilm from "./mock/mock-film";

const FILMS_CARDS_COUNT = 5;
const FILMS_TOP_RATED_CARDS_NUMBER = 2;
const FILMS_MOST_COMMENTED_CARDS_NUMBER = 2;
const MAX_FILMS_CARDS = 20;
const AVAILABLE_FILMS = `123 456`;

const siteMain = document.querySelector(`.main`);
const siteHeader = document.querySelector(`.header`);
const siteFooter = document.querySelector(`.footer`);
const footerStats = siteFooter.querySelector(`.footer__statistics`);

const filmCards = new Array(MAX_FILMS_CARDS).fill().map(() => {
  return new MockFilm().getNewCardFilm();
});
const user = new UserMock().userStats;

render(siteHeader, new UserIconView(user.avatar, user.raiting).getElement());
render(siteMain, new SiteMenuView(user).getElement(), `afterbein`);

const siteCatalog = new SiteCatalogView();
const containerFilms = siteCatalog.getElement();
render(siteMain, new SiteSortView().getElement());
render(siteMain, containerFilms);

const filmsListContainer = siteMain.querySelector(`.films-list__container`);
if (filmCards.length !== 0) {

  filmCards.slice(0, FILMS_CARDS_COUNT).forEach((film) => renderCard(filmsListContainer, film));

} else {
  render(filmsListContainer, `<h2 class="films-list__title">There are no movies in our database</h2>`);
}


if (filmCards.length > FILMS_CARDS_COUNT) {
  let renderedFilmCount = FILMS_CARDS_COUNT;

  render(filmsListContainer, new ShowMoreButtonView().getElement(), `afterend`);

  const loadMoreButton = siteMain.querySelector(`.films-list__show-more`);

  loadMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    filmCards.slice(renderedFilmCount, renderedFilmCount + FILMS_CARDS_COUNT).forEach((film) => renderCard(filmsListContainer, film));

    renderedFilmCount += FILMS_CARDS_COUNT;

    if (renderedFilmCount >= filmCards.length) {
      loadMoreButton.remove();
    }
  });
}

const filmsContainer = siteMain.querySelector(`.films`);

render(filmsContainer, new TopRatingContainerView().getElement());
render(filmsContainer, new MostCommentedContainerView().getElement());

const filmsCardTopRated = filmCards.slice().sort((previous, current) => {
  return current.rating - previous.rating;
});

const filmsCardMostCommented = filmCards.slice().sort((previous, current) => {
  return current.comments.length - previous.comments.length;
});

const topRatedFilmsContainer = filmsContainer.querySelector(`.films-list--extra .films-list__container`);
filmsCardTopRated.slice(0, FILMS_TOP_RATED_CARDS_NUMBER).forEach((film) => renderCard(topRatedFilmsContainer, film));


const mostCommentedFilmsContainer = filmsContainer.querySelector(`.films-list--commented .films-list__container`);
filmsCardMostCommented.slice(0, FILMS_MOST_COMMENTED_CARDS_NUMBER).forEach((film) => renderCard(mostCommentedFilmsContainer, film));

render(footerStats, new TotalFilmsView(AVAILABLE_FILMS).getElement());
