
const domElements = new DomElementActions();
const storageHandler = new StorageHandler();
const requestHandler = new RequestHandler();
let updatingRequest = false;
let idOfRequestToUpdate;
// process server response
const handleCreateRequest = function(responseData) {
  if (responseData.message) {
    domElements.showConsoleModal(responseData.message);
    return
  }
  domElements.showConsoleModal('Your request has been recorded');
  if (updatingRequest) {
    updatingRequest = false;
  }
}

const displayServices = (responseData) => {
  if (responseData.message) {
    domElements.showConsoleModal();
    return;
  }
  if (document.getElementById('services')) {
    const services = document.getElementById('services');
    responseData.forEach((service) => {
      if (document.getElementsByTagName('option')) {
        let servicePresent = false;
        const oldOptions = document.getElementsByTagName('option');
        for(let sizeOfOption = 0; sizeOfOption < oldOptions.length; sizeOfOption++) {
          if (parseInt(oldOptions[sizeOfOption].value) === service.id) {
            servicePresent = true;
          }
        }
        if (!servicePresent) {
          const options = document.createElement('option');
          options.innerHTML = service.servicename;
          options.value = service.id;
          services.appendChild(options);
          servicePresent = false;
        }
      }
    })
  }
}

const displayRequests = (responseData) => {
  if (responseData.message === 'Invalid Token' || responseData.message === 'Please send a token') {
    storageHandler.redirectUser(responseData)
  }
  if (responseData.message) {
    domElements.showConsoleModal(responseData.message);
    return;
  }
  if (Array.isArray(responseData)) {
    if(responseData.length === 0) {
      domElements.showConsoleModal('You have not made any repair request');
    } else {
      const storageResult = storageHandler.storeData(responseData, 'usersrequests');
      const displayRequestTab = document.getElementById('view-users-requests');
      domElements.displayUsersRequest(responseData, displayRequestTab);
    }
  }
  domNotifier();
}

const getServices = () => {
  const headers =  new Headers();
  headers.append('Content-Type', 'application/x-www-form-urlencoded');
  const options = {
    headers,
    method: 'GET',
  }
  requestHandler.makeRequest('/api/v1/auth/services', options, displayServices);
}

const createRequest = function(ele) {
	if (document.getElementsByClassName('form-control')) {
		const formControls = document.getElementsByClassName('request-data');
    let requestString = '';
		for(let numOfInput = 0; numOfInput < formControls.length; numOfInput++) {
      let inputField = formControls[numOfInput];
      if (inputField.type === 'checkbox') {
        const checkboxData = domElements.getCheckboxValue(inputField);
        requestString = `${requestString}${checkboxData[0]}=${checkboxData[1]}&`;
			} else {
        const fieldName = inputField.name;
        const fieldValue = inputField.value.trim();
        const eleClass = inputField.getAttribute('class');
        if (eleClass.indexOf('required-field') > 0) {
          if (fieldValue.trim() === '') {
            domElements.showConsoleModal('Please fill out the the required fields');
            return;
          }
          requestString = `${requestString}${fieldName}=${fieldValue}&`;
        } else {
          requestString = `${requestString}${fieldName}=${fieldValue}&`;
        }
      }
    }
    let method;
    if(updatingRequest) {
      method = 'PUT';
    } else {
      method = 'POST'
    }
    const headers =  new Headers();
    const userData = storageHandler.getDataFromStore('userdata')
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Accept', 'application/json');
    headers.append('token', userData.token);
    const options = {
      headers,
      method,
      body:requestString,
    }
    if(updatingRequest) {
      requestHandler.makeRequest(`/api/v1/users/requests/${idOfRequestToUpdate}`, options, handleCreateRequest);
    } else {
      requestHandler.makeRequest('/api/v1/users/requests', options, handleCreateRequest);
    }
	}
}

