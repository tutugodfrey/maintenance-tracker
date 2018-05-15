
import models from './../models/index';

const { requests } = models;
const RequestController = class {
  /* eslint-disable class-methods-use-this */
  // add a new event center
  addRequest(req, res) {
    console.log('respond with a resource')
  }

  // get a signle requests for a logged in user
  getRequestBYId(req, res) {
    console.log('respond with resource');
  }

  // get all request for a logged in user
  getAllRequests(req, res) {
    console.log('respond with resource');
  }

  // update a request
  updateRequest(req, res) {
    console.log('respond with resource');
  }


};
export default RequestController;
