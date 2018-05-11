
domNotifier();

  function newEvent(elementObject,  eventType, callBack, callBackArgument) {

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
     elementObject.attachEvent("on"+ eventType, function(event){
     event.preventDefault(); 
       if(callBackArgument === undefined) {
         callback();
       } else {
         callBack(callBackArgument);
       }
     });
   }
 }   // end newEvent

  function changeAttribut(eleObject, attrToChange, newAttr, removeAttr) {
    const eleAttr = eleObject.getAttribute(attrToChange);
    if (eleAttr === null || eleAttr !== newAttr) 	{
      //set the attribute and the image become large
      eleObject.setAttribute(attrToChange, newAttr);
    } else if (eleAttr === newAttr && removeAttr === "yes") {
      eleObject.removeAttribute(attrToChange);
    }  else if (eleAttr === newAttr && removeAttr === "no") {
      //no action taken
    } else if(eleAttr === newAttr && (removeAttr !== "yes" || removeAttr !== "no" || removeAttr !== "undefined")){
      eleObject.setAttribute(attrToChange, removeAttr);
    } 
  }		//end changeClass


  function showNavigation(toggleBtn) {
    const verticalNav = document.getElementById("vertical-nav-bar");
    const classValue = verticalNav.getAttribute("class");
    if(classValue === "hidden") {
      changeAttribut(verticalNav, "class", "show-item")
    } else if(classValue === "show-item") {
      changeAttribut(verticalNav, "class", "hidden")
    }
  }
  // get the id of the default tab view
  let lastElementClicked = "";
  function tabNavigation(elem) {
    const anchorPos = elem.href.indexOf("#");
    const href = elem.href.substring(anchorPos + 1);
    
    const tabSection = document.getElementById(href);
    const classValue = tabSection.getAttribute("class");
    if(!lastElementClicked) {
      changeAttribut(tabSection, "class", "tab-item show-item");
    } else if(href !== lastElementClicked && lastElementClicked) {
      if(classValue === "tab-item hidden") {
        changeAttribut(tabSection, "class", "tab-item show-item");
      } 
      const oldTabSection = document.getElementById(lastElementClicked);
      changeAttribut(oldTabSection, "class", "tab-item hidden");
    } else {
      if(classValue === "tab-item show-item") {
        changeAttribut(tabSection, "class", "tab-item show-item");
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
}

