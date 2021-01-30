import AbstractView from './abstract-view';

const createUserIcon = (userRating) => {

  return `<section class="header__profile profile">
  ${userRating ? `<p class="profile__rating">${userRating}</p>` : ``}
  <img class="profile__avatar" src="./images/bitmap@2x.png" alt="Avatar" width="35" height="35">
</section>`;
};

export default class UserIconView extends AbstractView {
  constructor(userRating) {
    super();
    this._userRating = userRating;
  }

  getTemplate() {
    return createUserIcon(this._userRating);
  }
}
