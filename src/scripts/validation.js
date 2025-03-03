export const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-button",
  inactiveButtonClass: "modal__submit-button_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_inactive"
}

export const showInputError = (formElement, inputElement, errorMessage, config) => {
  const errorMessageElement = formElement.querySelector(`#${inputElement.id}-error`);
  inputElement.classList.add(config.inputErrorClass);
  errorMessageElement.textContent = errorMessage;
  errorMessageElement.classList.remove(config.errorClass);
};

export const hideInputError = (formElement, inputElement, config) => {
  const errorMessageElement = formElement.querySelector(`#${inputElement.id}-error`);

  errorMessageElement.textContent = "";
  errorMessageElement.classList.add(config.errorClass);
  inputElement.classList.remove(config.inputErrorClass);

};

export function checkInputValidity(formElement, inputElement, config) {
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage, config);
  } else {
    hideInputError(formElement, inputElement, config);
  }
};

export const hasInvalidInput = (inputList) => {
  return inputList.some((input) => {
    return !input.validity.valid;
  });
};

export function disableButton(buttonElement, inactiveButtonClass) {
  if(!buttonElement) return;
  buttonElement.classList.add(inactiveButtonClass)
  buttonElement.disabled = true;
  console.log("Button should be disabled", buttonElement);
}


export const toggleButtonState = (inputList, buttonElement, config) => {
  // console.log(hasInvalidInput(inputList));
  if (hasInvalidInput(inputList)) {
    buttonElement.disabled = true;
    buttonElement.classList.add(config.inactiveButtonClass);
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove(config.inactiveButtonClass);
  }
};

// export const disableButton = (buttonElement, config) => {
//   if (buttonElement) {
//     buttonElement.disabled = true;
//     buttonElement.classList.add(config.inactiveButtonClass)
//   }
// }

//   buttonElement.disabled = true;
//   buttonElement.classList.add(config.inactiveButtonClass);
// }

export const resetValidation = (formElement, config) => {
  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
  const buttonElement = formElement.querySelector(config.submitButtonSelector);
  inputList.forEach((input) => {
    hideInputError(formElement, input, config);
  });
  // toggleButtonState(inputList, buttonElement, config);
  disableButton(buttonElement, config.inactiveButtonClass);

  formElement.reset();
};



export const setEventListeners = (formElement, config) => {
  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
  const buttonElement = formElement.querySelector(config.submitButtonSelector);


  toggleButtonState(inputList, buttonElement, config);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", function () {
      checkInputValidity(formElement, inputElement, config);
      toggleButtonState(inputList, buttonElement, config);
    });
  });

  formElement.addEventListener("reset", () => {
    resetValidation(formElement, config);
  })
};


export const enableValidation = (config) => {
  const formList = Array.from(document.querySelectorAll(config.formSelector));
  formList.forEach((formElement) => {
    setEventListeners(formElement, config);
  });
};

// enableValidation(settings);