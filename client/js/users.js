
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
    domElements.showConsoleModal(responseData.message);
    return;
  }
  if (document.getElementById('services')) {
    const services = document.getElementById('services');
    responseData.forEach((service) => {
      if (document.getElementsByClassName('services')) {
        let servicePresent = false;
        const oldOptions = document.getElementsByClassName('services');
        for(let sizeOfOption = 0; sizeOfOption < oldOptions.length; sizeOfOption++) {
          if (parseInt(oldOptions[sizeOfOption].value) === service.id) {
            servicePresent = true;
          }
        }
        if (!servicePresent) {
          const options = document.createElement('option');
          options.innerHTML = service.serviceName;
          options.value = service.id;
          options.className = 'services';
          services.appendChild(options);
          servicePresent = false;
        }
      }
    });
  } // end servives

  if (document.getElementById('services2')) {
    const services = document.getElementById('services2');
    responseData.forEach((service) => {
      if (document.getElementsByClassName('services2')) {
        let service2Present = false;
        const oldOptions = document.getElementsByClassName('services2');
        for(let sizeOfOption = 0; sizeOfOption < oldOptions.length; sizeOfOption++) {
          if (parseInt(oldOptions[sizeOfOption].value) === service.id) {
            service2Present = true;
          }
        }
        if (!service2Present) {
          const options = document.createElement('option');
          options.innerHTML = service.serviceName;
          options.value = service.id;
          options.className = 'services2';
          services.appendChild(options);
          service2Present = false;
        }
      }
    })
  } // end services2
}

// display selected users phone on contact page
const displayPhone = () => {
  if (document.getElementById('phone')) {
    const phoneField = document.getElementById('phone');
    if (document.getElementById('services2')) {
      const userId = document.getElementById('services2').value;
      const requestsData = storageHandler.getDataFromStore('usersrequests');
      let user;
      requestsData.filter(requestData => {
        if (requestData.user.id === parseInt(userId, 10)) {
          user = requestData.user;
        }
      })
     let phoneNumber = user.phone;
     if (phoneNumber === 'undefined') {
       phoneNumber = 'No phone';
     }
      phoneField.innerHTML = phoneNumber;
    }
  }
}

const displayRequests = (responseData) => {
  if (responseData.message === 'authentication fail! invalid Token' || responseData.message === 'authentication fail! please send a token') {
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
    let allRequiredFieldPass = true;
		for(let numOfInput = 0; numOfInput < formControls.length; numOfInput++) {
      let inputField = formControls[numOfInput];
      if (inputField.type === 'checkbox') {
        const checkboxData = domElements.getCheckboxValue(inputField);
        requestString = `${requestString}${checkboxData[0]}=${checkboxData[1]}&`;
			} else {
        const fieldName = inputField.name;
        let fieldValue = inputField.value.trim();
        const eleClass = inputField.getAttribute('class');
        if (updatingRequest) {
          // do not check for required fields
          if (fieldValue.trim() === 'select') {
            fieldValue = '';
          }
          requestString = `${requestString}${fieldName}=${fieldValue}&`;
        } else {
          if (eleClass.indexOf('required-field') > 0) {
            if (fieldValue.trim() === '' || fieldValue.trim() === 'select') {
              allRequiredFieldPass = false;
              // change default green-outline to red-outline
              domElements.changeClassValue(inputField, "green-outline", "red-outline");
            }
            requestString = `${requestString}${fieldName}=${fieldValue}&`;
          } else {
            requestString = `${requestString}${fieldName}=${fieldValue}&`;
          }
        }

      }
    }
    if (allRequiredFieldPass) {
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
    } else {
      domElements.showConsoleModal('Please fill out the the required fields');
			domNotifier();
			return;
    }
	}
}

