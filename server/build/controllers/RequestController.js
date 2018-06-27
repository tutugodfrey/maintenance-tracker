'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require('./../models/index');

var _index2 = _interopRequireDefault(_index);

var _services = require('./../services/services');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var requests = _index2.default.requests,
    users = _index2.default.users;
/* eslint-disable consistent-return */

var RequestController = function () {
  function RequestController() {
    _classCallCheck(this, RequestController);
  }

  _createClass(RequestController, null, [{
    key: 'addRequest',

    // add a new request
    value: function addRequest(req, res) {
      var _req$body = req.body,
          category = _req$body.category,
          description = _req$body.description,
          address = _req$body.address,
          urgent = _req$body.urgent,
          adminId = _req$body.adminId,
          userId = _req$body.userId;


      return users.findById(parseInt(userId, 10)).then(function (user) {
        if (user) {
          return users.findById(parseInt(adminId, 10)).then(function (admin) {
            if (admin && admin.serviceName) {
              return requests.create({
                userId: userId,
                category: category,
                description: description,
                address: address,
                adminId: adminId,
                issueDate: 'now()',
                updatedAt: 'now()',
                status: 'awaiting confirmation',
                urgent: urgent || false
              }).then(function (request) {
                return (0, _services.handleResponse)(res, 201, request);
              }).catch(function () {
                return (0, _services.handleResponse)(res, 500, 'something went wrong! please try again later');
              });
            }
            return (0, _services.handleResponse)(res, 404, 'service not found');
          });
        }
        return (0, _services.handleResponse)(res, 401, 'user identity not verified! please make sure you are logged in');
      }).catch(function () {
        return (0, _services.handleResponse)(res, 500, 'something went wrong! please try again later');
      });
    }

    // get a signle requests for a logged in user

  }, {
    key: 'getOneRequest',
    value: function getOneRequest(req, res) {
      var requestId = parseInt(req.params.requestId, 10);
      var userId = parseInt(req.body.decode.id, 10);
      return requests.find({
        where: {
          userId: userId,
          id: requestId
        }
      }).then(function (request) {
        if (!request) {
          return (0, _services.handleResponse)(res, 404, 'request not found');
        }
        return users.getClient(request.adminId).then(function (client) {
          if (client) {
            return (0, _services.handleResponse)(res, 200, {
              request: request,
              user: client
            });
          }
          return (0, _services.handleResponse)(res, 200, {
            request: request,
            user: { message: 'user not found' }
          });
        });
      }).catch(function () {
        return (0, _services.handleResponse)(res, 500, 'something went wrong. please try again');
      });
    }

    // get all request for a logged in user

  }, {
    key: 'getAllRequests',
    value: function getAllRequests(req, res) {
      var userId = parseInt(req.body.decode.id, 10);
      return requests.findAll({
        where: {
          userId: userId
        }
      }).then(function (clientRequests) {
        if (clientRequests) {
          if (clientRequests.length === 0) {
            return (0, _services.handleResponse)(res, 200, []);
          }
          var clientsInfo = [];
          clientRequests.forEach(function (request) {
            return users.getClient(request.adminId).then(function (clientInfo) {
              return clientInfo;
            }).then(function (clientInfo) {
              if (clientInfo) {
                clientsInfo.push({
                  request: request,
                  user: clientInfo
                });
              } else {
                clientsInfo.push({
                  request: request,
                  user: { message: 'user not found' }
                });
              }
              if (clientsInfo.length === clientRequests.length) {
                return (0, _services.handleResponse)(res, 200, clientsInfo);
              }
            }).catch(function () {
              return (0, _services.handleResponse)(res, 500, 'something went wrong. please try again');
            });
          });
        }
      }).catch(function () {
        return (0, _services.handleResponse)(res, 500, 'something went wrong. please try again');
      });
    }

    // update a request

  }, {
    key: 'updateRequest',
    value: function updateRequest(req, res) {
      var _req$body2 = req.body,
          category = _req$body2.category,
          description = _req$body2.description,
          address = _req$body2.address,
          adminId = _req$body2.adminId,
          urgent = _req$body2.urgent;

      var requestId = parseInt(req.params.requestId, 10);
      var userId = parseInt(req.body.decode.id, 10);
      return requests.find({
        where: {
          userId: userId,
          id: requestId
        }
      }).then(function (request) {
        if (request) {
          // users should not be able to modify the status of a request
          if (request.status === 'approved' || request.status === 'resolved') {
            return (0, _services.handleResponse)(res, 200, 'request cannot be modify after it has been approved or resolved');
          }
          return requests.update({
            id: request.id
          }, {
            updatedAt: 'now()',
            category: category || request.category,
            description: description || request.description,
            address: address || request.address,
            adminId: adminId || request.adminId,
            urgent: urgent || request.urgent
          }).then(function (newRequest) {
            // get the associated admin
            return users.getClient(newRequest.adminId).then(function (admin) {
              if (admin) {
                return (0, _services.handleResponse)(res, 200, {
                  request: newRequest,
                  user: admin
                });
              }
              return (0, _services.handleResponse)(res, 200, {
                request: newRequest,
                user: { message: 'user not found' }
              });
            }).catch(function () {
              return (0, _services.handleResponse)(res, 500, 'something went wrong. please try again');
            });
          }).catch(function () {
            return (0, _services.handleResponse)(res, 500, 'something went wrong. please try again');
          });
        }
        return (0, _services.handleResponse)(res, 404, 'request not found');
      }).catch(function () {
        return (0, _services.handleResponse)(res, 505, 'something went wrong. please try again');
      });
    }
  }, {
    key: 'deleteRequest',
    value: function deleteRequest(req, res) {
      var requestId = parseInt(req.params.requestId, 10);
      var userId = parseInt(req.body.decode.id, 10);
      return requests.destroy({
        where: {
          userId: userId,
          id: requestId
        }
      }).then(function (rows) {
        if (rows.length === 0) {
          return (0, _services.handleResponse)(res, 404, 'request not found, not action taken');
        }
        return (0, _services.handleResponse)(res, 200, 'request has been deleted');
      }).catch(function () {
        return (0, _services.handleResponse)(res, 500, 'something went wrong. please try again');
      });
    }
  }]);

  return RequestController;
}();
exports.default = RequestController;
//# sourceMappingURL=RequestController.js.map