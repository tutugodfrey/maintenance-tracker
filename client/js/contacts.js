
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
    let fileAvailable = false;
    for(let numOfInput = 0; numOfInput < formControls.length; numOfInput++) {
      let inputField = formControls[numOfInput];
      const fieldName = inputField.name;
      const fieldValue = inputField.value.trim();
      const eleClass = inputField.getAttribute('class');
      if (eleClass.indexOf('required-field') > 0) {
        if (fieldValue.trim() === '') {
          domElements.showConsoleModal('Please fill out the the required fields');
          return;
        }
        formInfo = `${formInfo}${fieldName}=${fieldValue}&`;
      } else {
        formInfo = `${formInfo}${fieldName}=${fieldValue}&`;
      }
    }
    requestHandler.postRequests('/api/v1/contacts', formInfo, storageHandler, handlePostMessage)
  }
} // end sendMessage
