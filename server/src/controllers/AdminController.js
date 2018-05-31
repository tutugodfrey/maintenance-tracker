
import models from './../models/index';
import Services from './../helpers/Services';

const { requests } = models;
const AdminController = class {
  // get all request for a logged in user
  static getAllRequests(req, res) {
    const { isAdmin } = req.query;
    if (isAdmin !== 'true') {
      return res.status(402).send({ message: 'missing required field' });
    }
    return requests
      .findAll()
      .then(allRequests => res.status(200).send(allRequests))
      .catch(() => res.status(500).send({ message: 'some went wrong'}));
  }

  static rejectRequest(req, res) {
    const requestId = parseInt(req.params.requestId, 10);
    const { isAdmin } = req.query;
    if (isAdmin !== 'true') {
      return res.status(402).send({ message: 'you are not permitted to perform this action' });
    }
    if (isAdmin !== 'true' || !requestId) {
      return res.status(400).send({ message: 'missiging required field' });
    }

    return requests
      .findById(requestId)
      .then((request) => {
        return requests
          .update(
            {
              id: request.id,
            },
            {
              updatedAt: 'now()',
              status: 'rejected',
            },
          )
          .then(updatedRequest => res.status(200).send(updatedRequest));
      })
      .catch(error => res.status(404).send(error));
  }

  static approveRequest(req, res) {
    const requestId = parseInt(req.params.requestId, 10);
    const { isAdmin } = req.query;
    if (isAdmin !== 'true') {
      return res.status(402).send({ message: 'you are not permitted to perform this action' });
    }
    if (!requestId) {
      return res.status(400).send({ message: 'missiging required field' });
    }

    return requests
      .findById(requestId)
      .then((request) => {
        return requests
          .update(
            {
              id: request.id,
            },
            {
              updatedAt: 'now()',
              status: 'pending',
            },
          )
          .then(updatedRequest => res.status(200).send(updatedRequest));
      })
      .catch(error => res.status(404).send(error));
  }

  static resolveRequest(req, res) {
    const requestId = parseInt(req.params.requestId, 10);
    const { isAdmin } = req.query;
    if (isAdmin !== 'true') {
      return res.status(402).send({ message: 'you are not permitted to perform this action' });
    }
    if (!requestId) {
      return res.status(400).send({ message: 'missiging required field' });
    }
    return requests
      .findById(requestId)
      .then((request) => {
        return requests
          .update(
            {
              id: request.id,
            },
            {
              updatedAt: 'now()',
              status: 'resolved',
            },
          )
          .then(updatedRequest => res.status(200).send(updatedRequest));
      })
      .catch(error => res.status(404).send(error));
  }
};
export default AdminController;
