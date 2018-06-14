'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require('./../models/index');

var _index2 = _interopRequireDefault(_index);

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
      var _req$body$decode = req.body.decode,
          isAdmin = _req$body$decode.isAdmin,
          id = _req$body$decode.id;

      if (!isAdmin) {
        return res.status(402).send({ message: 'you are not authorized to perform this action' });
      }
      return requests.findAll({
        where: {
          adminid: id
        }
      }).then(function (clientRequests) {
        if (clientRequests) {
          if (clientRequests.length === 0) {
            return res.status(200).send([]);
          }
          var clientsInfo = [];
          clientRequests.forEach(function (request) {
            return users.getClient(request.userid).then(function (clientInfo) {
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
                return res.status(200).send(clientsInfo);
              }
            }).catch(function (error) {
              return res.status(500).send(error);
            });
          });
        }
      }).catch(function (error) {
        return res.status(500).send({ message: 'something went wrong. please try again' });
      });
    }
  }, {
    key: 'rejectRequest',
    value: function rejectRequest(req, res) {
      var requestId = parseInt(req.params.requestId, 10);
      var _req$body$decode2 = req.body.decode,
          isAdmin = _req$body$decode2.isAdmin,
          id = _req$body$decode2.id;

      if (!isAdmin) {
        return res.status(402).send({ message: 'you are not permitted to perform this action' });
      }
      if (!requestId) {
        return res.status(400).send({ message: 'missiging required field' });
      }

      return requests.find({
        where: {
          id: requestId,
          adminId: parseInt(id, 10)
        }
      }).then(function (request) {
        return requests.update({
          id: request.id
        }, {
          updatedAt: 'now()',
          status: 'rejected'
        }).then(function (updatedRequest) {
          return res.status(200).send(updatedRequest);
        });
      }).catch(function (error) {
        return res.status(404).send(error);
      });
    }
  }, {
    key: 'approveRequest',
    value: function approveRequest(req, res) {
      var requestId = parseInt(req.params.requestId, 10);
      var _req$body$decode3 = req.body.decode,
          isAdmin = _req$body$decode3.isAdmin,
          id = _req$body$decode3.id;

      if (!isAdmin) {
        return res.status(402).send({ message: 'you are not permitted to perform this action' });
      }
      if (!requestId) {
        return res.status(400).send({ message: 'missiging required field' });
      }

      return requests.find({
        where: {
          id: requestId,
          adminId: parseInt(id, 10)
        }
      }).then(function (request) {
        return requests.update({
          id: request.id
        }, {
          updatedAt: 'now()',
          status: 'pending'
        }).then(function (updatedRequest) {
          return res.status(200).send(updatedRequest);
        });
      }).catch(function (error) {
        return res.status(404).send(error);
      });
    }
  }, {
    key: 'resolveRequest',
    value: function resolveRequest(req, res) {
      var requestId = parseInt(req.params.requestId, 10);
      var _req$body$decode4 = req.body.decode,
          isAdmin = _req$body$decode4.isAdmin,
          id = _req$body$decode4.id;

      if (!isAdmin) {
        return res.status(402).send({ message: 'you are not permitted to perform this action' });
      }
      if (!requestId) {
        return res.status(400).send({ message: 'missiging required field' });
      }
      return requests.find({
        where: {
          id: requestId,
          adminId: parseInt(id, 10)
        }
      }).then(function (request) {
        return requests.update({
          id: request.id
        }, {
          updatedAt: 'now()',
          status: 'resolved'
        }).then(function (updatedRequest) {
          return res.status(200).send(updatedRequest);
        });
      }).catch(function (error) {
        return res.status(404).send(error);
      });
    }
  }]);

  return AdminController;
}();
exports.default = AdminController;
//# sourceMappingURL=AdminController.js.map