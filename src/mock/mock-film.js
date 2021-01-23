import {getRandomInteger, generateId} from '../utils';
import {comments} from './comments';

const minNumberOfOffers = 1;
const maxNumberOfOffers = 5;

const state = {
  filmsName: [
    `Santa claus conquers the martians`,
    `Made for each other`,
    `The dance of life`,
    `The great flamarion`,
    `Popeye meets Sinbad`,
    `Sagebrush trail`,
    `The man with the golden arm`,
  ],
  originalNames: [
    `goose trand`,
    `place kolbeyn`,
    `calm erl`,
    `suitable broddi`,
    `he goat annabella`,
    `broddi nerun`,
    `santa karlayl`
  ],

  posters: [
    `popeye-meets-sinbad.png`,
    `santa-claus-conquers-the-martians.jpg`,
    `the-dance-of-life.jpg`,
    `the-great-flamarion.jpg`,
    `sagebrush-trail.jpg`,
    `the-man-with-the-golden-arm.jpg`,
    `made-for-each-other.png`,
  ],
  genres: [
    `comedy`,
    `horror`,
    `action`,
    `cartoon`,
  ],
  ageLimits: [
    `3+`,
    `13+`,
    `16+`,
    `18+`,
  ],
  countries: [
    `USA`,
    `Germany`,
    `Valhalla`,
    `Russia`,
  ],
  authors: [
    `Maximilian`,
    `Vladilen`,
    `Bill`,
    `Lex`,
  ],
  writers: [
    `Anne Wigton`,
    `Heinz Herald`,
    `Richard Weil`,
    `Wigton Heinz`,
    `Weil Wigton`,
  ],

  descriptions: [
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget.`,
    `Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.`,
    `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
    `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
    `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
    `Sed sed nisi sed augue convallis suscipit in sed felis.`,
    `Aliquam erat volutpat.`,
    `Nunc fermentum tortor ac porta dapibus.`,
    `In rutrum ac purus sit amet tempus.`
  ],
  emotions: [
    `smile`,
    `sleeping`,
    `puke`,
    `angry`
  ]
};

const shuffle = (data) => {
  let copyData = data;
  for (let i = copyData.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [copyData[i], copyData[j]] = [copyData[j], copyData[i]];
  }
  return copyData;
};

const generateRandomSet = (data) => {
  let newData = [];
  for (let i = 0; i < getRandomInteger(1, data.length - 1); i++) {
    newData.push(data[getRandomInteger(1, data.length - 1)]);
  }

  shuffle(newData);
  newData.slice(getRandomInteger(minNumberOfOffers, maxNumberOfOffers));
  return Array.from(new Set(newData));
};


const generateDescription = () => {

  shuffle(state.descriptions);
  const description = state.descriptions.slice(getRandomInteger(minNumberOfOffers, maxNumberOfOffers)).join(``);
  return description;
};

const generateRandomElement = (data) => {
  const randomElement = getRandomInteger(0, data.length - 1);

  return data[randomElement];
};

const generateDuration = () => {
  const randomHours = getRandomInteger(0, 2);
  const randomMin = getRandomInteger(0, 59);
  return `${randomHours}h ${randomMin}m`;
};

/*
const generateComments = () => {

  const createNewComment = () => {
    generateDate();
    return {
      text: state.descriptions[getRandomInteger(0, state.descriptions.length - 1)],
      emotion: state.emotions[getRandomInteger(0, state.emotions.length - 1)],
      author: state.authors[getRandomInteger(0, state.authors.length - 1)],
    };
  };

  return new Array(getRandomInteger(0, maxNumberOfOffers)).fill().map(createNewComment);
};*/

const generateCommentsIdArr = () => {
  let idArr = [];
  for (let i = 0; i < getRandomInteger(0, maxNumberOfOffers); i++) {
    idArr.push(comments[getRandomInteger(0, comments.length - 1)].id);
  }
  return idArr;
};

export default class MockFilm {
  constructor() {
    this._id = generateId();
    this._filmName = generateRandomElement(state.filmsName);
    this._originalName = generateRandomElement(state.originalNames);
    this._poster = generateRandomElement(state.posters);
    this._description = generateDescription();
    this._comments = generateCommentsIdArr();
    this._rating = getRandomInteger(0, 10);
    this._ageLimit = generateRandomElement(state.ageLimits);
    this._date = new Date(`${getRandomInteger(1935, 2020)},${getRandomInteger(1, 12)},${getRandomInteger(0, 30)}`);
    this._duration = generateDuration();
    this._director = generateRandomElement(state.authors);
    this._writers = generateRandomSet(state.writers);
    this._actors = generateRandomSet(state.authors);
    this._country = generateRandomElement(state.countries);
    this._genre = generateRandomSet(state.genres);
    this._watched = Boolean(getRandomInteger(0, 1));
    this._watchList = Boolean(getRandomInteger(0, 1));
    this._favorite = Boolean(getRandomInteger(0, 1));

    this._isInWatchlist = Boolean(getRandomInteger(0, 1));
    this._isInHistory = Boolean(getRandomInteger(0, 1));
    this._isFavourite = Boolean(getRandomInteger(0, 1));
  }


  getNewCardFilm() {
    return {
      id: this._id,
      filmName: this._filmName,
      originalName: this._originalName,
      poster: this._poster,
      description: this._description,
      comments: this._comments,
      rating: this._rating,
      ageLimit: this._ageLimit,
      date: this._date,
      duration: this._duration,
      director: this._director,
      writers: this._writers,
      actors: this._actors,
      country: this._country,
      genre: this._genre,
      isInWatchlist: this._isInWatchlist,
      isInHistory: this._isInHistory,
      isFavourite: this._isFavourite
    };
  }
}
