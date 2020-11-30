import {createCardFilm} from "./card-film";
import {getRandomInteger} from '../utils';

const createCardsForRecommend = (count, filmCard) => {
  let result = ` `;
  for (let x = 0; x < count; x++) {
    const randomFilmCard = getRandomInteger(0, filmCard.length - 1);
    result += createCardFilm(filmCard[randomFilmCard]);
  }
  return result;
};


export const createCatalogFilms = (count, filmCard, title) => {
  return `<section class="films">
  <section class="films-list">
    <h2 class="films-list__title visually-hidden">${title}</h2>
    <div class="films-list__container">
      ${createCardsForRecommend(count, filmCard)}
    </div>
  </section>`;
};
