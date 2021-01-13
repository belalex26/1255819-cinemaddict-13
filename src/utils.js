import AbstractView from './view/abstract-view';

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

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
