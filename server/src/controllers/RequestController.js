
import models from './../models/index';

const { requests, users } = models;
const RequestController = class {
  // add a new request
  static addRequest(req, res) {
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
  static getOneRequest(req, res) {
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
  static getAllRequests(req, res) {
    return requests
      .findAll()
      .then(allRequests => res.status(200).send(allRequests))
      .catch(error => res.status(404).send(error));
  }

  // update a request
  static updateRequest(req, res) {
    const requestId = parseInt(req.params.requestId, 10);
    if (!requestId) {
      return res.status(400).send({ message: 'missing required field' });
    }
    return requests
      .findById(requestId)
      .then((request) => {
        return requests
          .update(
            request,
            {
              category: req.body.category || request.category,
              description: req.body.description || request.description,
              department: req.body.department || request.department,
              urgency: req.body.urgency || request.urgency,
              status: req.body.status || request.status,
            },
          )
          .then(newRequest => res.status(200).send(newRequest))
          .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(404).send(error));
  }

  static deleteRequest(req, res) {
    const requestId = parseInt(req.params.requestId, 10);
    if (!requestId) {
      return res.status(400).send({ message: 'missing required field' });
    }
    return requests
      .destroy({
        where: {
          id: requestId,
        },
      })
      .then(newRequest => res.status(200).send(newRequest))
      .catch(error => res.status(404).send(error));
  }
};
export default RequestController;
