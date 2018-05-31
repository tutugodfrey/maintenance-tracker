
// listen for events on any elementObject
const newEvent = function (elementObject,  eventType, callBack, callBackArgument) {
  elementObject.addEventListener(eventType, function(event) {
  event.preventDefault(); 
    if(callBackArgument === undefined) {
      callBack();
    } else {
      callBack(callBackArgument);
    }
  },
  false );
}   // end newEvent

const storeUserData = function (userData, keyString) {
  if (!localStorage.getItem(keyString)) {
    const userInfo = JSON.stringify(userData);
    localStorage.setItem(keyString, userInfo);
  } 
}

const getUserData = function (key) {
  if (localStorage.getItem(key)) {
    let userInfo = localStorage.getItem(key);
    userInfo = JSON.parse(userInfo);
    return userInfo;
  } 
}


const userData = getUserData('userdata');

const makeRequest = function (requestData, method, url, callback) {
  const token = userData.token;
	const headers =  new Headers();
 	headers.append('Content-Type', 'application/x-www-form-urlencoded');
  headers.append('Accept', 'application/json');
  headers.append('token', token)
  	const options = {
    method,
    headers,
    body:requestData,
  }
	fetch(url, options)
  .then(res => res.json())
  .then(data => {
    callback(data)
  })
  .catch(error => console.log(error));
}

const showConsoleModal = function(message) {
  if(document.getElementById('console-modal')) {
    const consoleModal = document.getElementById('console-modal');
    const messageBox = document.getElementById('message-box');
    messageBox.innerHTML = message;
    let consoleModalClass = consoleModal.getAttribute('class');
    consoleModalClass = consoleModalClass.replace('hide-item', 'show-item');
    consoleModal.setAttribute('class', consoleModalClass);
  }
}

const closeConsoleModal = function(message) {
  if(document.getElementById('console-modal')) {
    const consoleModal = document.getElementById('console-modal');
    let consoleModalClass = consoleModal.getAttribute('class');
    consoleModalClass = consoleModalClass.replace('show-item', 'hide-item');
    consoleModal.setAttribute('class', consoleModalClass);
  }
}

// process server response
const handleResponse = function(responseData) {
  storeUserData(responseData, 'requests')
  showConsoleModal('Your request has been recorded')
}
const createRequest = function(ele) {
	if (document.getElementsByClassName('form-control')) {
		const formControls = document.getElementsByClassName('request-data');
    let jsonRequest = '';
		let fileAvailable = false;
		for(let numOfInput = 0; numOfInput < formControls.length; numOfInput++) {
			let inputField = formControls[numOfInput];
			const fieldName = inputField.name;
			const fieldValue = inputField.value.trim();
			const eleClass = inputField.getAttribute('class');
			if (eleClass.indexOf('required-field') > 0) {
				if (fieldValue.trim() === '') {
          showConsoleModal('Please fill out the the required fields');
          showConsoleModal('Please fill out the the required fields');
          return;
        }
        jsonRequest = `${jsonRequest}${fieldName}=${fieldValue}&`;
      } else {
      jsonRequest = `${jsonRequest}${fieldName}=${fieldValue}&`;
      }
    }

    jsonRequest = `${jsonRequest}userId=${userData.id}`;
		makeRequest(jsonRequest, 'POST', '/api/v1/users/requests', handleResponse)
			makeRequest(jsonRequest, 'POST', '/api/v1/users/requests', handleResponse);
	}
}


const domNotifier = function() {
	if(document.getElementById('request-button')) {
		const createRequestBtn = document.getElementById('request-button');
		newEvent(createRequestBtn, 'click', createRequest, createRequestBtn,);
  }
  
  // user signup
  if(document.getElementById('console-modal-button')) {
    const consoleModalBtn = document.getElementById('console-modal-button');
    newEvent(consoleModalBtn, 'click', closeConsoleModal, consoleModalBtn);
  }
}

domNotifier()