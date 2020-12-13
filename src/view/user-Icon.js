export const createUserIcon = (avatar, raiting) => {
  return `<section class="header__profile profile">
  <p class="profile__rating">${raiting}</p>
  <img class="profile__avatar" src="${avatar}" alt="Avatar" width="35" height="35">
</section>`;
};
