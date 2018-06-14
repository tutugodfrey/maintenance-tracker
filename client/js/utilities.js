
const DomElementActions = class {
  constructor() {
    this.defaultTab;
    this.lastElementClicked;
    this.defaultNavItem;
    this.changeClassValue = this.changeClassValue.bind(this);
    this.isAdmin;
    this.viewStatus;
    this._formatRequestDetail = this._formatRequestDetail;
    // this._changeClassValue = this._changeClassValue;
  }
  // add eventlistener to elements
  newEvent (elementObject,  eventType, callBack, callBackArgument) {
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

  // change the attribute of elements
  changeAttribute (eleObject, attrToChange, newAttr, removeAttr) {
    const eleAttr = eleObject.getAttribute(attrToChange);
    if (eleAttr === null || eleAttr !== newAttr) 	{
      //set the attribute and the image become large
      eleObject.setAttribute(attrToChange, newAttr);
    } else if (eleAttr === newAttr && removeAttr === 'yes') {
      eleObject.removeAttribute(attrToChange);
    }  else if (eleAttr === newAttr && removeAttr === 'no') {
      //no action taken
    } else if(eleAttr === newAttr && (removeAttr !== 'yes' || removeAttr !== 'no' || removeAttr !== "undefined")){
      eleObject.setAttribute(attrToChange, removeAttr);
    } 
  }		//end changeClass

  // change the attribute of elements
  changeClassValue (eleObject, valueToChange, replacement) {
    let eleClassValue = eleObject.getAttribute('class');
    eleClassValue = eleClassValue.replace(valueToChange, replacement);
    eleObject.setAttribute('class', eleClassValue);
  }		//end changeClassValue

  // display and close vertical nav button
  showNavigation(arrayOfArgu) {
    const self = arrayOfArgu[0];
    const toggleBtn = arrayOfArgu[1];
    if (self === 'undefined') {
      self = this;
    }
    const verticalNav = document.getElementById('vertical-nav-bar');
    const classValue = verticalNav.getAttribute('class');
    if(classValue.indexOf('hide-item') >= 0) {
      self.changeClassValue (verticalNav, 'hide-item', 'show-item');
    } else if(classValue.indexOf('show-item') >= 0) {
      self.changeClassValue (verticalNav, 'show-item', 'hide-item');
    }
  }

  tabNavigation(arrayOfArgu) {
    const self = arrayOfArgu[0];
    // self = the instance of this class
    if (self === 'undefined') {
      self = this;
    }
    const elem = arrayOfArgu[1]
    // deactive current activeNav
    const activeNav = document.getElementsByClassName('active')[0];
    self.changeClassValue (activeNav, 'active', 'inactive');

    // activate elem 
    self.changeClassValue (elem, 'inactive', 'active');
 
    // display tab elements
    const anchorPos = elem.href.indexOf('#');
    // value in href = id of the tab section
    const href = elem.href.substring(anchorPos + 1);
    const tabSection = document.getElementById(href);
    // const classValue = tabSection.getAttribute('class');
    if((!self.lastElementClicked && href !== self.defaultNavItem)) {
      self.changeClassValue (tabSection, 'hide-item', 'show-item');
      if(document.getElementById('view-requests')) {
        self.defaultTab = document.getElementById('view-requests');
        self.changeClassValue (self.defaultTab, 'show-item', 'hide-item')
      }
      if(document.getElementById('request-repair')) {
        self.defaultTab = document.getElementById('request-repair');
        self.changeClassValue (self.defaultTab, 'show-item', 'hide-item')
      }
    } else if(self.lastElementClicked && href !== self.lastElementClicked) {
      self.changeClassValue (tabSection, 'hide-item', 'show-item');
      const oldTabSection = document.getElementById(self.lastElementClicked);
      self.changeClassValue (oldTabSection, 'show-item', 'hide-item');
    } else {
      self.changeClassValue (tabSection, 'hide-item', 'show-item');
    }
    self.lastElementClicked = href;
    domNotifier();
    return;
  }

  showConsoleModal (message) {
    if(document.getElementById('console-modal')) {
      const consoleModal = document.getElementById('console-modal');
      const messageBox = document.getElementById('message-box');
      messageBox.innerHTML = message;
      this.changeClassValue(consoleModal, 'hide-item', 'show-item');
    }
  }
  
  closeConsoleModal (self) {
    // self = the instance of this class
    if (self === 'undefined') {
      self = this;
    }
    if(document.getElementById('console-modal')) {
      const consoleModal = document.getElementById('console-modal');
      self.changeClassValue(consoleModal, 'show-item', 'hide-item');
    }
  }

  showNoticeModal (self) {
        // self = the instance of this class
    if (self === 'undefined') {
      self = this;
    }
    if(document.getElementById('notice-modal')) {
      const noticeModal = document.getElementById('notice-modal');
      // const messageBox = document.getElementById('message-box');
      // messageBox.innerHTML = message;
      self.changeClassValue(noticeModal, 'hide-item', 'show-item');
    }
  }

  closeNoticeModal (self) {
    // self = the instance of this class
    if (self === 'undefined') {
      self = this;
    }
    if(document.getElementById('notice-modal')) {
      const consoleModal = document.getElementById('notice-modal');
      self.changeClassValue(consoleModal, 'show-item', 'hide-item');
    }
  }

  showMessageModal (self) {
    // self = the instance of this class
    if (self === 'undefined') {
      self = this;
    }
    if(document.getElementById('message-modal')) {
      const messageModal = document.getElementById('message-modal');
      self.changeClassValue(messageModal, 'hide-item', 'show-item');
    }
    domNotifier()
  }

  closeMessageModal (self) {
    // self = the instance of this class
    if (self === 'undefined') {
      self = this;
    }
    if(document.getElementById('message-modal')) {
      const consoleModal = document.getElementById('message-modal');
      self.changeClassValue(consoleModal, 'show-item', 'hide-item');
    }
  }

  getCheckboxValue(checkBoxEle){
    let eleName;
		if(checkBoxEle.checked){
			const eleValue = checkBoxEle.value;
			eleName = checkBoxEle.name;
			return [eleName, eleValue];
		} else {
      eleName = checkBoxEle.name;
			return [eleName, ''];
		}
  }
  
  dateSubstring(date) {
    const indexOfTime = date.indexOf('T');
    const datePortion = date.substr(0, indexOfTime);
    return datePortion;
  }

  _formatRequestDetail(requestObj, displayRequestTab) {
    const requestContainer = document.createElement('div');
    requestContainer.className = 'requests';
    requestContainer.id = `request${requestObj.request.id}`;
    const header = document.createElement('div');
    header.className = 'small-header-gradient';
    const headTitle = document.createElement('h3');
    headTitle.className = 'head-title';
    const content = document.createElement('div');
    content.className = 'request-content';
    const descriptiveList = document.createElement('dl');
    descriptiveList.className = 'request-details';
    const requestForm = document.createElement('form');
    requestForm.className = 'form-inline';
    const adminIdInput = document.createElement('input');
    adminIdInput.type = 'hidden';
    adminIdInput.name = 'adminId';
    adminIdInput.value = requestObj.request.adminid;
    requestForm.appendChild(adminIdInput);
    if (this.isAdmin && this.viewStatus === 'waiting' && (requestObj.request.status === 'awaiting confirmation' || requestObj.request.status === 'rejected')) {
      // create and add content to edit buttton
      headTitle.innerHTML = requestObj.user.fullname;
      const editBtn = document.createElement('button');
      const deleteBtn = document.createElement('button');
      editBtn.value = requestObj.request.id;
      deleteBtn.value = requestObj.request.id;
      editBtn.id = `approve-request${requestObj.request.id}`;
      editBtn.className = 'submit-button approve-request green-button btn-md';
      editBtn.innerHTML = 'Approve';

      // create and add content to delete btn
      deleteBtn.id = `reject-request${requestObj.request.id}`;
      deleteBtn.className = 'submit-button reject-request white-button btn-md';
      deleteBtn.innerHTML = 'Reject';
      // add content to form
      requestForm.appendChild(editBtn);
      requestForm.appendChild(deleteBtn);
    } else if (this.isAdmin && this.viewStatus === 'approved' && requestObj.request.status === 'pending') {
      headTitle.innerHTML = requestObj.user.fullname;
      // create and add content to edit buttton
      const editBtn = document.createElement('button');
      editBtn.value = requestObj.request.id;
      editBtn.id = `resolve-request${requestObj.request.id}`;
      editBtn.className = 'submit-button resolve-request green-button btn-wide';
      editBtn.innerHTML = 'Mark As Resolved';
      requestForm.appendChild(editBtn);
    } else if (this.isAdmin && this.viewStatus === 'resolved' && requestObj.request.status === 'resolved') {
      headTitle.innerHTML = requestObj.user.fullname;
      // no button need to be added
    } else if (!this.isAdmin) {
      headTitle.innerHTML = requestObj.user.servicename;
      const editBtn = document.createElement('button');
      const deleteBtn = document.createElement('button');
      editBtn.id = `edit-request${requestObj.request.id}`;
      editBtn.className = 'submit-button edit-request green-button btn-md';
      editBtn.innerHTML = 'Edit Request';

      // create and add content to delete btn
      deleteBtn.id = `delete-request${requestObj.request.id}`;
      deleteBtn.className = 'submit-button delete-request white-button btn-md';
      deleteBtn.innerHTML = 'Delete Request';
      // add content to form
      requestForm.appendChild(editBtn);
      requestForm.appendChild(deleteBtn);
    }
    const requestKeys = Object.keys(requestObj.request);
    requestKeys.forEach((key) => {
      if (key === 'id' || key === 'userid' || key === 'adminid' || key === 'updatedat' ) {
        // do nothing
      } else {
        let value = requestObj.request[key];
        if (key === 'issuedate') {
          value = domElements.dateSubstring(value);
        }
        const listTerm = document.createElement('dt');
        listTerm.innerHTML = key;
        listTerm.className = key
        const listDefinition = document.createElement('dd');
        listDefinition.className = key;
        listDefinition.innerHTML = value;
        descriptiveList.appendChild(listTerm);
        descriptiveList.appendChild(listDefinition);
      }
    });
    header.appendChild(headTitle)
    content.appendChild(descriptiveList);
    requestContainer.appendChild(header);
    requestContainer.appendChild(content)
    requestContainer.appendChild(requestForm);
    displayRequestTab.appendChild(requestContainer);
  }

  displayUsersRequest(usersRequest, displayRequestTab) {
    usersRequest.forEach((requestObj) => {
      if (document.getElementById(`request${requestObj.request.id}`)) {
        try {
          const oldRequestContainer  = document.getElementById(`request${requestObj.request.id}`)
          displayRequestTab.removeChild(oldRequestContainer)
        } catch(error) {
          console.log(error)
        }
      }

      if (this.isAdmin && this.viewStatus === 'waiting' && (requestObj.request.status === 'awaiting confirmation' || requestObj.request.status === 'rejected')) {
        this._formatRequestDetail(requestObj, displayRequestTab);
      } else if (this.isAdmin && this.viewStatus === 'approved' && requestObj.request.status === 'pending') {
        this._formatRequestDetail(requestObj, displayRequestTab);
      } else if (this.isAdmin && this.viewStatus === 'resolved' && requestObj.request.status === 'resolved') {
        this._formatRequestDetail(requestObj, displayRequestTab);
      } else  if (!this.isAdmin) {
        this._formatRequestDetail(requestObj, displayRequestTab);
      }
    });
  }

  displayMessages(responseData) {
    if (responseData.message === 'Invalid Token' || responseData.message === 'Please send a token') {
      storageHandler.redirectUser(responseData)
    }
    if (responseData.message) {
      domElements.showConsoleModal(responseData.message);
      return;
    }
    if (Array.isArray(responseData)) {
      if(responseData.length === 0) {
        domElements.showConsoleModal('You have no message');
      } else {
        if (document.getElementById('message-content')) {
          const userData = storageHandler.getDataFromStore('userdata');
          const messageContainer = document.getElementById('message-content');
          responseData.forEach((messageObj) => {
            const messageHolder = document.createElement('div');
            const messageSender = document.createElement('h3');
            const messageTitle = document.createElement('label');
            const messageBody = document.createElement('p');
             const seperator = document.createElement('hr')
            // diff sender and receiver
            if (userData.id === messageObj.message.senderid) {
              messageHolder.className = 'sender'
            } else {
              messageHolder.className = 'receiver'
            }
            if (domElements.isAdmin && userData.id !== messageObj.message.senderid) {
              messageSender.innerHTML = messageObj.sender.fullname;
            } else if (domElements.isAdmin && userData.id === messageObj.message.senderid) {
              messageSender.innerHTML = `You To ${messageObj.receiver.fullname}`;
            } else if (!domElements.isAdmin && userData.id !== messageObj.message.senderid) {
              messageSender.innerHTML = messageObj.sender.servicename;
            } else if (!domElements.isAdmin && userData.id === messageObj.message.senderid) {
              messageSender.innerHTML = `You To ${messageObj.receiver.servicename}`;
            }
            messageBody.innerHTML = messageObj.message.message;
            messageTitle.innerHTML = messageObj.message.title;
            messageHolder.appendChild(messageSender);
            messageHolder.appendChild(messageTitle);
            messageHolder.appendChild(messageBody);
            messageHolder.appendChild(seperator);
            messageContainer.appendChild(messageHolder);
          });

        }
      }
    }
    domNotifier();
  }

  // func to display profile photo
  displayProfilePhoto(imgEle) {
    const userData = storageHandler.getDataFromStore('userdata');
    imgEle.src = userData.imgUrl;
  }
}

const StorageHandler = class {
  getDataFromStore (key) {
    if (typeof key !== 'string') {
      return `typeError: expecting a string but got ${typeof key}`;
    } 
    if (localStorage.getItem(key)) {
      let data = localStorage.getItem(key);
      data = JSON.parse(data);
      return data;
    } else {
      return 'no user data stored in local storage';
    }
  }
  
  // store data to localStorage
  storeData(dataToStore, keyString) {
    if (typeof dataToStore !== 'object') {
      return `typeError: expecting an object but got ${typeof dataToStore}`;
    }
    if (typeof keyString !== 'string') {
      return `typeError: expecting an string but got ${typeof keyString}`;
    }
    if (!localStorage.getItem(keyString)) {
      const stringifyData = JSON.stringify(dataToStore);
      localStorage.setItem(keyString, stringifyData);
      return 'data stored';
    } else {
      // store the latest version of data
      localStorage.removeItem(keyString);
      const stringifyData = JSON.stringify(dataToStore);
      localStorage.setItem(keyString, stringifyData);
      return 'data stored';
    }
  }
  
  redirectUser(userData) {
    if (typeof userData !== 'object') {
      return `typeError: expecting an object but got ${typeof userData}`;
    }
    if (!userData) {
      // remove userdata from localStorage, redirect user to signin page
      localStorage.removeItem('userdata');
      window.location.href = '/signin.html';
      return
    }
    if (userData.message === 'Invalid Token' || userData.message === 'Please send a token') { // userData = response from server on diff operations
      // remove userdata from localStorage, redirect user to signin page
      localStorage.removeItem('userdata');
      window.location.href = '/signin.html';
      return
    } else if (userData.isAdmin === true  || userData.isAdmin === 'on') {
      window.location.href= '/admin/dashboard.html';
    } else if (userData.isAdmin === false) {
      window.location.href = '/users/dashboard.html';
    } 
  }

  signout() {
    window.location.href = '/signin.html';
    return
  }
}

const RequestHandler = class {
  createRequest(ele) {
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
            return;
          }
          jsonRequest = `${jsonRequest}${fieldName}=${fieldValue}&`;
        } else {
        jsonRequest = `${jsonRequest}${fieldName}=${fieldValue}&`;
        }
      }
      jsonRequest = `${jsonRequest}userId=${userData.id}`;
      makeRequest(jsonRequest, 'POST', '/api/v1/users/requests', handleResponse)
    }
  } // end createRequest

  postRequests(url, formInfo, storageHandler, callback){
    const userData = storageHandler.getDataFromStore('userdata')
    const headers =  new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('token', userData.token);
    const options = {
      headers,
      method: 'POST',
      body: formInfo,
    }
    requestHandler.makeRequest(url, options, callback);
  }

  getRequests(url, storageHandler, callback){
    const userData = storageHandler.getDataFromStore('userdata')
    const headers =  new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('token', userData.token);
    const options = {
      headers,
      method: 'GET',
    }
    requestHandler.makeRequest(url, options, callback);
  }

  updateRequest(url, storageHandler, callback){
    const userData = storageHandler.getDataFromStore('userdata')
    const headers =  new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('token', userData.token);
    const options = {
      headers,
      method: 'PUT',
      body:'',
    }
    requestHandler.makeRequest(url, options, callback);
  }

  makeRequest(url, options, callback) {
    fetch(url, options)
    .then(res => res.json())
    .then(data => {
      callback(data)
    })
    .catch(error => console.log(error));
  }
}

// instantiate the classes
const domElements = new DomElementActions();
const storageHandler = new StorageHandler();
const requestHandler = new RequestHandler();
