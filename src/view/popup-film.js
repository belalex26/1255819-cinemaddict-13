import dayjs from "dayjs";

const emotions = [
  `smile`,
  `sleeping`,
  `puke`,
  `angry`
];

const maxLengthDescription = 140;
const genreOneTitle = document.getElementsByClassName(`genres`);


export const createPopupTemplate = (filmCard) => {
  const {filmName, originalName, rating, date, duration, genre, poster, description, comments, director, writers, actors, country, ageLimit} = filmCard;

  const genres = genre.map((value, index) => {

    return `<span class="film-details__genre">${genre[index]}</span>`;
  }).join(`,`);

  const insertGenre = () => {

    let genreTitle = genreOneTitle.innerHTML = `Genre`;

    if (genre.length >= 2) {
      genreTitle = genreOneTitle.innerHTML = `Genres`;
    }
    return genreTitle;
  };

  const insertGenreTitle = insertGenre();

  const shorten = (text, maxLength) => {
    const descriptionText = text;
    if (descriptionText.length > maxLength) {
      const cutText = descriptionText.substr(0, maxLength) + ` ...`;
      return cutText;
    }
    return descriptionText;
  };

  const shortenDescription = shorten(description, maxLengthDescription);

  const filmComments = comments.map((value, index) => {
    const {text, author, date: commentDate, emotion} = comments[index];

    return `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
    </span>
    <div>
  <p class="film-details__comment-text">${text}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${dayjs(commentDate).format(`YYYY/MM/DD HH:mm`)}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`;
  }).join(``);


  const emojiRadio = emotions.map((value, index) => {
    const emotion = emotions[index];
    return `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emotion}" value="${emotion}">
    <label class="film-details__emoji-label" for="emoji-${emotion}">
      <img src="./images/emoji/${emotion}.png" width="30" height="30" alt="emoji">
    </label>`;
  }).join(``);

  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="./images/posters/${poster}" alt="">
          <p class="film-details__age">${ageLimit}</p>
        </div>
        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${filmName}</h3>
              <p class="film-details__title-original">${originalName}</p>
            </div>
            <div class="film-details__rating">
              <p class="film-details__total-rating">${rating}</p>
            </div>
          </div>
          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writers.join(`, `)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors.join(`, `)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${dayjs(date).format(`DD MMMM YYYY`)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${duration}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term genres">${insertGenreTitle}</td>
              <td class="film-details__cell">
              ${genres}
            </tr>
          </table>
          <p class="film-details__film-description">
            ${shortenDescription}
          </p>
        </div>
      </div>
      <section class="film-details__controls">
        <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist">
        <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>
        <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched">
        <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>
        <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite">
        <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
      </section>
    </div>
    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
        <ul class="film-details__comments-list">${filmComments}</ul>
        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label"></div>
          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>
          <div class="film-details__emoji-list"> ${emojiRadio}</div>
        </div>
      </section>
    </div>
  </form>
</section>`;
};
