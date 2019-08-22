import webdriver from 'selenium-webdriver';

const { By } = webdriver;

export default (driver) => {
  const elements = {
    viewRequestTab: By.css('[href="#view-users-requests"]'),
    makeRequestTab: By.xpath('//div//a[@href="#request-repair" and text()="Request Repair"]'),
    contactTab: By.xpath('//div//a[text()="Contacts"]'),
  };

  return {
    elements,
    navigateToViewRequest: () => {
      return driver.findElement(elements.viewRequestTab).click();
    },
    navigateToMakeRequest: () => {
      return driver.findElement(elements.makeRequestTab).click();
    },
    navigateToContact: () => {
      return driver.findElement(elements.contactTab).click();
    },
  };
};
