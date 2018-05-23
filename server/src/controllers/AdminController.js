
import models from './../models/index';

const { requests, users } = models;
const AdminController = class {

  // get all requests
  static getAllRequests(req, res) {
    if (req.query.isAdmin !== 'true') {
      return res.status(402).send({ message: 'you are not permitted to perform this action'})
    }
    return requests
      .findAll()
      .then(allRequests => res.status(200).send(allRequests))
      .catch(error => res.status(500).send(error));
  }

 
};
export default AdminController;
