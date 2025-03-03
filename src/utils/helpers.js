import { disableButton, resetValidation, settings, toggleButtonState } from "../scripts/validation";

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

      setTimeout(() => {
        disableButton(submitButton, inactiveButtonClass);
      }, 100);

    })
    .catch(console.error)
    .finally(() => {
      renderLoading(false, submitButton, initialText);
    });
}