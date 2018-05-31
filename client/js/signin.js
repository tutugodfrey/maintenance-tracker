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
  } 
}

const makeRequest = function (requestData, method, url, callback) {
	const headers =  new Headers();
  headers.append('Content-Type', 'application/x-www-form-urlencoded');
 	headers.append('Accept', 'application/json');
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


// process server response
const handleResponse = function(responseData) {
  storeUserData(responseData);
  if (responseData.isAdmin === true  || responseData.isAdmin === 'on') {
    window.location.href= '/admin/dashboard.html';
  } else if(responseData.isAdmin === false) {
    window.location.href = '/users/dashboard.html';
  } 
}

const processSignIn = function(ele) {
	if (document.getElementsByClassName('form-control')) {
		const formControls = document.getElementsByClassName('form-control');
    let requestString = '';
		for(let numOfInput = 0; numOfInput < formControls.length; numOfInput++) {
			let inputField = formControls[numOfInput];
			const fieldName = inputField.name;
			const fieldValue = inputField.value.trim();
			const eleClass = inputField.getAttribute('class');
			if (eleClass.indexOf('required-field') > 0) {
				if (fieldValue.trim() === '') {
          showConsoleModal('Please fill out the the required fields');
          return;
        }
        requestString  = `${requestString }${fieldName}=${fieldValue}&`;
      } else {
        requestString  = `${requestString }${fieldName}=${fieldValue}&`;
      }
    }
    makeRequest(requestString , 'POST', '/api/v1/auth/signin', handleResponse)
  }
}

const domNotifier = function() {
	if(document.getElementById('signin-button')) {
		const signinButton = document.getElementById('signin-button');
		newEvent(signinButton, 'click', processSignIn, signinButton);
	}
}

domNotifier();
