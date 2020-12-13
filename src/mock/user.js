import {getRandomInteger} from './../utils.js';

export const user = {
  raiting: `Movie Buff`,
  avatar: `./images/bitmap@2x.png`,
  favourites: new Array(getRandomInteger(0, 15)),
  watchlist: new Array(getRandomInteger(0, 15)),
  history: new Array(getRandomInteger(0, 15))
};
