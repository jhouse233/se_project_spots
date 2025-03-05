import { enableValidation, settings, resetValidation, disableButton, enableButton, checkInputValidity, toggleButtonState } from "../scripts/validation.js";
import "./index.css";
import Api from "../utils/Api.js";
import { handleSubmit, renderLoading, submitButton } from "../utils/helpers.js";


const initialCards = [
  {name: "Val Thorens", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg"},
  {name: "Restaurant terrace", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg"},
  {name: "An outdoor cafe", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg"},
  {name: "A very long bridge, over the forest and through the trees", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg"},
  {name: "Tunnel with morning light", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg"},
  {name: "Mountain house", link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg"},
  {name: "Golden Gate Bridge", link: " https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg"},
];


// Profile Elements
const profileEditButton = document.querySelector(".profile__edit-btn");
const cardModalButton = document.querySelector(".profile__add-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

const profileImage = document.querySelector(".profile__avatar");

const avatarModalButton = document.querySelector(".profile__avatar-btn");
const avatarModal = document.querySelector("#avatar-modal");
const avatarFormElement = document.forms["avatar-form"]
const avatarLinkInput = avatarModal.querySelector("#profile-avatar-input");

// Form Elements
const editProfileModal = document.querySelector("#edit-profile-modal");
const editFormElement = document.forms["edit-profile"];
const editModalCloseButton = editProfileModal.querySelector(".modal__close-button");
const editModalNameInput = editProfileModal.querySelector("#profile-name-input")
const editModalDescriptionInput = editProfileModal.querySelector("#profile-description-input");

const cardModal = document.querySelector("#add-card-modal");
const cardForm = document.forms["add-card-form"];
const cardModalCloseButton = cardModal.querySelector(".modal__close-button");
const cardNameInput = cardModal.querySelector("#add-card-name-input")
const cardLinkInput = cardModal.querySelector("#add-card-link-input")

const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const prewviewModalCaptionEl = previewModal.querySelector(".modal__caption");

// Card Elements
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

let selectedCard, selectedCardId;

// Find all close buttons
const closeButtons = document.querySelectorAll(".modal__close-button");
const overlays = document.querySelectorAll(".modal");

// Button
// const newPostSubmitButton = cardModal.querySelector(".modal__submit-button");

// Delete Elements
const deleteModal = document.querySelector("#delete-modal");
const deleteFormElement = document.forms["delete-form"];
const cancelModalButton = document.querySelector(".modal__cancel-button");


const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "86791c20-9d4f-454f-8fbf-404808c3c6e4",
    "Content-Type": "application/json"
  }
});

api.getAppInfo()
  .then(([cards, userInfo]) => {
    cards.forEach((item) => {
      renderCard(item);
    });
    profileName.textContent = userInfo.name;
    profileDescription.textContent = userInfo.about;
    profileImage.src = userInfo.avatar;

    if (userInfo.avatar) {
      profileImage.src = userInfo.avatar;
    } else {
      profileImage.src = "../src/images/avatar.jpg";
    }
  })
  .catch(console.error);

// Connects the individual parts of the card elements to the template
function getCardElement(data){
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImage = cardElement.querySelector(".card__image");
  const cardLikeButton = cardElement.querySelector(".card__like-button")
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");

  cardNameEl.textContent = data.name;
  cardImage.src = data.link;
  cardImage.alt = data.name;

  if (data.isLiked) {
    cardLikeButton.classList.add("card__like-button_liked");
  }

  cardLikeButton.addEventListener("click", (evt) => handleLikeCard(evt, data._id));
  cardDeleteButton.addEventListener("click", () => {handleDeleteCard(cardElement, data._id)});

  cardImage.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImageEl.src = data.link;
    previewModalImageEl.alt = data.name;
    prewviewModalCaptionEl.textContent = data.name;
  });

  return cardElement;
}

function renderCard(item, method = "prepend") {
  const cardElement = getCardElement(item);
  cardsList[method](cardElement);
}

// Open Modal
function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscapeKey);
}
// Close Modal
function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscapeKey);

  // Adding enableButton here
  const submitButton = modal.querySelector(settings.submitButtonSelector)
  if (submitButton) enableButton(submitButton, settings.inactiveButtonClass)
}

