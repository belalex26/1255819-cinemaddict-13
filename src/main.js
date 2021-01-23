import {render} from './utils';


import UserIconView from './view/user-icon';
import TotalFilmsView from './view/total-films';

import UserMock from './mock/user';
import MockFilm from "./mock/mock-film";
import {comments} from './mock/comments';

import MovieList from './presenter/movie-list';
import FiltersPresenters from './presenter/filters-presenter';

import FilmsModel from './model/films-model';
import FilterModel from './model/filter-model';
import CommentsModel from './model/comments-model';

const MAX_FILMS_CARDS = 20;
const AVAILABLE_FILMS = `123 456`;

const siteHeader = document.querySelector(`.header`);
const siteFooter = document.querySelector(`.footer`);
const footerStats = siteFooter.querySelector(`.footer__statistics`);

const filmCards = new Array(MAX_FILMS_CARDS).fill().map(() => {
  return new MockFilm().getNewCardFilm();
});
const user = new UserMock().userStats;

const filmsModel = new FilmsModel();
filmsModel.setFilms(filmCards);

const filterModel = new FilterModel();

const commentsModel = new CommentsModel();
commentsModel.setComments(comments);

render(siteHeader, new UserIconView(user.avatar, user.raiting).getElement());

const siteMain = document.querySelector(`.main`);

const filtersPresenter = new FiltersPresenters(filmsModel, filterModel);
filtersPresenter.init(siteMain);

const catalogPresenter = new MovieList(filmsModel, filterModel, commentsModel);
catalogPresenter.init(siteMain);

render(footerStats, new TotalFilmsView(AVAILABLE_FILMS), `beforeend`);