const getRequestToEdit = (editBtn) => {
  const requests = storageHandler.getDataFromStore('usersrequests');
  const requestId = parseInt(editBtn.value);
  let requestToEdit;
  requests.filter((request) => {
    if (request.request.id === requestId) {
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
    description.value = requestToEdit.request['description'];
    address.value = requestToEdit.request['address'];
    updatingRequest = true;
    idOfRequestToUpdate =  requestId;
  }
  // hide this tab
  if(document.getElementById('view-users-requests')) {
    const displayRequestTab = document.getElementById('view-users-requests');
    domElements.changeClassValue(displayRequestTab, 'show-item', 'hide-item');
  }
}

const handleDeleteRequest = (responseData) => {
  console.log(responseData.message);
  domElements.showConsoleModal(responseData.message);
  if (responseData.message === 'request has been deleted') {
    // splice this request from local storage
  }
}
const deleteRequest = (deleteBtn) => {
  const idOfRequestToDelete = deleteBtn.value;
  requestHandler.deleteRequest(`/api/v1/users/requests/${idOfRequestToDelete}`, storageHandler, handleDeleteRequest)
}

const clearStorage = () => {
 localStorage.removeItem('usersrequests')
 localStorage.removeItem('userdata');
 storageHandler.redirectUser();
  console.log('storageCleared');
 }

let eventListenerAdded = false;
let displayRequestCalled = false;
let eventListenerAddedToCreateRequest = false;
let eventListenerAddedToToggleNavBtn = false;
let eventListenerAddedToEditRequest = false;
let eventListenerAddedToSendMessage = false;
let eventListenerAddedToSelectService = false;
let displayMessageCalled = false;
let eventListenerAddedToClearStorage = false;
let eventListenerAddedToDeleteRequest = false;

// notify the dom of changes 
const domNotifier = function() {
  if(document.getElementById('request-repair')) {
    const displayRequestTab = document.getElementById('request-repair');
    const displayRequestClass = displayRequestTab.getAttribute('class');
    if (displayRequestClass.indexOf('show') >= 0) {
      getServices();
    }
  }

  if(document.getElementById('contact-service-dept')) {
    const displayContactTab = document.getElementById('contact-service-dept');
    const displayContactClass = displayContactTab.getAttribute('class');
    if (displayContactClass.indexOf('show') >= 0) {
      getServices();
    }
  }

  if(document.getElementById('close-notice-modal')) {
    const noticeModalBtn = document.getElementById('close-notice-modal');
    domElements.newEvent(noticeModalBtn, 'click', domElements.closeNoticeModal,  domElements);
  }

  if(document.getElementById('notice-modal-link')) {
    const noticeModalLink = document.getElementById('notice-modal-link');
    domElements.newEvent(noticeModalLink, 'click', domElements.showNoticeModal,  domElements);
  }

  if(document.getElementById('message-modal-link')) {
    const messageModalLink = document.getElementById('message-modal-link');
    domElements.newEvent(messageModalLink, 'click', domElements.showMessageModal,  domElements);
  }

  if(document.getElementById('close-message-modal')) {
    const messageModalBtn = document.getElementById('close-message-modal');
    domElements.newEvent(messageModalBtn, 'click', domElements.closeMessageModal,  domElements);
  }

	if(document.getElementById('console-modal-button')) {
    const consoleModalBtn = document.getElementById('console-modal-button');
    domElements.newEvent(consoleModalBtn, 'click', domElements.closeConsoleModal,  domElements);
  }
  
  if(document.getElementById('toggle-navigation-btn')) {
    const toggleNavBtn = document.getElementById('toggle-navigation-btn');
    if (eventListenerAddedToToggleNavBtn) {
      // do nothing
    } else {
      domElements.newEvent(toggleNavBtn, 'click', domElements.showNavigation, [toggleNavBtn, domElements]);
      eventListenerAddedToToggleNavBtn = true;
    }
  }

  if(document.getElementsByClassName('nav-link')) {
    const navItems = document.getElementsByClassName('nav-link');
    if (eventListenerAdded) {
      // this prevent eventListener from being readded to this elements 
      // resulting in multiple calls to the domNotifier
    } else {
      for(let size = 0; size < navItems.length; size++) {
        domElements.newEvent(navItems[size], 'click', domElements.tabNavigation, [navItems[size],domElements]);
      }
      eventListenerAdded = true;
    } 
  }

    // show user profile photo
  if (document.getElementById('profile-photo')) {
		const imgEle = document.getElementById('profile-photo');
		domElements.displayProfilePhoto(imgEle);
  }
  
  if (document.getElementById('signout-item')) {
  const signoutLink = document.getElementById('signout-item');
    domElements.newEvent(signoutLink, 'click', storageHandler.signout);
  }

  if (document.getElementById('default-nav')) {
    // get the default nav item
    const defaultNav = document.getElementById('default-nav');
    const anchorPos = defaultNav.href.indexOf('#');
    domElements.defaultNavItem = defaultNav.href.substring(anchorPos + 1);
  }
  // create requests
  if (document.getElementById('request-button')) {
    const createRequestBtn = document.getElementById('request-button');
    if (eventListenerAddedToCreateRequest) {
      // no action
    } else {
      domElements.newEvent(createRequestBtn, 'click', createRequest, createRequestBtn);
      eventListenerAddedToCreateRequest = true;
    }
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

    // delete request
    if(document.getElementsByClassName('delete-request')) {
      const deleteRequestBtn = document.getElementsByClassName('delete-request');
      if (eventListenerAddedToDeleteRequest) {
        // this prevent eventListener from being readded to this elements 
        // resulting in multiple calls to the domNotifier
      } else {
        if (deleteRequestBtn.length > 0) {
          for(let size = 0; size < deleteRequestBtn.length; size++) {
            domElements.newEvent(deleteRequestBtn[size], 'click', deleteRequest, deleteRequestBtn[size]);
          }
          eventListenerAddedToDeleteRequest = true;
        }
      }
    }

    // showing messages
  if(document.getElementById('message-modal')) {
    const displayMessageTab = document.getElementById('message-modal');
    const displayMessageClass = displayMessageTab.getAttribute('class');
    if (displayMessageClass.indexOf('hide-item') >= 0) {
      displayMessageCalled = false;
    }
    if (displayMessageClass.indexOf('show') >= 0) {
      if(!displayMessageCalled) {
        requestHandler.getRequests('/api/v1/contacts', storageHandler, domElements.displayMessages);
        displayMessageCalled = true;
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

  // sending messages
  if(document.getElementById('contact-button')) {
    const contactBtn = document.getElementById('contact-button');
    if (eventListenerAddedToSendMessage) {
      // do nothing
    } else {
      domElements.newEvent(contactBtn, 'click', sendMessage);
      eventListenerAddedToSendMessage = true;
    }
  }

  // selected users phone number
  if(document.getElementById('services2')) {
    const selectService = document.getElementById('services2');
    if (!eventListenerAddedToSelectService) {
      domElements.newEvent(selectService, 'change', displayPhone);
    }
    eventListenerAddedToSelectService = true;
  }

  // clear data from local storage
  if(document.getElementById('reset-app')) {
    const clearStorageLink = document.getElementById('reset-app');
    if (!eventListenerAddedToClearStorage) {
      domElements.newEvent(clearStorageLink, 'click', clearStorage);
    }
    eventListenerAddedToClearStorage = true;
  }

  if(document.getElementsByClassName('red-outline')) {
		const requiredInputFields = document.getElementsByClassName('red-outline');
		for (let requiredField of requiredInputFields) {
			domElements.newEvent(requiredField, 'focus', domElements.resetRequiredFields, [requiredField, domElements]);
		}
  }
  
  if (document.getElementsByClassName('few-description')) {
    const descriptions = document.getElementsByClassName('few-description');
    if (descriptions.length === 0) {
      // do nothing
    }  else {
      for (let description of descriptions) {
        domElements.newEvent(description, 'mouseover', domElements.showFullDescription, [description, domElements]);
      }
    }
  }
}

domNotifier()
