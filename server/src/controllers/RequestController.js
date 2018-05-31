
import models from './../models/index';
import Services from './../helpers/Services';

const { requests, users } = models;
const RequestController = class {
  // add a new request
  static addRequest(req, res) {
    console.log(req.body)
    const {
      userId,
      category,
      description,
      address,
      urgent,
      serviceName,
    } = req.body;

    if (!parseInt(userId, 10) || description.trim() === '' || address.trim() === '' || category.trim() === '') {
      return res.status(400).send({ message: 'missing required field' });
    }
    if (!urgent && urgent.trim() !== '') {
      return res.status(400).send({ message: 'typeError field urgent must be a boolean' });
    }
    const issueDate = Services.getDate();
    const dateRegExp = /\d{4}-\d{2}-\d{2}/;
    if (!dateRegExp.test(issueDate)) {
      return res.status(500).send({ message: 'an error occur while processing your request' });
    }
    return users.findById(parseInt(userId, 10))
      .then((user) => {
        return requests
          .create({
            userId,
            category,
            description,
            address,
            issueDate: 'now()',
            updatedAt: 'now()',
            status: 'awaiting confirmation',
            urgent: urgent || false,
          })
          .then((request) => {
            return res.status(201).send(request);
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
    const userId = parseInt(req.query.userId, 10);
    if (!requestId || !userId) {
      return res.status(400).send({ message: 'missing required field' });
    }
    return requests
      .find({
        where: {
          userId,
          id: requestId,
        },
      })
      .then(request => res.status(200).send(request))
      .catch(error => res.status(404).send(error));
  }

  // get all request for a logged in user
  static getAllRequests(req, res) {
    const userId = parseInt(req.query.userId, 10);
    if (!userId) {
      return res.status(400).send({ message: 'missing required field' });
    }
    return requests
      .findAll({
        where: {
          userId,
        },
      })
      .then(allRequests => res.status(200).send(allRequests))
      .catch(error => res.status(500).send(error));
  }

  // update a request
  static updateRequest(req, res) {
    const {
      category,
      description,
      address,
      serviceName,
      urgent,
    } = req.body;
    const requestId = parseInt(req.params.requestId, 10);
    const userId = parseInt(req.query.userId, 10);
    if (!requestId || !userId) {
      return res.status(400).send({ message: 'missing required field' });
    }
    const updatedAt = Services.getDate();
    const dateRegExp = /\d{4}-\d{2}-\d{2}/;
    if (!dateRegExp.test(updatedAt)) {
      return res.status(500).send({ message: 'an error occur while processing your request' });
    }
    return requests
      .find({
        where: {
          userId,
          id: requestId,
        },
        type: 'or',
      })
      .then((request) => {
        // users should not be able to modify the status of a request
        if (request.status === 'approved' || request.status === 'resolved') {
          return res.status(200).send({ message: 'request cannot be modify after it has been approved or resolved' });
        }
        return requests
          .update(
            request,
            {
              updatedAt: 'now()',
              category: category || request.category,
              description: description || request.description,
              address: address || request.address,
              serviceName: serviceName || request.serviceName,
              urgent: urgent || request.urgent,
            },
          )
          .then(newRequest => res.status(200).send(newRequest))
          .catch(error => res.status(500).send(error));
      })
      .catch(error => res.status(404).send(error));
  }

  static deleteRequest(req, res) {
    const requestId = parseInt(req.params.requestId, 10);
    const userId = parseInt(req.query.userId, 10);
    if (!requestId || !userId) {
      return res.status(400).send({ message: 'missing required field' });
    }
    return requests
      .destroy({
        where: {
          userId,
          id: requestId,
        },
      })
      .then(newRequest => res.status(200).send(newRequest))
      .catch(error => res.status(404).send(error));
  }
};
export default RequestController;
