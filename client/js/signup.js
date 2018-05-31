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

const storeUserData = function (userData) {
  if (!localStorage.getItem('userdata')) {
    const userInfo = JSON.stringify(userData);
    localStorage.setItem('userdata', userInfo);
    console.log('user data stored');
  } 
}

const makeRequest = function (requestData, method, url, callback) {
	const headers =  new Headers();
 	headers.append('Content-Type', 'application/json');
 	headers.append('Accept', 'application/json');
  	const options = {
    method,
    body:requestData,
  }
	fetch(url, options)
  .then(res => res.json())
  .then(data => {
    callback(data)
  })
  .catch(error => console.log(error));
}


// process server response
const handleResponse = function(responseData) {
  storeUserData(responseData)
	console.log(responseData);
	if(responseData.isAdmin === true  || responseData.isAdmin === 'on') {
		window.location.href= './admin/dashboard.html';
	} else {
		window.location.href = './users/dashboard.html';
	}
}

const processSignUp = function(ele) {
	if (document.getElementsByClassName('form-control')) {
		const formControls = document.getElementsByClassName('form-control');
		const formData = new FormData();
		const jsonRequest = {}
		let fileAvailable = false;
		for(let numOfInput = 0; numOfInput < formControls.length; numOfInput++) {
			let inputField = formControls[numOfInput];
			if (inputField.type === 'file') {
				fileAvailable = true;
			}
			const fieldName = inputField.name;
			const fieldValue = inputField.value.trim();
			const eleClass = inputField.getAttribute('class');
			if (eleClass.indexOf('required-field') > 0) {
				if (fieldValue === '') {
					console.log('required Field')
					return 'Please fill out the the required fields';
				}
			}
			jsonRequest[fieldName] = fieldValue;
			formData.append(fieldName, fieldValue);
			console.log(jsonRequest)
		}
		 // const data = JSON.stringify(jsonRequest)
		if(fileAvailable) {
			makeRequest(formData, 'POST', '/api/v1/auth/signup', handleResponse)
		} 
	}
}

const domNotifier = function() {
	if(document.getElementById('signup-button')) {
		const signupButton = document.getElementById('signup-button');
		newEvent(signupButton, 'click', processSignUp, signupButton);
	}
}

domNotifier()
