
const DomElementActions = class {
  constructor() {
    this.defaultTab;
    this.lastElementClicked;
    this.defaultNavItem;
    this.changeClassValue = this.changeClassValue.bind(this);
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

  displayUsersRequest(usersRequest, displayRequestTab) {
    usersRequest.forEach((requestObj) => {
      if (document.getElementById(`request${requestObj.id}`)) {
        const oldRequestContainer  = document.getElementById(`request${requestObj.id}`)
        displayRequestTab.removeChild(oldRequestContainer)
      }
      const requestContainer = document.createElement('div');
      requestContainer.className = 'requests';
      requestContainer.id = `request${requestObj.id}`;
      const header = document.createElement('div');
      header.className = 'small-header-gradient';
      const content = document.createElement('div');
      content.className = 'request-content';
      const descriptiveList = document.createElement('dl');
      descriptiveList.className = 'request-details';
      const requestForm = document.createElement('form');
      requestForm.className = 'form-inline';
      const adminIdInput = document.createElement('input');
      adminIdInput.type = 'hidden';
      adminIdInput.name = 'adminId';
      adminIdInput.value = requestObj.adminid;
      
      // create and add content to edit buttton
      const editBtn = document.createElement('button');
      editBtn.id = 'edit-request';
      editBtn.className = 'submit-button green-button btn-md';
      editBtn.value = requestObj.id;
      editBtn.innerHTML = 'Edit Request';

      // create and add content to delete btn
      const deleteBtn = document.createElement('button');
      deleteBtn.id = 'delete-request';
      deleteBtn.className = 'submit-button delete-request white-button btn-md';
      deleteBtn.value = requestObj.id;
      deleteBtn.innerHTML = 'Delete Request';

      // add content to form
      requestForm.appendChild(adminIdInput);
      requestForm.appendChild(editBtn);
      requestForm.appendChild(deleteBtn);
      const requestKeys = Object.keys(requestObj);
      requestKeys.forEach((key) => {
        if (key === 'id' || key === 'userid' || key === 'adminid' || key === 'updatedat' ) {
          // do nothing
        } else {
          let value = requestObj[key];
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
      content.appendChild(descriptiveList);
      requestContainer.appendChild(header);
      requestContainer.appendChild(content)
      requestContainer.appendChild(requestForm);
      displayRequestTab.appendChild(requestContainer);
    })
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
    }
  }
  
  redirectUser(userData) {
    if (typeof userData !== 'object') {
      return `typeError: expecting an object but got ${typeof userData}`;
    }
    if (userData.isAdmin === true  || userData.isAdmin === 'on') {
      window.location.href= '/admin/dashboard.html';
    } else if (userData.isAdmin === false) {
      window.location.href = '/users/dashboard.html';
    } 
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

  makeRequest(url, options, callback) {
    fetch(url, options)
    .then(res => res.json())
    .then(data => {
      callback(data)
    })
    .catch(error => console.log(error));
  }
}