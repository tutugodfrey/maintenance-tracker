import webdriver from 'selenium-webdriver';

const { By } = webdriver;

export default (driver) => {
  const elements = (requestNo) => {
    return {
      serviceName: By.css(`div.requests:nth-child(${requestNo}) .head-title`),
      issueDate: By.css(`div.requests:nth-child(${requestNo}) dl.request-details dt.issueDate`),
      issueDateVal: By.css(`div.requests:nth-child(${requestNo}) dl.request-details dd.issueDate`),
      category: By.css(`div.requests:nth-child(${requestNo}) dl.request-details dt.category`),
      categoryVal: By.css(`div.requests:nth-child(${requestNo}) dl.request-details dd.category`),
      description: By.css(`div.requests:nth-child(${requestNo}) dl.request-details dt.description`),
      descriptionVal: By.css(`div.requests:nth-child(${requestNo}) dl.request-details dd.few-description`),
      address: By.css(`div.requests:nth-child(${requestNo}) dl.request-details dt.address`),
      addressVal: By.css(`div.requests:nth-child(${requestNo}) dl.request-details dd.address`),
      urgent: By.css(`div.requests:nth-child(${requestNo}) dl.request-details dt.urgent`),
      urgentVal: By.css(`div.requests:nth-child(${requestNo}) dl.request-details dd.urgent`),
      status: By.css(`div.requests:nth-child(${requestNo}) dl.request-details dt.status`),
      statusVal: By.css(`div.requests:nth-child(${requestNo}) dl.request-details dd.status`),
      editRequest: By.css(`div.requests:nth-child(${requestNo}) button[class*="edit-request"]`),
      deleteRequest: By.css(`div.requests:nth-child(${requestNo}) button[class*="delete-request"]`),
    };
  };

  return {
    elements,
    request: (requestNo) => {
      return {
        serviceName: driver.findElement(elements(requestNo).serviceName).getText(),
        issueDate: driver.findElement(elements(requestNo).issueDate).getText(),
        issueDateVal: driver.findElement(elements(requestNo).issueDateVal).getText(),
        category: driver.findElement(elements(requestNo).category).getText(),
        categoryVal: driver.findElement(elements(requestNo).categoryVal).getText(),
        description: driver.findElement(elements(requestNo).description).getText(),
        descriptionVal: driver.findElement(elements(requestNo).descriptionVal).getText(),
        address: driver.findElement(elements(requestNo).address).getText(),
        addressVal: driver.findElement(elements(requestNo).addressVal).getText(),
        urgent: driver.findElement(elements(requestNo).urgent).getText(),
        urgentVal: driver.findElement(elements(requestNo).urgentVal).getText(),
        status: driver.findElement(elements(requestNo).status).getText(),
        statusVal: driver.findElement(elements(requestNo).statusVal).getText(),
        editRequest: driver.findElement(elements(requestNo).editRequest).getText(),
        deleteRequest: driver.findElement(elements(requestNo).deleteRequest).getText(),
      };
    },
    deleteRequest: (deleteBtn) => {
      return driver.findElement(deleteBtn).click();
    },
    editRequest: (editBtn) => {
      return driver.findElement(editBtn).click();
    },
  };
};
