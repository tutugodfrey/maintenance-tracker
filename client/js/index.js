const domElements = new DomElementActions();
const storageHandler = new StorageHandler();
const requestHandler = new RequestHandler();

// process server response
const handleResponse = (responseData) => {
  if (responseData.message) {
    domElements.showConsoleModal(responseData.message);
    return;
  } else {
    storageHandler.storeData(responseData, 'userdata');
    storageHandler.redirectUser(responseData);
  }
}
const processSignin = (ele) => {
  if (document.getElementsByClassName('form-control')) {
    const formControls = document.getElementsByClassName('form-control');
    let requestData = '';
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
        requestData = `${requestData}${fieldName}=${fieldValue}&`;
      } else {
      requestData = `${requestData}${fieldName}=${fieldValue}&`;
      }
    }
    const headers =  new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Accept', 'application/json');
    const options = {
      headers,
      method: 'POST',
      body:requestData,
    }
    requestHandler.makeRequest('/api/v1/auth/signin', options, handleResponse)
  }
} // end processSignin

const domNotifier = () => { 
 // localStorage.removeItem('userdata')
  // console modal
  const userData = storageHandler.getDataFromStore('userdata');
  storageHandler.redirectUser(userData);
  if(document.getElementById('console-modal-button')) {
    const consoleModalBtn = document.getElementById('console-modal-button');
    domElements.newEvent(consoleModalBtn, 'click', domElements.closeConsoleModal,  domElements);
  }

  if(document.getElementById('inline-signin-button')) {
		const signinButton = document.getElementById('inline-signin-button');
		domElements.newEvent(signinButton, 'click', processSignin, signinButton);
	}
}

domNotifier();