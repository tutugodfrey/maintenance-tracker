
import models from './../models/index';

const { requests, users } = models;
const RequestController = class {
  // add a new request
  static addRequest(req, res) {
    const { id } = req.body.decode;
    const userId = id;
    const {
      category,
      description,
      address,
      urgent,
      adminId,
    } = req.body;

    if (!parseInt(userId, 10) || description.trim() === '' || address.trim() === '' || category.trim() === '') {
      return res.status(400).send({ message: 'missing required field' });
    }
    if (!urgent && urgent.trim() !== '') {
      return res.status(400).send({ message: 'typeError field urgent must be a boolean' });
    }
    if (!parseInt(adminId)) {
      return res.status(400).send({ message: 'please select a service'})
    }

    return users.findById(parseInt(userId, 10))
      .then((user) => {
        if (user) {
          requests
            .create({
              userId,
              category,
              description,
              address,
              adminId,
              issueDate: 'now()',
              updatedAt: 'now()',
              status: 'awaiting confirmation',
              urgent: urgent || false,
            })
            .then(request => res.status(201).send(request))
            .catch(error => res.status(400).send(error));
        }
      })
      .catch(error => res.status(404).send(error));
  }

  // get a signle requests for a logged in user
  static getOneRequest(req, res) {
    const requestId = parseInt(req.params.requestId, 10);
    const userId = parseInt(req.body.decode.id, 10);
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
      .then((request) => {
        if (!request) {
          return res.status(404).send({ message: 'request not found' });
        }
        return res.status(200).send(request);
      })
      .catch(error => res.status(500).send(error));
  }

  // get all request for a logged in user
  static getAllRequests(req, res) {
    const userId = parseInt(req.body.decode.id, 10);
    if (!userId) {
      return res.status(400).send({ message: 'missing required field' });
    }
    return requests
      .findAll({
        where: {
          userId,
        },
      })
      .then((clientRequests) => {
        if (clientRequests) {
          if (clientRequests.length === 0) {
            return res.status(200).send([])
          }
          const clientsInfo = [];
          clientRequests.forEach((request) => {
            return users
              .getClient(request.adminid)
              .then((clientInfo) => {
                return clientInfo;
              })
              .then(clientInfo => {
                if (clientInfo) {
                  clientsInfo.push({
                    request,
                    user: clientInfo,
                  });
                } else {
                  clientsInfo.push({
                    request,
                    user: { message: 'user not found' },
                });
                }
                if (clientsInfo.length === clientRequests.length) {
                  return res.status(200).send(clientsInfo)
                }
                
              })
              .catch(error => res.status(500).send(error));
          })
        }
      })
      .catch(error => res.status(500).send({ message: 'something went wrong. please try again' }))
  }

  // update a request
  static updateRequest(req, res) {
    const {
      category,
      description,
      address,
      adminId,
      urgent,
    } = req.body;
    const requestId = parseInt(req.params.requestId, 10);
    const userId = parseInt(req.body.decode.id, 10);
    if (!requestId || !userId) {
      return res.status(400).send({ message: 'missing required field' });
    }
    if (category === 'select' || category === 'Select') {
      return res.status(400).send({ message: 'Please select a category for your repair request'})
    }
    if (!parseInt(adminId)) {
      return res.status(400).send({ message: 'please select a service provider'})
    }
    return requests
      .find({
        where: {
          userId,
          id: requestId,
        },
      })
      .then((request) => {
        // users should not be able to modify the status of a request
        if (request.status === 'approved' || request.status === 'resolved') {
          return res.status(200).send({ message: 'request cannot be modify after it has been approved or resolved' });
        }
        return requests
          .update(
            {
              id: request.id,
            },
            {
              updatedAt: 'now()',
              category: category || request.category,
              description: description || request.description,
              address: address || request.address,
              adminId: adminId || request.adminid,
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
    const userId = parseInt(req.body.decode.id, 10);
    if (!requestId || !userId) {
      return res.status(400).send({ message: 'missing required field' });
    }
    return requests
      .destroy({
        where: {
          userid: userId,
          id: requestId,
        },
      })
      .then((rows) => {
        if (rows.length === 0) {
          res.status(404).send({ message: 'request not found, not action taken' });
        }
        res.status(200).send({ message: 'request has been deleted' });
      })
      .catch(error => res.status(404).send(error));
  }
};
export default RequestController;
