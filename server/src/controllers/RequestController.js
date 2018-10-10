
import models from './../models/index';
import { handleResponse } from './../services/services';

const { requests, users } = models;
/* eslint-disable consistent-return */
const RequestController = class {
  // add a new request
  static addRequest(req, res) {
    const {
      category,
      description,
      address,
      urgent,
      adminId,
      userId,
    } = req.body;

    return users.findById(parseInt(userId, 10))
      .then((user) => {
        if (user) {
          return users
            .findById(parseInt(adminId, 10))
            .then((admin) => {
              if (admin && admin.serviceName) {
                return requests
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
                  .then(request => {
                    const newRequest = {
                      request,
                      user:  admin,
                    };
                    return handleResponse(res, 201, newRequest)
                  })
                  .catch(() => handleResponse(res, 500, 'something went wrong! please try again later'));
              }
              return handleResponse(res, 404, 'service not found');
            });
        }
        return handleResponse(res, 401, 'user identity not verified! please make sure you are logged in');
      })
      .catch(() => handleResponse(res, 500, 'something went wrong! please try again later'));
  }

  // get a signle requests for a logged in user
  static getOneRequest(req, res) {
    const requestId = parseInt(req.params.requestId, 10);
    const userId = parseInt(req.body.decode.id, 10);
    return requests
      .find({
        where: {
          userId,
          id: requestId,
        },
      })
      .then((request) => {
        if (!request) {
          return handleResponse(res, 404, 'request not found');
        }
        return users
          .getClient(request.adminId)
          .then((client) => {
            if (client) {
              return handleResponse(res, 200, {
                request,
                user: client,
              });
            }
            return handleResponse(res, 200, {
              request,
              user: { message: 'user not found' },
            });
          });
      })
      .catch(() => handleResponse(res, 500, 'something went wrong. please try again'));
  }

  // get all request for a logged in user
  static getAllRequests(req, res) {
    const userId = parseInt(req.body.decode.id, 10);
    return requests
      .findAll({
        where: {
          userId,
        },
      })
      .then((clientRequests) => {
        if (clientRequests) {
          if (clientRequests.length === 0) {
            return handleResponse(res, 200, []);
          }
          const clientsInfo = [];
          clientRequests.forEach((request) => {
            return users
              .getClient(request.adminId)
              .then((clientInfo) => {
                return clientInfo;
              })
              .then((clientInfo) => {
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
                  return handleResponse(res, 200, clientsInfo);
                }
              })
              .catch(() => handleResponse(res, 500, 'something went wrong. please try again'));
          });
        }
      })
      .catch(() => handleResponse(res, 500, 'something went wrong. please try again'));
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
    return requests
      .find({
        where: {
          userId,
          id: requestId,
        },
      })
      .then((request) => {
        if (request) {
          // users should not be able to modify the status of a request
          if (request.status === 'pending' || request.status === 'resolved') {
            return handleResponse(res, 200, 'request cannot be modify after it has been approved or resolved');
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
                adminId: adminId || request.adminId,
                urgent: urgent || request.urgent,
              },
            )
            .then((newRequest) => {
              // get the associated admin
              return users
                .getClient(newRequest.adminId)
                .then((admin) => {
                  if (admin) {
                    return handleResponse(res, 200, {
                      request: newRequest,
                      user: admin,
                    });
                  }
                  return handleResponse(res, 200, {
                    request: newRequest,
                    user: { message: 'user not found' },
                  });
                })
                .catch(() => handleResponse(res, 500, 'something went wrong. please try again'));
            })
            .catch(() => handleResponse(res, 500, 'something went wrong. please try again'));
        }
        return handleResponse(res, 404, 'request not found');
      })
      .catch(() => handleResponse(res, 505, 'something went wrong. please try again'));
  }

  static deleteRequest(req, res) {
    const requestId = parseInt(req.params.requestId, 10);
    const userId = parseInt(req.body.decode.id, 10);
    return requests
      .destroy({
        where: {
          userId,
          id: requestId,
        },
      })
      .then((rows) => {
        if (rows.length === 0) {
          return handleResponse(res, 404, 'request not found, not action taken');
        }
        return handleResponse(res, 200, 'request has been deleted');
      })
      .catch(() => handleResponse(res, 500, 'something went wrong. please try again'));
  }
};
export default RequestController;
