
import models from './../models/index';

const { requests, users } = models;
const RequestController = class {
  /* eslint-disable class-methods-use-this */
  // add a new event center
  addRequest(req, res) {
    const userId = parseInt(req.body.userId, 10);
    if (!(req.body.userId) || !(req.body.description)) {
      return res.status(400).send({ message: 'missing required field' });
    }
    return users.findById(userId)
      .then((user) => {
        return requests
          .create(req.body)
          .then((request) => {
            return res.status(201).send({
              request,
              user,
            });
          })
          .catch((error) => {
            return res.status(400).send(error);
          });
      })
      .catch(error => res.status(404).send(error));
  }

  // get a signle requests for a logged in user
  getRequestBYId(req, res) {
    return res.send('working');
  }

  // get all request for a logged in user
  getAllRequests(req, res) {
    return res.send('working');
  }

  // update a request
  updateRequest(req, res) {
    return res.send('working');
  }
};
export default RequestController;
