
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
      domElements.showConsoleModal('No repair request has been made');
    } else {
      const storageResult = storageHandler.storeData(responseData, 'adminrequests');
      let displayRequestTab;
      if (domElements.viewStatus === 'waiting') {
        const waitingRequest = responseData.filter(requests => {
          if (requests.request.status === 'awaiting confirmation' || requests.request.status === 'rejected') {
            return requests;
          }
        });
        if(waitingRequest.length === 0) {
          domElements.showConsoleModal('You have not made any repair request');
          return;
        }
        displayRequestTab = document.getElementById('view-requests');
      } else if (domElements.viewStatus === 'approved') {
        const approvedRequest = responseData.filter(requests => {
          if (requests.request.status === 'pending') {
            return requests;
          }
        });
        if(approvedRequest.length === 0) {
          domElements.showConsoleModal('You have no approved request');
          return;
        }
        displayRequestTab = document.getElementById('view-approved-requests');
      } else if (domElements.viewStatus === 'resolved') {
        const resolvedRequest = responseData.filter(requests => {
          if (requests.request.status === 'resolved') {
            return requests;
          }
        });
        if(resolvedRequest.length === 0) {
          domElements.showConsoleModal('You have no resolved request');
          return;
        }
        displayRequestTab = document.getElementById('view-resolved-requests');
      }
      domElements.displayUsersRequest(responseData, displayRequestTab);
    }
  }
  domNotifier();
}
const handleUpdateRequest = (updatedRequest) => {
  const requestId = updatedRequest.id;
  const requests = storageHandler.getDataFromStore('adminrequests');
  let requestToReplace;
  requests.filter((request) => {
    if (request.id === requestId) {
      requestToReplace = request;
    }
  });
  const indexOfRequest = requests.indexOf(requestToReplace);
  requests[indexOfRequest] = updatedRequest;
  // store updated version of request collection
  storageHandler.storeData(requests, 'adminrequests')
}
const approveRequest = (approveBtn) => {
  const idOfRequestToApprove = approveBtn.value;
  requestHandler.updateRequest(`/api/v1/requests/${idOfRequestToApprove}/approve`, storageHandler, handleUpdateRequest)
}

const rejectRequest = (rejectBtn) => {
  const requests = storageHandler.getDataFromStore('adminrequests');
  const idOfRequestToReject = rejectBtn.value;
  requestHandler.updateRequest(`/api/v1/requests/${idOfRequestToReject}/disapprove`, storageHandler, handleUpdateRequest)
}

const resolveRequest = (resolveBtn) => {
  const requests = storageHandler.getDataFromStore('adminrequests');
  const idOfRequestToResolve = resolveBtn.value;
  requestHandler.updateRequest(`/api/v1/requests/${idOfRequestToResolve}/resolve`, storageHandler, handleUpdateRequest);
}

const getClientInfo = () => {
  const requestsData = storageHandler.getDataFromStore('adminrequests');
    if (requestsData.message) {
      domElements.showConsoleModal(requestsData.message);
      return;
    }
    if (document.getElementById('service-users')) {
      const users = document.getElementById('service-users');
      requestsData.forEach((requestData) => {
        if (document.getElementsByClassName('service-users')) {
          let userPresent = false;
          const oldOptions = document.getElementsByClassName('service-users');
          for(let sizeOfOption = 0; sizeOfOption < oldOptions.length; sizeOfOption++) {
            if (parseInt(oldOptions[sizeOfOption].value) === requestData.user.id) {
              userPresent = true;
            }
          }
          if (!userPresent) {
            const options = document.createElement('option');
            options.innerHTML = requestData.user.fullname;
            options.value = requestData.user.id;
            options.className = 'service-users';
            users.appendChild(options);
            userPresent = false;
          }
        }
      });
    }
}

