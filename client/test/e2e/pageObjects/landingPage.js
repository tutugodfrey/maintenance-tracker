import webdriver from 'selenium-webdriver';

import testUsers from '../../../../helpers/testUsers';

const { wrongUser2 } = testUsers;
const { By, until } = webdriver;

export default (driver) => {
  const elements = {
    username: By.id('username'),
    password: By.id('passwd'),
    smallHeadings: By.css('.small-headings'),
    signupLink: By.css('#index-signup-link'),
    bigSignUpLink: By.css('#big-signup-link'),
    inlineSignInBtn: By.id('inline-signin-button'),
    homePageHeader: By.xpath('//div/h1[@id="header-title"]'),
    makeRequests: By.xpath('//div[@id="make-requests"]'),
    manageRequests: By.id('manage-requests'),
  };

  return {
    elements,
    title: driver.getTitle(),
    makeRequestSect: () => {
      driver.wait(until.elementLocated(elements.makeRequests));
      return driver.findElement(elements.makeRequests)
        .findElement(elements.smallHeadings).getText();
    },
    manageRequestSect: () => {
      return driver.findElement(elements.manageRequests)
        .findElement(elements.smallHeadings).getText();
    },
    attemptSignIn: () => {
      driver.findElement(elements.username).sendKeys(wrongUser2.username);
      driver.findElement(elements.password).sendKeys(wrongUser2.password);
      return driver.findElement(elements.inlineSignInBtn).click();
    },
  };
};