const getRequestToEdit = (editBtn) => {
  const requests = storageHandler.getDataFromStore('usersrequests');
  const requestId = parseInt(editBtn.value);
  let requestToEdit;
  requests.filter((request) => {
    if (request.id === requestId) {
      requestToEdit = request;
      return
    }
  });

  // show tab with request info
  if (document.getElementById('request-repair')) {
    const requestForm = document.getElementById('request-repair');
    domElements.changeClassValue(requestForm, 'hide-item', 'show-item');
    const description = document.getElementById('description');
    const address = document.getElementById('address');
    description.value = requestToEdit['description'];
    address.value = requestToEdit['address'];
    updatingRequest = true;
    idOfRequestToUpdate =  requestId;
  }
  // hide this tab
  if(document.getElementById('view-users-requests')) {
    const displayRequestTab = document.getElementById('view-users-requests');
    domElements.changeClassValue(displayRequestTab, 'show-item', 'hide-item');
  }
}

let eventListenerAdded = false;
let displayRequestCalled = false;
let eventListenerAddedToEditRequest = false;
const domNotifier = function() {
 // localStorage.removeItem('requests')
 // localStorage.removeItem('userdata');

  if(document.getElementById('request-repair')) {
    const displayRequestTab = document.getElementById('request-repair');
    const displayRequestClass = displayRequestTab.getAttribute('class');
    if (displayRequestClass.indexOf('show') >= 0) {
      getServices();
    }
  }

	if(document.getElementById('request-button')) {
		const createRequestBtn = document.getElementById('request-button');
		domElements.newEvent(createRequestBtn, 'click', createRequest, createRequestBtn,);
  }

	if(document.getElementById('console-modal-button')) {
    const consoleModalBtn = document.getElementById('console-modal-button');
    domElements.newEvent(consoleModalBtn, 'click', domElements.closeConsoleModal,  domElements);
  }
  
  if(document.getElementById('toggle-navigation-btn')) {
    const toggleNavBtn = document.getElementById('toggle-navigation-btn');
      domElements.newEvent(toggleNavBtn, 'click', domElements.showNavigation, [domElements, toggleNavBtn]);
  }

  if(document.getElementsByClassName('nav-link')) {
    const navItems = document.getElementsByClassName('nav-link');
    if (eventListenerAdded) {
      // this prevent eventListener from being readded to this elements 
      // resulting in multiple calls to the domNotifier
    } else {
      for(let size = 0; size < navItems.length; size++) {
        domElements.newEvent(navItems[size], 'click', domElements.tabNavigation, [domElements, navItems[size]]);
      }
      eventListenerAdded = true;
    } 
  }

    if(document.getElementById('signout-item')) {
    const signoutLink = document.getElementById('signout-item');
      domElements.newEvent(signoutLink, 'click', storageHandler.signout);
  }

  if(document.getElementById('default-nav')) {
    // get the default nav item
    const defaultNav = document.getElementById('default-nav');
    const anchorPos = defaultNav.href.indexOf('#');
    domElements.defaultNavItem = defaultNav.href.substring(anchorPos + 1);
  }

  // get users request
  if(document.getElementById('view-users-requests')) {
    const displayRequestTab = document.getElementById('view-users-requests');
    const displayRequestClass = displayRequestTab.getAttribute('class');
    if (displayRequestClass.indexOf('hide-item') >= 0) {
      displayRequestCalled = false;
    }
    if (displayRequestClass.indexOf('show') >= 0) {
      const usersRequest = storageHandler.getDataFromStore('usersrequests');
      // will uncomment this block when feature to use request stored in local storage is finished
      // such that users can always get an updated version of their request details
    if(!displayRequestCalled) {
      /*  if (Array.isArray(usersRequest)) {
          domElements.displayUsersRequest(usersRequest, displayRequestTab)
        } else { */
        // get request
      requestHandler.getRequests('/api/v1/users/requests', storageHandler, displayRequests);
    // }
      displayRequestCalled = true;
    } 
   }
 }

  // updating a request
 	  if(document.getElementsByClassName('edit-request')) {
    const editRequestBtn = document.getElementsByClassName('edit-request');
    if (eventListenerAddedToEditRequest) {
      // this prevent eventListener from being readded to this elements 
      // resulting in multiple calls to the domNotifier
    } else {
      if (editRequestBtn.length > 0) {
        for(let size = 0; size < editRequestBtn.length; size++) {
          domElements.newEvent(editRequestBtn[size], 'click', getRequestToEdit, editRequestBtn[size]);
        }
        eventListenerAddedToEditRequest = true;
      }
    } 
  }

}

domNotifier()
