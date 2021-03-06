let defaultNavItem;
domNotifier();
  const newEvent = function (elementObject,  eventType, callBack, callBackArgument) {

   if(elementObject.addEventListener){
     elementObject.addEventListener(eventType, function(event) {
     event.preventDefault(); 
       if(callBackArgument === undefined) {
         callBack();
       } else {
         callBack(callBackArgument);
       }
     },
     false );
   } else if (element_object.attachEvent) {
     elementObject.attachEvent('on'+ eventType, function(event){
     event.preventDefault(); 
       if(callBackArgument === undefined) {
         callback();
       } else {
         callBack(callBackArgument);
       }
     });
   }
 }   // end newEvent

  const changeAttribute = function (eleObject, attrToChange, newAttr, removeAttr) {
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


  const showNavigation =  function(toggleBtn) {
    const verticalNav = document.getElementById('vertical-nav-bar');
    const classValue = verticalNav.getAttribute('class');
    if(classValue === 'hide-item') {
      changeAttribute(verticalNav, 'class', 'show-item')
    } else if(classValue === 'show-item') {
      changeAttribute(verticalNav, 'class', 'hide-item')
    }
  }
  // get the id of the default tab view
  let lastElementClicked;
  let defaultTab;
  function tabNavigation(elem) {
    //change the class for this element
    const elemClass = elem.getAttribute('class');
    const classArr = elemClass.split(' ');
    if(classArr.indexOf('inactive') >= 0) {
      // deactive old active nav
      const activeNav = document.getElementsByClassName('active');
      for(let activeNavItem of activeNav) {
        let activeNavClass = activeNavItem['className'].replace('active', 'inactive');
        activeNavItem.setAttribute('class', activeNavClass);
      }
    
      // activate new active nav
      const newClassValue = elemClass.replace('inactive', 'active');
      elem.setAttribute('class', newClassValue)
    }

    // display tab nav item
    const anchorPos = elem.href.indexOf('#');
    const href = elem.href.substring(anchorPos + 1);
    const tabSection = document.getElementById(href);
    const classValue = tabSection.getAttribute('class');
    if((!lastElementClicked && href !== defaultNavItem)) {
      changeAttribute(tabSection, 'class', 'tab-item show-item');
      if(document.getElementById('view-requests')) {
        defaultTab = document.getElementById('view-requests');
        changeAttribute(defaultTab, 'class', 'tab-item hide-item');
      }

      if(document.getElementById('request-repair')) {
        defaultTab = document.getElementById('request-repair');
        changeAttribute(defaultTab, 'class', 'tab-item hide-item');
      }

    } else if(lastElementClicked && href !== lastElementClicked) {
      if(classValue === 'tab-item hide-item') {
        changeAttribute(tabSection, 'class', 'tab-item show-item');
      } 
      const oldTabSection = document.getElementById(lastElementClicked);
      changeAttribute(oldTabSection, 'class', 'tab-item hide-item');
    } else {
      if(classValue === 'tab-item show-item') {
        changeAttribute(tabSection, 'class', 'tab-item show-item');
      }

    }

    lastElementClicked = href;
  }
     




function domNotifier() {
  if(document.getElementById('toggle-navigation-btn')) {
    const toggleNavBtn = document.getElementById('toggle-navigation-btn');
      newEvent(toggleNavBtn, 'click', showNavigation, toggleNavBtn);
  }

  if(document.getElementsByClassName('nav-link')) {
    const navItems = document.getElementsByClassName('nav-link');
    for(let size = 0; size < navItems.length; size++) {
      newEvent(navItems[size], 'click', tabNavigation, navItems[size]);
    }  
  }

  if(document.getElementById('default-nav')) {
    // get the default nav item
    const defaultNav = document.getElementById('default-nav');
    const anchorPos = defaultNav.href.indexOf('#');
    defaultNavItem = defaultNav.href.substring(anchorPos + 1);
  }

  // user signup
  if(document.getElementById('signup-button')) {
		const signupButton = document.getElementById('signup-button');
		eventListener(signupButton, processSignUp, signupButton);
	}
}

