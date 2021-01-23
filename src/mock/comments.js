import {getRandomInteger, generateId, DESCRIPTIONS, EMOTIONS} from '../utils.js';

const COMMENTS_NUMBER = 20;

const generateComments = () => {
  const NAMES = [`Ann`, `Greg`, `Igor`, `Kate`];

  const createNewComment = () => {
    return {
      id: generateId(),
      text: DESCRIPTIONS[getRandomInteger(0, DESCRIPTIONS.length - 1)],
      emotion: EMOTIONS[getRandomInteger(0, EMOTIONS.length - 1)],
      author: NAMES[getRandomInteger(0, NAMES.length - 1)],
      date: new Date(`${getRandomInteger(2005, 2020)} ${getRandomInteger(0, 11)} ${getRandomInteger(1, 31)} ${getRandomInteger(1, 23)}:${getRandomInteger(1, 59)}`)
    };
  };

  return new Array(COMMENTS_NUMBER).fill().map(createNewComment);
};

export const comments = generateComments();
