import AbstractView from './abstract-view';

const createUserIcon = (raiting, avatar) => {
  return `<section class="header__profile profile">
  <p class="profile__rating">${raiting}</p>
  <img class="profile__avatar" src="${avatar}" alt="Avatar" width="35" height="35">
</section>`;
};

export default class UserIcon extends AbstractView {
  constructor(raiting, avatar) {
    super();
    this._userRaiting = raiting;
    this._userAvatar = avatar;
  }

  getTemplate() {
    return createUserIcon(this._userRaiting, this._userAvatar);
  }
}
