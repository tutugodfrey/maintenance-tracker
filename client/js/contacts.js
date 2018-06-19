
const handlePostMessage = (responseData) => {
  if (responseData.message) {
    domElements.showConsoleModal(responseData.message);
    return;
  }
  domElements.showConsoleModal('You message has been received!');
}

const sendMessage = (ele) => {
  if (document.getElementsByClassName('message-info')) {
    const formControls = document.getElementsByClassName('message-info');
    let formInfo = '';
    let allRequiredFieldPass = true;
    for(let numOfInput = 0; numOfInput < formControls.length; numOfInput++) {
      let inputField = formControls[numOfInput];
      const fieldName = inputField.name;
      const fieldValue = inputField.value.trim();
      const eleClass = inputField.getAttribute('class');
      if (eleClass.indexOf('required-field') >= 0) {
        if (fieldValue.trim() === '' || fieldValue.trim() === 'select' ) {

          allRequiredFieldPass = false;
          // change default green-outline to red-outline
          domElements.changeClassValue(inputField, "green-outline", "red-outline");
        }
        formInfo = `${formInfo}${fieldName}=${fieldValue}&`;
      } else {
        formInfo = `${formInfo}${fieldName}=${fieldValue}&`;
      }
    }
    if (allRequiredFieldPass) {
      requestHandler.postRequests('/api/v1/contacts', formInfo, storageHandler, handlePostMessage)
    } else {
      domElements.showConsoleModal('Please fill out the the required fields');
			domNotifier();
			return;
    }
  }
} // end sendMessage


