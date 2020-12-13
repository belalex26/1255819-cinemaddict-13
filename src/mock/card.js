import {getRandomInteger} from '../utils';

const minNumberOfOffers = 1;
const maxNumberOfOffers = 5;

export const state = {
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

const generateDate = () => {
  const date = new Date(`${getRandomInteger(2005, 2020)} ${getRandomInteger(1, 12)} ${getRandomInteger(1, 31)} ${getRandomInteger(1, 23)}:${getRandomInteger(1, 59)}`);
  return date;
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
    newData.push(data[getRandomInteger(0, data.length - 1)]);
  }
  shuffle(newData);
  newData.slice(getRandomInteger(minNumberOfOffers, maxNumberOfOffers));
  return newData;
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
};

export const generateFilmCard = () => {
  return {
    filmName: generateRandomElement(state.filmsName),
    originalName: generateRandomElement(state.originalNames),
    poster: generateRandomElement(state.posters),
    description: generateDescription(),
    comments: generateComments(),
    rating: getRandomInteger(0, 10),
    ageLimit: generateRandomElement(state.ageLimits),
    date: new Date(`${getRandomInteger(1935, 2020)},${getRandomInteger(1, 12)},${getRandomInteger(0, 30)}`),
    duration: generateDuration(),
    director: generateRandomElement(state.authors),
    writers: generateRandomSet(state.writers),
    actors: generateRandomSet(state.authors),
    country: generateRandomElement(state.countries),
    genre: generateRandomSet(state.genres),
    watched: Boolean(getRandomInteger(0, 1)),
    watchList: Boolean(getRandomInteger(0, 1)),
    favorite: Boolean(getRandomInteger(0, 1))
  };
};
