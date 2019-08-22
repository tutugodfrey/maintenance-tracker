import webdriver from 'selenium-webdriver';

import testUsers from '../../../../helpers/testUsers';

const { user1, user2 } = testUsers;
const { By } = webdriver;
export default (driver) => {
  const elements = {
    signUpFormContainer: By.xpath('//div/div[@id="signup-form-container"]'),
    username: By.xpath('//div//input[@type="text" and @id="username"]'),
    password: By.xpath('//div//input[@type="password" and @id="passwd"]'),
    fullname: By.css('#fullname'),
    address: By.id('address'),
    email: By.id('email'),
    password1: By.id('password'),
    password2: By.id('confirm-password'),
    phone: By.id('phone'),
    isAdminCheckBox: By.xpath('//div//input[@type="checkbox" and @id="confirmisAdmin"]'),
    adminServiceName: By.xpath('//div//input[@type="text" and @id="serviceName"]'),
  };

  return {
    elements,
    signUpAsAdmin: () => {
      driver.findElement(elements.fullname).sendKeys(user1.fullname);
      driver.findElement(elements.username).sendKeys(user1.username);
      driver.findElement(elements.email).sendKeys(user1.email);
      driver.findElement(elements.address).sendKeys(user1.address);
      driver.findElement(elements.password1).sendKeys(user1.password1);
      driver.findElement(elements.password2).sendKeys(user1.password2);
      driver.findElement(elements.phone).sendKeys(user1.phone);
      driver.findElement(elements.isAdminCheckBox).click();
      driver.findElement(elements.adminServiceName).sendKeys(user1.serviceName);
      return driver.findElement(By.css('#signup-button')).click();
    },
    signUpAsUser: () => {
      driver.findElement(elements.fullname).sendKeys(user2.fullname);
      driver.findElement(elements.username).sendKeys(user2.username);
      driver.findElement(elements.email).sendKeys(user2.email);
      driver.findElement(elements.address).sendKeys(user2.address);
      driver.findElement(elements.password1).sendKeys(user2.password1);
      driver.findElement(elements.password2).sendKeys(user2.password2);
      driver.findElement(elements.phone).sendKeys(user2.phone);
      return driver.findElement(By.css('#signup-button')).click();
    },
  };
};