// Escape Key Close
function handleEscapeKey(evt) {
  if (evt.key === "Escape") {
    const currentModal = document.querySelector(".modal_opened");
    if (currentModal) {
      closeModal(currentModal);
    }
  }
}

// Iterate over modal overlay to add click outside of content
overlays.forEach((modal) => {
  modal.addEventListener("click", (evt) => {
    if (evt.target === modal && modal.classList.contains("modal_opened")) {
      closeModal(modal);
    }
  });
});

// Edit Profile
// ---------------------------
function handleEditFormSubmit(evt) {
  handleSubmit(updateEditProfileForm, evt, 'Saving. . .', settings.inactiveButtonClass);
}

function updateEditProfileForm() {

  return api.editUserInfo({
    name: editModalNameInput.value,
    about: editModalDescriptionInput.value
  })
    .then((userInfo) => {

      profileName.textContent = userInfo.name;
      profileDescription.textContent = userInfo.about;
      closeModal(editProfileModal);
      // disableButton(editFormElement.querySelector(settings.submitButtonSelector), settings.inactiveButtonClass)

    })
    .catch(console.error)

}
// -------------------------------

// New Post --------------------
function handleAddCardSubmit(evt) {
  handleSubmit(addCardReq, evt, "Saving. . .")
}

function addCardReq() {
  return api.addNewCard({name: cardNameInput.value, link: cardLinkInput.value})
    .then(renderCard)
    .then(() => closeModal(cardModal));
}
// ------------------------------

// Avatar  - - - - - - - -
function handleAvatarSubmit(evt) {
  handleSubmit(addAvatarReq, evt, "Saving. . .",settings.inactiveButtonClass)
}

function addAvatarReq(){
  return api.editUserAvatar({ avatar: avatarLinkInput.value })
    .then((userPic) => {
      profileImage.src = userPic.avatar;
      closeModal(avatarModal);
      // disableButton(editFormElement.querySelector(settings.submitButtonSelector), settings.inactiveButtonClass)
    })

}
// - - - - - - - -- - - - - - - -

// Delete - - - - - - - - -

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}
// function handleDeleteSubmit(evt) {
//   handleSubmit(addDeleteReq, evt, "Deleting. . . ");
// }

function handleDeleteSubmit(evt) {
  evt.preventDefault();

  const submitButton = evt.submitter;
  if (!submitButton) return;

  renderLoading(true, submitButton, "Deleting...");

  api.deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);


      enableButton(submitButton, settings.inactiveButtonClass);
    })
    .catch(console.error)
    .finally(() => {
      renderLoading(false, submitButton, "Delete");
    });
}

// function addDeleteReq() {

//   return api.deleteCard(selectedCardId)
//     .then(() =>{
//       selectedCard.remove();
//       closeModal(deleteModal);
//       // enableButton(settings.inactiveButtonClass)
//     })
// }
// - - - - - - - - - - - - - - - - - -


function handleLikeCard(evt, id) {
  const isLiked = evt.target.classList.contains("card__like-button_liked")
  api.toggleLike(id, isLiked)
    .then((data) => {
      data.isLiked = !isLiked;
      evt.target.classList.toggle("card__like-button_liked");
    })
    .catch(console.error);
}

//Events
profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;

  resetValidation(editFormElement, settings);
  // resetValidation(editFormElement, [editModalNameInput, editModalDescriptionInput], settings)

  openModal(editProfileModal);

});


cardModalButton.addEventListener("click", () => {
  resetValidation(cardForm, settings)
  openModal(cardModal);
});

avatarModalButton.addEventListener("click", () => {
  openModal(avatarModal)
});

closeButtons.forEach((button) => {
  const popup = button.closest(".modal");
  button.addEventListener("click", () => closeModal(popup))
});

cancelModalButton.addEventListener("click", () => {
  closeModal(deleteModal);
});


avatarFormElement.addEventListener("submit", handleAvatarSubmit);
editFormElement.addEventListener("submit", handleEditFormSubmit);
deleteFormElement.addEventListener("submit", handleDeleteSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);


enableValidation(settings);