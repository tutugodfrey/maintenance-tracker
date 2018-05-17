
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
  getOneRequest(req, res) {
    const requestId = parseInt(req.params.requestId, 10);
    if (!requestId) {
      return res.status(400).send({ message: 'missing required field' });
    }
    return requests
      .find({
        where: {
          id: requestId,
        },
      })
      .then(request => res.status(200).send(request))
      .catch(error => res.status(404).send(error));
  }

  // get all request for a logged in user
  getAllRequests(req, res) {
    return requests
      .findAll()
      .then(allRequests => res.status(200).send(allRequests))
      .catch(error => res.status(404).send(error));
  }

  // update a request
  updateRequest(req, res) {
    return res.send('working');
  }
};
export default RequestController;
