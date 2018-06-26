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

var AdminController = function () {
  function AdminController() {
    _classCallCheck(this, AdminController);
  }

  _createClass(AdminController, null, [{
    key: 'getAllRequests',

    // get all request for a logged in user
    value: function getAllRequests(req, res) {
      var id = req.body.decode.id;

      return requests.findAll({
        where: {
          adminId: id
        }
      }).then(function (clientRequests) {
        if (clientRequests) {
          if (clientRequests.length === 0) {
            return (0, _services.handleResponse)(res, 200, []);
          }
          var clientsInfo = [];
          clientRequests.forEach(function (request) {
            return users.getClient(request.userId).then(function (clientInfo) {
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
  }, {
    key: 'rejectRequest',
    value: function rejectRequest(req, res) {
      var requestId = parseInt(req.params.requestId, 10);
      var id = req.body.decode.id;

      return requests.find({
        where: {
          id: requestId,
          adminId: parseInt(id, 10)
        }
      }).then(function (request) {
        if (request) {
          return requests.update({
            id: request.id
          }, {
            updatedAt: 'now()',
            status: 'rejected'
          }).then(function (updatedRequest) {
            if (updatedRequest) {
              return users.getClient(updatedRequest.userId).then(function (user) {
                if (user) {
                  return (0, _services.handleResponse)(res, 200, {
                    user: user,
                    request: updatedRequest
                  });
                }
                return (0, _services.handleResponse)(res, 200, {
                  user: { message: 'user not found' },
                  request: updatedRequest
                });
              }).catch(function () {
                return (0, _services.handleResponse)(res, 500, 'something went wrong. please try again');
              });
            }
          }).catch(function () {
            return (0, _services.handleResponse)(res, 500, 'something went wrong. please try again');
          });
        }
        return (0, _services.handleResponse)(res, 404, 'request not found');
      }).catch(function () {
        return (0, _services.handleResponse)(res, 500, 'something went wrong. please try again');
      });
    }
  }, {
    key: 'approveRequest',
    value: function approveRequest(req, res) {
      var requestId = parseInt(req.params.requestId, 10);
      var id = req.body.decode.id;

      return requests.find({
        where: {
          id: requestId,
          adminId: parseInt(id, 10)
        }
      }).then(function (request) {
        if (request) {
          return requests.update({
            id: request.id
          }, {
            updatedAt: 'now()',
            status: 'pending'
          }).then(function (updatedRequest) {
            if (updatedRequest) {
              return users.getClient(updatedRequest.userId).then(function (user) {
                if (user) {
                  return (0, _services.handleResponse)(res, 200, {
                    user: user,
                    request: updatedRequest
                  });
                }
                return (0, _services.handleResponse)(res, 200, {
                  user: { message: 'user not found' },
                  request: updatedRequest
                });
              }).catch(function () {
                return (0, _services.handleResponse)(res, 500, 'something went wrong. please try again');
              });
            }
          }).catch(function () {
            return (0, _services.handleResponse)(res, 500, 'something went wrong. please try again');
          });
        }
        return (0, _services.handleResponse)(res, 404, 'request not found');
      }).catch(function () {
        return (0, _services.handleResponse)(res, 500, 'something went wrong. please try again');
      });
    }
  }, {
    key: 'resolveRequest',
    value: function resolveRequest(req, res) {
      var requestId = parseInt(req.params.requestId, 10);
      var id = req.body.decode.id;

      return requests.find({
        where: {
          id: requestId,
          adminId: parseInt(id, 10)
        }
      }).then(function (request) {
        if (request) {
          return requests.update({
            id: request.id
          }, {
            updatedAt: 'now()',
            status: 'resolved'
          }).then(function (updatedRequest) {
            if (updatedRequest) {
              return users.getClient(updatedRequest.userId).then(function (user) {
                if (user) {
                  return (0, _services.handleResponse)(res, 200, {
                    user: user,
                    request: updatedRequest
                  });
                }
                return (0, _services.handleResponse)(res, 200, {
                  user: { message: 'user not found' },
                  request: updatedRequest
                });
              }).catch(function () {
                return (0, _services.handleResponse)(res, 500, 'something went wrong. please try again');
              });
            }
          }).catch(function () {
            return (0, _services.handleResponse)(res, 500, 'something went wrong. please try again');
          });
        }
        return (0, _services.handleResponse)(res, 404, 'request not found');
      }).catch(function () {
        return (0, _services.handleResponse)(res, 500, 'something went wrong. please try again');
      });
    }
  }]);

  return AdminController;
}();
exports.default = AdminController;
//# sourceMappingURL=AdminController.js.map