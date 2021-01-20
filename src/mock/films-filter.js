const filmToFilterMap = {
  all: (filmCard) => filmCard.length,
  watchList: (filmCard) => filmCard
    .filter((el) => el.watchList).length,
  watchedList: (filmCard) => filmCard
    .filter((el) => el.watchedList).length,
  favorites: (filmCard) => filmCard
    .filter((el) => el.favorite).length,
};

export const generateFilter = (filmCard) => {
  return Object.entries(filmToFilterMap).map(([filterName, countFilms]) => {
    return {
      name: filterName,
      count: countFilms(filmCard),
    };
  });
};
