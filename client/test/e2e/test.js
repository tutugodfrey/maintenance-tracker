import webdriver from 'selenium-webdriver';
import chaiAsPromised from 'chai-as-promised';

import chai from 'chai';
import mocha from 'mocha';
import {
  commons,
  landingPage,
  signupPage,
  dashboardPage,
  makeRequestPage,
  viewRequestPage,
} from './pageObjects';

let landing;
let signup;
let commonMethods;
let dashboard;
let makeRequest;
let viewRequest;
const { expect } = chai;
chai.use(chaiAsPromised);

/* eslint-disable func-names */
const {
  it, describe, before, after,
} = mocha;
const { By } = webdriver;

const driver = new webdriver.Builder()
  .forBrowser('chrome')
  .build();

describe('It should find elements on the home page', () => {
  before(() => {
    // driver.get('http://localhost:8080');
    driver.get('https://mtrackers.herokuapp.com');
    driver.manage().window().maximize();
    landing = landingPage(driver);
    signup = signupPage(driver);
    dashboard = dashboardPage(driver);
    makeRequest = makeRequestPage(driver);
    commonMethods = commons(driver);
    viewRequest = viewRequestPage(driver);
  });

  after(() => {
    // driver.close();
    driver.quit();
  });
  describe('Landing page', () => {
    it('should find get the title of the application', () => {
      driver.getTitle()
        .then(title => expect(title).to.equal('Maintenance tracker'));
    });

    it('should find the caption text on home page', () => {
      const { homePageHeader } = landing.elements;
      driver.findElement(homePageHeader).getText()
        .then(headTitle =>
          expect(headTitle).to.equal('Maintenance tracker'));
    });

    it('should scan through the landing page to find elements', () => {
      const { inlineSignInBtn, signupLink, bigSignUpLink } = landing.elements;
      driver.findElement(signupLink);
      driver.findElement(bigSignUpLink);
      driver.findElement(inlineSignInBtn);
      driver.findElement(signupLink).getText()
        .then((value) => {
          return expect(value).to.equal('Sign Up');
        });
    });
    it('should find the section "Make Repair Requests" on the landing page', () => {
      const { makeRequestSect } = landing;
      return makeRequestSect().then(headTitle =>
        expect(headTitle).to.equal('Make Repair Requests'));
    });

    it('should find the section "Manage Your Repair Requests"', () => {
      const { manageRequestSect } = landing;
      return manageRequestSect().then(headTitle =>
        expect(headTitle).to.equal('Manage Your Repair Requests'));
    });

    it('should fill the login form and submit', () => {
      const { attemptSignIn } = landing;
      const { closeConsoleModal } = commonMethods;
      attemptSignIn();
      return closeConsoleModal();
    });

    it('should open the signup page', () => {
      const { signupLink } = landing.elements;
      return driver.findElement(signupLink).click();
    });

    it('should navigate back to the home page', () => {
      const { navigateBack } = commonMethods;
      return navigateBack();
    });
  });

  describe('Admin signup', () => {
    it('should click on the big signup link', () => {
      const { bigSignUpLink } = landing.elements;
      return driver.findElement(bigSignUpLink).findElement(By.tagName('a')).click();
    });

    it('should signup an adminaccount', () => {
      const { signUpFormContainer } = signup.elements;
      const { waitUntilLocated, closeConsoleModal } = commonMethods;

      waitUntilLocated(signUpFormContainer);
      signup.signUpAsAdmin();
      return closeConsoleModal();
    });

    it('should logout and return to the home page', () => {
      const { signOut } = commonMethods;
      return signOut();
    });
  });

  describe('user signup', () => {
    it('should click on the big signup link', () => {
      const { bigSignUpLink } = landing.elements;
      return driver.findElement(bigSignUpLink).findElement(By.tagName('a')).click();
    });

    it('should signup a user account', () => {
      const { signUpFormContainer } = signup.elements;
      const { waitUntilLocated } = commonMethods;
      waitUntilLocated(signUpFormContainer);
      return signup.signUpAsUser();
    });

    it('should check for success message', () => {
      const {
        waitUntilLocated,
        closeConsoleModal,
        elements: commonEl,
      } = commonMethods;
      waitUntilLocated(commonEl.consoleModal);
      // driver.findElement(commonEl.consoleModalP).getText()
      //   .then((value) => {
      //     expect(value).to.equal('You have not made any repair request');
      //   })
      //   .catch(err => console.log(err));
      return closeConsoleModal();
    });
  });

  describe('should key elements on the dashboard', () => {
    it('should key elements on the dashboard', () => {
      const { viewRequestTab } = dashboard.elements;
      const { waitUntilLocated } = commonMethods;
      waitUntilLocated(viewRequestTab);
      driver.findElement(viewRequestTab).getText()
        .then(value => expect(value).to.equal('View Requests'));
      return driver.findElement(viewRequestTab).getAttribute('class')
        .then(value => expect(value).to.equal('nav-link active'));
    });

    it('should key elements on the dashboard', () => {
      const { makeRequestTab } = dashboard.elements;
      const { waitUntilLocated } = commonMethods;
      waitUntilLocated(makeRequestTab);
      driver.findElement(makeRequestTab).getAttribute('class')
        .then(value => expect(value).to.equal('nav-link inactive'));
      return driver.findElement(makeRequestTab).click();
    });

    it('should key elements on the dashboard', () => {
      const { contactTab } = dashboard.elements;
      const { waitUntilLocated } = commonMethods;
      waitUntilLocated(contactTab);
      driver.findElement(contactTab).getAttribute('class')
        .then(value => expect(value).to.equal('nav-link inactive'));
      driver.findElement(contactTab).click();
    });
  });

  describe('User make repair request', () => {
    it('should be able to make repair request', () => {
      const { makeRequestTab } = dashboard.elements;
      const { makeRepairRequest } = makeRequest;
      driver.findElement(makeRequestTab).click();
      return makeRepairRequest();
    });

    it('should be able to make repair request', () => {
      const {
        closeConsoleModal,
        waitUntilLocated,
        elements: commonEl,
      } = commonMethods;
      waitUntilLocated(commonEl.consoleModal);
      driver.findElement(commonEl.consoleModalP).getText()
        .then((value) => {
          expect(value).to.equal('Your request has been recorded');
        });
      return closeConsoleModal();
    });
  });

  describe('View Request', () => {
    it('should navigate to the view request tab', () => {
      return dashboard.navigateToViewRequest();
    });

    it('should check the content of the created request', async () => {
      const { request } = viewRequest;
      const targetRequest = request(1);
      expect(await targetRequest.serviceName).to.equal('servico');
      expect(await targetRequest.issueDate).to.equal('IssueDate');
      expect(await targetRequest.category).to.equal('Category');
      expect(await targetRequest.categoryVal).to.equal('Electrical');
      expect(await targetRequest.description).to.equal('Description');
      expect(await targetRequest.descriptionVal).to.equal('I need to repair my phone please');
      expect(await targetRequest.address).to.equal('Address');
      expect(await targetRequest.addressVal).to.equal('Mende Maryland, Lagos');
      expect(await targetRequest.urgent).to.equal('Urgent');
      expect(await targetRequest.urgentVal).to.equal('true');
      expect(await targetRequest.status).to.equal('Status');
      expect(await targetRequest.statusVal).to.equal('awaiting confirmation');
    });

    it('should update the request', () => {
      const { elements, editRequest } = viewRequest;
      const targetRequest = elements(1);
      return editRequest(targetRequest.editRequest);
    });
  });
});
