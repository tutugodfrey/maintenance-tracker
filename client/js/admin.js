const domElements = new DomElementActions();
const storageHandler = new StorageHandler();
const requestHandler = new RequestHandler();

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
      const storageResult = storageHandler.storeData(responseData, 'adminrequests');
      let displayRequestTab;
      if (domElements.viewStatus === 'waiting') {
        const waitingRequest = responseData.filter(request => {
          if (request.status === 'awaiting confirmation' || request.status === 'rejected') {
            return request;
          }
        });
        if(waitingRequest.length === 0) {
          domElements.showConsoleModal('You have not made any repair request');
          return;
        }
        displayRequestTab = document.getElementById('view-requests');
      } else if (domElements.viewStatus === 'approved') {
        const approvedRequest = responseData.filter(request => {
          if (request.status === 'pending') {
            return request;
          }
        });
        if(approvedRequest.length === 0) {
          domElements.showConsoleModal('You have no approved request');
          return;
        }
        displayRequestTab = document.getElementById('view-approved-requests');
      } else if (domElements.viewStatus === 'resolved') {
        const resolvedRequest = responseData.filter(request => {
          if (request.status === 'resolved') {
            return request;
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

let eventListenerAdded = false;
let displayRequestCalled = false;
let viewResolvedRequestCalled = false;
let viewApprovedRequestCalled = false;
let eventListenerAddedToEditRequest = false;
const domNotifier = function() {
 // localStorage.removeItem('requests')
 // localStorage.removeItem('userdata');
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
}

domNotifier()