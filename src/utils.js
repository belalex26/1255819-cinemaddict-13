import AbstractView from './view/abstract-view';

export const EMOTIONS = [
  `smile`,
  `sleeping`,
  `puke`,
  `angry`
];
export const EMOTION_PICS = {
  smile: `./images/emoji/smile.png`,
  sleeping: `./images/emoji/sleeping.png`,
  puke: `./images/emoji/puke.png`,
  angry: `./images/emoji/angry.png`
};

export const SortType = {
  DEFAULT: `default`,
  DATE: `date`,
  RATING: `raiting`,
  COMMENTS: `commented`
};
export const CATEGORIES = {
  ALL: `all`,
  WATCHLIST: `watchlist`,
  HISTORY: `history`,
  FAVOURITES: `favourites`
};

export const UserAction = {
  DELETE_COMMENT: `DELETE_COMMENT`,
  ADD_COMMENT: `ADD_COMMENT`,
  UPDATE_FILM_CATEGORY: `UPDATE_FILM_CATEGORY`,
  UPDATE_FILTER: `UPDATE_FILTER`
};

export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`
};

export const ModelMethod = {
  UPDATE_FILM: `updateFilm`,
  UPDATE_FILTER: `updateFilter`,
  ADD_COMMENT: `addComment`,
  DELETE_COMMENT: `deleteComment`
};

export const DESCRIPTIONS = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];

export const filter = {
  [CATEGORIES.All]: (films) => films,
  [CATEGORIES.WATCHLIST]: (films) => films.filter((film) => (film.isInWatchlist)),
  [CATEGORIES.HISTORY]: (films) => films.filter((film) => (film.isInHistory)),
  [CATEGORIES.FAVOURITES]: (films) => films.filter((film) => (film.isFavourite))
};

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

export const firstLetterCaps = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const render = (container, element, place = `beforeend`) => {
  if (container instanceof AbstractView) {
    container = container.getElement();
  }
  if (element instanceof AbstractView) {
    element = element.getElement();
  }

  switch (place) {
    case `beforeend`:
      container.append(element);
      break;
    case `afterbegin`:
      container.prepend(element);
      break;
    case `afterend`:
      container.after(element);
      break;
  }
};

export const isKeyPressed = (evt, cb, keyName) => {
  if (evt.key === keyName) {
    cb();
  }
};

export const remove = (component) => {
  if (component === null) {
    return;
  }

  if (!(component instanceof AbstractView)) {
    throw new Error(`Can remove only components`);
  }

  component.getElement().remove();
  component.removeElement();
};

export const updateElement = (elementsArr, elementToUpdate) => {
  const index = elementsArr.findIndex((element) => element.id === elementToUpdate.id);
  if (index === -1) {
    return elementsArr;
  }

  return [
    ...elementsArr.slice(0, index), elementToUpdate, ...elementsArr.slice(index + 1)
  ];
};

export const replace = (newElement, oldElement) => {
  if (newElement instanceof AbstractView) {
    newElement = newElement.getElement();
  }
  if (oldElement instanceof AbstractView) {
    oldElement = oldElement.getElement();
  }
  const parentElement = oldElement.parentElement;
  if (parentElement === null || newElement === null || oldElement === null) {
    throw new Error(`One of elements doesn't exist in case of replacement`);
  }
  parentElement.replaceChild(newElement, oldElement);
};
