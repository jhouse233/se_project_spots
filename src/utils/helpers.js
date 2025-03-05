import { disableButton, enableButton, resetValidation, settings, toggleButtonState } from "../scripts/validation";
// import { deleteFormElement} from "../pages/index.js"


export function renderLoading(isLoading, button, defaultText='Save' , loadingText="Saving. . .") {
  if (isLoading) {
    button.textContent = loadingText;
  } else {
    button.textContent = defaultText;
  }
}

export function handleSubmit(request, evt, loadingText = 'Saving...', inactiveButtonClass) {
  evt.preventDefault();

  const submitButton = evt.submitter;

  if (!submitButton) return;

  const initialText = submitButton.textContent;
  renderLoading(true, submitButton, initialText, loadingText);
  request()
    .then(() => {
      evt.target.reset();
      disableButton(submitButton, inactiveButtonClass)
      // evt.target.addEventListener("input", () => enableButton(submitButton, inactiveButtonClass), { once: true})
    })
    .finally(() => {
      renderLoading(false, submitButton, initialText);
    });
}

// export function handleSubmit(request, evt, loadingText = "Saving...", inactiveButtonClass, formElement) {
//   evt.preventDefault();

//   const submitButton = evt.submitter;
//   if (!submitButton) return;

//   const initialText = submitButton.textContent;
//   renderLoading(true, submitButton, initialText, loadingText);

//   request()
//     .then(() => {
//       // Special handling for delete forms
//       if (formElement === deleteFormElement) {
//         selectedCard.remove();
//         closeModal(deleteModal);
//       } else {
//         evt.target.reset();
//       }

//       disableButton(submitButton, inactiveButtonClass);
//     })
//     .catch(console.error)
//     .finally(() => {
//       renderLoading(false, submitButton, initialText);

//
//       evt.target.addEventListener("input", () => enableButton(submitButton, inactiveButtonClass), { once: true });
//     });
// }