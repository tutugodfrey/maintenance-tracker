import webdriver from 'selenium-webdriver';

const { By } = webdriver;

export default (driver) => {
  const elements = {
    category: By.xpath('//div//select[@id="problem-type"]'),
    service: By.xpath('//div//select[@id="services"]'),
    description: By.xpath('//div//textarea[@id="description"]'),
    userAddress: By.xpath('//div//input[@id="address" and @type="text"]'),
    markAsUrgent: By.xpath('//div//input[@id="urgent-request" and @type="checkbox"]'),
    submitRequestBtn: By.xpath('//div//button[@id="request-button"]'),
  };
  return {
    elements,
    makeRepairRequest: () => {
      driver.findElement(elements.category).click();
      driver.findElement(By.xpath('//div//select[@id="problem-type"]//option[3]')).click();
      driver.findElement(elements.service).click();
      driver.findElement(By.xpath('//div//select[@id="services"]//option[2]')).click();
      driver.findElement(elements.description).sendKeys('I need to repair my phone please');
      driver.findElement(elements.userAddress).sendKeys('Mende Maryland, Lagos');
      driver.findElement(elements.markAsUrgent).click();
      return driver.findElement(elements.submitRequestBtn).click();
    },
  };
};
