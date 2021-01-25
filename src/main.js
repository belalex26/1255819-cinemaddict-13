import {render, remove, renderToast} from './utils';
import {SiteState} from './const';

import MovieList from './presenter/movie-list';
import FiltersPresenters from './presenter/filters-presenter';
import UserPresenter from './presenter/user-presenter';
import FilmsCounterPresenter from './presenter/films-counter';

import FilmModel from './model/film-model';
import UserModel from './model/user-model';
import FilterModel from './model/filter-model';
import CommentsModel from './model/comments-model';

import Api from './api/api';
import Provider from './api/provider';
import Store from './api/store';

import Stats from './view/stats';

const END_POINT = `https://13.ecmascript.pages.academy/cinemaddict/`;
const AUTHORIZATION = `Basic jgdttwsjv6`;

const STORE_PREFIX = `cinemaaddict-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

let stats;
const changeSiteState = (action) => {
  switch (action) {
    case SiteState.TO_MOVIES:
      catalogPresenter.init();
      remove(stats);
      break;
    case SiteState.TO_STATS:
      catalogPresenter.destroy();
      stats = new Stats(filmsModel.getFilms(), userModel.getRaiting());
      render(siteMain, stats);
      break;
  }
};

const baseApi = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const api = new Provider(baseApi, store);

const siteMain = document.querySelector(`.main`);
const siteheader = document.querySelector(`.header`);
const siteFooter = document.querySelector(`.footer`);
const footerStats = siteFooter.querySelector(`.footer__statistics`);


const filmsModel = new FilmModel(api);
const filterModel = new FilterModel();
const commentsModel = new CommentsModel(api);
const userModel = new UserModel(filmsModel);

const userPresenter = new UserPresenter(userModel);
userPresenter.init(siteheader);

const filtersPresenter = new FiltersPresenters(filmsModel, filterModel, changeSiteState);
filtersPresenter.init(siteMain);

const catalogPresenter = new MovieList(filmsModel, filterModel, commentsModel);
catalogPresenter.init(siteMain);

const filmsCounterPresenter = new FilmsCounterPresenter(filmsModel);
filmsCounterPresenter.init(footerStats);

api.getFilms()
.then((films) => filmsModel.setFilms(films))
.catch(() => {
  filmsModel.setFilms([]);
});

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  api.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
  renderToast(`Lost connection`);
});
