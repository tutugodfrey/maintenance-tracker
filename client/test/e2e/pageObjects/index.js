import webdriver from 'selenium-webdriver';

import landingPage from './landingPage';
import signupPage from './singup';
import dashboardPage from './dashboard';
import makeRequestPage from './makeRequest';
import viewRequestPage from './viewRequest';

const { By, until } = webdriver;
const commons = (driver) => {
  const elements = {
    signOutLink: By.xpath('//div//li[@id="signout-item"]/a[text()="Sign Out"]'),
    consoleModal: By.xpath('//div[@id="console-modal"][not(contains(@class,"hide-"))]'),
    consoleModalP: By.css('#message-box'),
    consoleModalBtn: By.xpath('//div/button[@id="console-modal-button"]'),
  };
  return {
    url: 'http//localhost:8080',
    title: driver.getTitle(),
    elements,
    closeConsoleModal: async () => {
      await driver.wait(until.elementLocated(elements.consoleModal), 1000);
      await driver.findElement(elements.consoleModal);
      return driver.findElement(elements.consoleModalBtn).click();
    },
    waitUntilVisible: (locator) => {
      return driver.wait(until.elementLocated(locator));
    },
    waitUntilLocated: (locator) => {
      return driver.wait(until.elementLocated(locator));
    },
    waitUntilTextIs: (locator, text) => {
      return driver.wait(until.elementTextIs(locator, text));
    },
    waitUntilTextContains: (locator, text) => {
      return driver.wait(until.elementTextContains(locator, text));
    },
    navigateTo: (url) => {
      driver.navigate().to(url);
    },
    navigateBack: () => {
      driver.navigate().back();
    },
    navigateForword: () => {
      driver.navigate().forword();
    },
    tabNavigate: (elementSelector) => {
      driver.wait(until.elementLocated(elementSelector));
      return driver.findElement(elementSelector).click();
    },

    signOut: () => {
      driver.wait(until.elementLocated(elements.signOutLink), 30000);
      return driver.findElement(elements.signOutLink).click();
    },
  };
};

export {
  commons,
  landingPage,
  signupPage,
  dashboardPage,
  makeRequestPage,
  viewRequestPage,
};