// display selected users phone on contact page
const displayPhone = () => {
  if (document.getElementById('phone')) {
    const phoneField = document.getElementById('phone');
    if (document.getElementById('service-users')) {
      const userId = document.getElementById('service-users').value;
      const requestsData = storageHandler.getDataFromStore('adminrequests');
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

const clearStorage = () => {
 localStorage.removeItem('adminrequests');
 localStorage.removeItem('userdata');
 storageHandler.redirectUser();
 console.log('storageCleared');
}

let eventListenerAdded = false;
let displayRequestCalled = false;
let viewResolvedRequestCalled = false;
let viewApprovedRequestCalled = false;
let eventListenerAddedToApproveRequest = false;
let eventListenerAddedToRejectRequest = false;
let eventListenerAddedToResolveRequest = false;
let eventListenerAddedToSendMessage = false;
let eventListenerAddedToSelectUser = false;
let displayMessageCalled = false;
let eventListenerAddedToClearStorage = false;

const domNotifier = function() {
  if(document.getElementById('contact-service-dept')) {
    const displayContactTab = document.getElementById('contact-service-dept');
    const displayContactClass = displayContactTab.getAttribute('class');
    if (displayContactClass.indexOf('show') >= 0) {
      getClientInfo();
    }
  }

  if (localStorage.getItem('userdata')) {
    const userData = storageHandler.getDataFromStore('userdata');
    domElements['isAdmin'] = userData.isAdmin;
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
  // show user profile photo
  if(document.getElementById('profile-photo')) {
		const imgEle = document.getElementById('profile-photo');
		domElements.displayProfilePhoto(imgEle);
  }

  if(document.getElementById('signout-item')) {
    const signoutLink = document.getElementById('signout-item');
    domElements.newEvent(signoutLink, 'click', storageHandler.signout);
  }

  if(document.getElementById('message-modal-link')) {
    const messageModalLink = document.getElementById('message-modal-link');
    domElements.newEvent(messageModalLink, 'click', domElements.showMessageModal,  domElements);
  }

  if(document.getElementById('close-message-modal')) {
    const messageModalBtn = document.getElementById('close-message-modal');
    domElements.newEvent(messageModalBtn, 'click', domElements.closeMessageModal,  domElements);
  }

  if(document.getElementById('default-nav')) {
    // get the default nav item
    const defaultNav = document.getElementById('default-nav');
    const anchorPos = defaultNav.href.indexOf('#');
    domElements.defaultNavItem = defaultNav.href.substring(anchorPos + 1);
  }

  // get users request
  if(document.getElementById('view-requests')) {
    const displayRequestTab = document.getElementById('view-requests');
    const displayRequestClass = displayRequestTab.getAttribute('class');
    if (displayRequestClass.indexOf('hide-item') >= 0) {
      displayRequestCalled = false;
    }
    if (displayRequestClass.indexOf('show') >= 0) {
      const usersRequest = storageHandler.getDataFromStore('adminrequests');
      // will uncomment this block when feature to use request stored in local storage is finished
      // such that users can always get an updated version of their request details
      if(!displayRequestCalled) {
        /*  if (Array.isArray(usersRequest)) {
            domElements.displayUsersRequest(usersRequest, displayRequestTab)
          } else { */
          // get request
        domElements.viewStatus = 'waiting';
        requestHandler.getRequests('/api/v1/requests', storageHandler, displayRequests);
      // }
        displayRequestCalled = true;
      } 
    }
  }

  // view approved requests
  if(document.getElementById('view-approved-requests')) {
    const displayRequestTab = document.getElementById('view-approved-requests');
    const displayRequestClass = displayRequestTab.getAttribute('class');
    if (displayRequestClass.indexOf('hide-item') >= 0) {
      viewApprovedRequestCalled = false;
    }
    if (displayRequestClass.indexOf('show') >= 0) {
      const usersRequest = storageHandler.getDataFromStore('adminrequests');
      // will uncomment this block when feature to use request stored in local storage is finished
      // such that users can always get an updated version of their request details
      if(!viewApprovedRequestCalled) {
        /*  if (Array.isArray(usersRequest)) {
            domElements.displayUsersRequest(usersRequest, displayRequestTab)
          } else { */
          // get request
        domElements.viewStatus = 'approved';
        requestHandler.getRequests('/api/v1/requests', storageHandler, displayRequests);
      // }
        viewApprovedRequestCalled = true;
      } 
    }
  }

  // view resolved requests
  if(document.getElementById('view-resolved-requests')) {
    const displayRequestTab = document.getElementById('view-resolved-requests');
    const displayRequestClass = displayRequestTab.getAttribute('class');
    if (displayRequestClass.indexOf('hide-item') >= 0) {
      viewResolvedRequestCalled = false;
    }
    if (displayRequestClass.indexOf('show') >= 0) {
      const usersRequest = storageHandler.getDataFromStore('adminrequests');
      // will uncomment this block when feature to use request stored in local storage is finished
      // such that users can always get an updated version of their request details
      if(!viewResolvedRequestCalled) {
        /*  if (Array.isArray(usersRequest)) {
            domElements.displayUsersRequest(usersRequest, displayRequestTab)
          } else { */
          // get request
        domElements.viewStatus = 'resolved';
        requestHandler.getRequests('/api/v1/requests', storageHandler, displayRequests);
      // }
        viewResolvedRequestCalled = true;
      } 
    }
  }

  if (document.getElementsByClassName('approve-request')) {
    const approveBtn = document.getElementsByClassName('approve-request');
    if (approveBtn.length === 0) {
      //do nothing
    } else {
      if (eventListenerAddedToApproveRequest) {
        // 
      } else {
        for(let sizeOfBtn = 0; sizeOfBtn < approveBtn.length; sizeOfBtn++) {
          domElements.newEvent(approveBtn[sizeOfBtn], 'click', approveRequest, approveBtn[sizeOfBtn]);
        }
        eventListenerAddedToApproveRequest = true;
      }
    }
  }

  if (document.getElementsByClassName('reject-request')) {
    const rejectBtn = document.getElementsByClassName('reject-request');
    if (rejectBtn.length === 0) {
      //do nothing
    } else {
      if (eventListenerAddedToRejectRequest) {
        // 
      } else {
        for(let sizeOfBtn = 0; sizeOfBtn < rejectBtn.length; sizeOfBtn++) {
          domElements.newEvent(rejectBtn[sizeOfBtn], 'click', rejectRequest, rejectBtn[sizeOfBtn]);
        }
        eventListenerAddedToRejectRequest = true;
      }
    }
  }

  if (document.getElementsByClassName('resolve-request')) {
    const resolveBtn = document.getElementsByClassName('resolve-request');
    if (resolveBtn.length === 0) {
      //do nothing
    } else {
      if (eventListenerAddedToResolveRequest) {
        // 
      } else {
        for(let sizeOfBtn = 0; sizeOfBtn < resolveBtn.length; sizeOfBtn++) {
          domElements.newEvent(resolveBtn[sizeOfBtn], 'click', resolveRequest, resolveBtn[sizeOfBtn]);
        }
        eventListenerAddedToResolveRequest = true;
      }
    }
  }

    // sending messages
    if(document.getElementById('contact-button')) {
      const contactBtn = document.getElementById('contact-button');
      if (!eventListenerAddedToSendMessage) {
        domElements.newEvent(contactBtn, 'click', sendMessage);
      }
      eventListenerAddedToSendMessage = true;
    }

    // display selected users phone number
    if(document.getElementById('service-users')) {
      const selectUser = document.getElementById('service-users');
      if (!eventListenerAddedToSelectUser) {
        domElements.newEvent(selectUser, 'change', displayPhone);
      }
      eventListenerAddedToSelectUser = true;
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

  // clear data from local storage
  if(document.getElementById('reset-app')) {
    const clearStorageLink = document.getElementById('reset-app');
    if (!eventListenerAddedToClearStorage) {
      domElements.newEvent(clearStorageLink, 'click', clearStorage);
    }
    eventListenerAddedToClearStorage = true;
  }
}

domNotifier()
