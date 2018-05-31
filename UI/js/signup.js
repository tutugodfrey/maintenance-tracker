
// process server response
const handleResponse = function(responseData) {
	console.log(responseData);
	if(responseData.isAdmin === true  || responseData.isAdmin === 'on') {
		window.location.href= './admin/dashboard.html';
	} else {
		window.location.href = './users/dashboard.html';
	}
}

// user signup
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
		} else {
			console.log('i am here')
			makeRequest(formData, 'POST', '/api/v1/auth/signin', handleResponse)
		} 
	}
}