
const storeUserData = function (userData) {
  if (!localStorage.getItem('userdata')) {
    const userInfo = JSON.stringify(userData);
    localStorage.setItem('userdata', userInfo);
  } 
}

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
    let allRequiredFieldPass = true;
    for(let numOfInput = 0; numOfInput < formControls.length; numOfInput++) {
      let inputField = formControls[numOfInput];
      const fieldName = inputField.name;
      const fieldValue = inputField.value.trim();
      const eleClass = inputField.getAttribute('class');
      if (eleClass.indexOf('required-field') > 0) {
        if (fieldValue.trim() === '') {
          allRequiredFieldPass = false;
          // change default green-outline to red-outline
          domElements.changeClassValue(inputField, "green-outline", "red-outline");
        }
        requestData = `${requestData}${fieldName}=${fieldValue}&`;
      } else {
      requestData = `${requestData}${fieldName}=${fieldValue}&`;
      }
    }
    if (allRequiredFieldPass) {
      const userData = storageHandler.getDataFromStore('userdata');
      if(requestData.indexOf(`username=${userData.username}`) >= 0) {
        // already has access token
        storageHandler.redirectUser(userData);
      } else {
        // no access token
        const headers =  new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Accept', 'application/json');
        const options = {
          headers,
          method: 'POST',
          body:requestData,
        }
        requestHandler.makeRequest('/api/v1/auth/signin', options, handleResponse);
      }
    } else {
      domElements.showConsoleModal('Please fill out the the required fields');
			domNotifier();
			return;
    }
  }
} // end processSignin

const domNotifier = function() {
  if(document.getElementById('console-modal-button')) {
    const consoleModalBtn = document.getElementById('console-modal-button');
    domElements.newEvent(consoleModalBtn, 'click', domElements.closeConsoleModal,  domElements);
  }

	if(document.getElementById('signin-button')) {
		const signinButton = document.getElementById('signin-button');
		domElements.newEvent(signinButton, 'click', processSignin, signinButton);
  }
  
  if(document.getElementsByClassName('red-outline')) {
		const requiredInputFields = document.getElementsByClassName('red-outline');
		for (let requiredField of requiredInputFields) {
			domElements.newEvent(requiredField, 'focus', domElements.resetRequiredFields, [requiredField, domElements]);
		}
	}
}

domNotifier();
