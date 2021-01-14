import {render} from './utils';

import UserIconView from './view/user-icon';
import TotalFilmsView from './view/total-films';

import UserMock from './mock/user';
import MockFilm from "./mock/mock-film";

import MovieList from './presenter/movie-list';

const MAX_FILMS_CARDS = 20;
const AVAILABLE_FILMS = `123 456`;

const siteHeader = document.querySelector(`.header`);
const siteFooter = document.querySelector(`.footer`);
const footerStats = siteFooter.querySelector(`.footer__statistics`);

const filmCards = new Array(MAX_FILMS_CARDS).fill().map(() => {
  return new MockFilm().getNewCardFilm();
});
const user = new UserMock().userStats;

render(siteHeader, new UserIconView(user.avatar, user.raiting).getElement());

const movieList = new MovieList();
movieList.init(filmCards);

render(footerStats, new TotalFilmsView(AVAILABLE_FILMS), `beforeend`);
