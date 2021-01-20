import AbstractView from './abstract-view';

const createSiteMenu = (films) => {

  let watchList = 0;
  let watchedList = 0;
  let favourites = 0;
  films.forEach((film) => {
    if (film.watchlist) {
      watchList++;
    }
    if (film.watchedList) {
      watchedList++;
    }
    if (film.favourite) {
      favourites++;
    }
  });


  return `<nav class="main-navigation">
  <div class="main-navigation__items">
    <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
    <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${watchList}</span></a>
    <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${watchedList}</span></a>
    <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${favourites}</span></a>
  </div>
  <a href="#stats" class="main-navigation__additional">Stats</a>
</nav>`;
};

export default class MenuSite extends AbstractView {
  constructor(films) {
    super();
    this.films = films;
  }

  getTemplate() {
    return createSiteMenu(this.films);
  }
}
