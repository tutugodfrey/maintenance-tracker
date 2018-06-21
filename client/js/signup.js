
// process server response
const handleResponse = (responseData) => {
	console.log(responseData);
  if (responseData.message) {
    domElements.showConsoleModal(responseData.message);
    return;
  } else {
    storageHandler.storeData(responseData, 'userdata');
		storageHandler.redirectUser(responseData);
  }
}

const processSignUp = function(ele) {
	if (document.getElementsByClassName('form-control')) {
		const formControls = document.getElementsByClassName('form-control');
		const formData = new FormData();
		const emailRegExp = /\w+@\w+\.(net|com|org)/;
		let password = '';
		let confirmPassword = '';
		let fileAvailable = false;
		let allRequiredFieldPass = true;
		let emailPass = true;
		let passwordPass = true;
		for(let numOfInput = 0; numOfInput < formControls.length; numOfInput++) {
			let inputField = formControls[numOfInput];
			if (inputField.type === 'file') {
				fileAvailable = true;
				const fileObj = inputField.files[0];
				const fieldName = inputField.name;
				formData.append(fieldName, fileObj);
			} else if (inputField.type === 'checkbox') {
				const checkboxData = domElements.getCheckboxValue(inputField);
				formData.append(checkboxData[0], checkboxData[1]);
			} else {
				const fieldName = inputField.name;
				const fieldValue = inputField.value.trim();
				const eleClass = inputField.getAttribute('class');
				if (eleClass.indexOf('required-field') > 0) {
					if (fieldValue.trim() === '') {
						allRequiredFieldPass = false;
						// change default green-outline to red-outline
						domElements.changeClassValue(inputField, "green-outline", "red-outline");
					}
					if (fieldName === 'email' && !fieldValue.match(emailRegExp)) {
						emailPass = false;
						// change default green-outline to red-outline
						domElements.changeClassValue(inputField, "green-outline", "red-outline");
					}
					if (fieldName === 'password') {
						password = fieldValue;
					}
					if (fieldName === 'confirmPassword') {
						confirmPassword = fieldValue;
					}
					if (password !== confirmPassword) {
						passwordPass = false;
					} else {
						passwordPass = true;
					}
				}
				formData.append(fieldName, fieldValue);
			}
		}
		if (allRequiredFieldPass && emailPass && passwordPass) {
			if (fileAvailable) {
				const headers =  new Headers();
				headers.append('Content-Type', 'application/json');
				const options = {
					method: 'POST',
					body:formData,
				}
				requestHandler.makeRequest('/api/v1/auth/signup', options, handleResponse);
			}
		} else if (!allRequiredFieldPass) {
			domElements.showConsoleModal('Please fill out the the required fields');
			domNotifier();
			return;
		} else if (!emailPass) {
			domElements.showConsoleModal('Invalid email format');
			domNotifier();
			return;
		} else if (!passwordPass) {
			domElements.showConsoleModal('Please enter matching password');
			domNotifier();
			return;
		}
	}
}

const domNotifier = function() {
	// localStorage.removeItem('userdata');
	if (document.getElementById('console-modal-button')) {
    const consoleModalBtn = document.getElementById('console-modal-button');
    domElements.newEvent(consoleModalBtn, 'click', domElements.closeConsoleModal,  domElements);
	}
	
	if (document.getElementById('signup-button')) {
		const signupButton = document.getElementById('signup-button');
		domElements.newEvent(signupButton, 'click', processSignUp, signupButton);
	}

	if(document.getElementsByClassName('red-outline')) {
		const requiredInputFields = document.getElementsByClassName('red-outline');
		for (let requiredField of requiredInputFields) {
			domElements.newEvent(requiredField, 'focus', domElements.resetRequiredFields, [requiredField, domElements]);
		}
	}
}

 domNotifier()
