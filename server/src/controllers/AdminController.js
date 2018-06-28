
import models from './../models/index';
import { handleResponse } from './../services/services';

const { requests, users } = models;
/* eslint-disable consistent-return */
const AdminController = class {
  // get all request for a logged in user
  static getAllRequests(req, res) {
    const { id } = req.body.decode;
    return requests
      .findAll({
        where: {
          adminId: id,
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
              .getClient(request.userId)
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
        // return handleResponse(res, 200, []);
      })
      .catch(() => handleResponse(res, 500, 'something went wrong. please try again'));
  }

  static rejectRequest(req, res) {
    const requestId = parseInt(req.params.requestId, 10);
    const { id } = req.body.decode;
    return requests
      .find({
        where: {
          id: requestId,
          adminId: parseInt(id, 10),
        },
      })
      .then((request) => {
        if (request) {
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
            .then((updatedRequest) => {
              if (updatedRequest) {
                return users
                  .getClient(updatedRequest.userId)
                  .then((user) => {
                    if (user) {
                      return handleResponse(res, 200, {
                        user,
                        request: updatedRequest,
                      });
                    }
                    return handleResponse(res, 200, {
                      user: { message: 'user not found' },
                      request: updatedRequest,
                    });
                  })
                  .catch(() => handleResponse(res, 500, 'something went wrong. please try again'));
              }
            })
            .catch(() => handleResponse(res, 500, 'something went wrong. please try again'));
        }
        return handleResponse(res, 404, 'request not found');
      })
      .catch(() => handleResponse(res, 500, 'something went wrong. please try again'));
  }

  static approveRequest(req, res) {
    const requestId = parseInt(req.params.requestId, 10);
    const { id } = req.body.decode;
    return requests
      .find({
        where: {
          id: requestId,
          adminId: parseInt(id, 10),
        },
      })
      .then((request) => {
        if (request) {
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
            .then((updatedRequest) => {
              if (updatedRequest) {
                return users
                  .getClient(updatedRequest.userId)
                  .then((user) => {
                    if (user) {
                      return handleResponse(res, 200, {
                        user,
                        request: updatedRequest,
                      });
                    }
                    return handleResponse(res, 200, {
                      user: { message: 'user not found' },
                      request: updatedRequest,
                    });
                  })
                  .catch(() => handleResponse(res, 500, 'something went wrong. please try again'));
              }
            })
            .catch(() => handleResponse(res, 500, 'something went wrong. please try again'));
        }
        return handleResponse(res, 404, 'request not found');
      })
      .catch(() => handleResponse(res, 500, 'something went wrong. please try again'));
  }

  static resolveRequest(req, res) {
    const requestId = parseInt(req.params.requestId, 10);
    const { id } = req.body.decode;
    return requests
      .find({
        where: {
          id: requestId,
          adminId: parseInt(id, 10),
        },
      })
      .then((request) => {
        if (request) {
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
            .then((updatedRequest) => {
              if (updatedRequest) {
                return users
                  .getClient(updatedRequest.userId)
                  .then((user) => {
                    if (user) {
                      return handleResponse(res, 200, {
                        user,
                        request: updatedRequest,
                      });
                    }
                    return handleResponse(res, 200, {
                      user: { message: 'user not found' },
                      request: updatedRequest,
                    });
                  })
                  .catch(() => handleResponse(res, 500, 'something went wrong. please try again'));
              }
            })
            .catch(() => handleResponse(res, 500, 'something went wrong. please try again'));
        }
        return handleResponse(res, 404, 'request not found');
      })
      .catch(() => handleResponse(res, 500, 'something went wrong. please try again'));
  }
};
export default AdminController;
