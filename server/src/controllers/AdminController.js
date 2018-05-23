
import models from './../models/index';

const { requests, users } = models;
const AdminController = class {
  
  // get all request for a logged in user
  static getAllRequests(req, res) {
    const isAdmin = req.query.isAdmin;
    if (isAdmin !== 'true') {
      return res.status(402).send({ message: 'missing required field' });
    }
    return requests
      .findAll()
      .then(allRequests => res.status(200).send(allRequests))
      .catch(error => res.status(500).send(error));
  }
};
export default AdminController;
