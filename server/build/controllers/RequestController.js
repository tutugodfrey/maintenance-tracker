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

var RequestController = function () {
  function RequestController() {
    _classCallCheck(this, RequestController);
  }

  _createClass(RequestController, null, [{
    key: 'addRequest',

    // add a new request
    value: function addRequest(req, res) {
      var id = req.body.decode.id;

      var userId = id;
      var _req$body = req.body,
          category = _req$body.category,
          description = _req$body.description,
          address = _req$body.address,
          urgent = _req$body.urgent,
          adminId = _req$body.adminId;


      if (!parseInt(userId, 10) || description.trim() === '' || address.trim() === '' || category.trim() === '') {
        return res.status(400).send({ message: 'missing required field' });
      }
      if (!urgent && urgent.trim() !== '') {
        return res.status(400).send({ message: 'typeError field urgent must be a boolean' });
      }
      if (!parseInt(adminId)) {
        return res.status(400).send({ message: 'please select a service' });
      }

      return users.findById(parseInt(userId, 10)).then(function (user) {
        if (user) {
          requests.create({
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
            return res.status(201).send(request);
          }).catch(function (error) {
            return res.status(400).send(error);
          });
        }
      }).catch(function (error) {
        return res.status(404).send(error);
      });
    }

    // get a signle requests for a logged in user

  }, {
    key: 'getOneRequest',
    value: function getOneRequest(req, res) {
      var requestId = parseInt(req.params.requestId, 10);
      var userId = parseInt(req.body.decode.id, 10);
      if (!requestId || !userId) {
        return res.status(400).send({ message: 'missing required field' });
      }
      return requests.find({
        where: {
          userId: userId,
          id: requestId
        }
      }).then(function (request) {
        if (!request) {
          return res.status(404).send({ message: 'request not found' });
        }
        return res.status(200).send(request);
      }).catch(function (error) {
        return res.status(500).send(error);
      });
    }

    // get all request for a logged in user

  }, {
    key: 'getAllRequests',
    value: function getAllRequests(req, res) {
      var userId = parseInt(req.body.decode.id, 10);
      if (!userId) {
        return res.status(400).send({ message: 'missing required field' });
      }
      return requests.findAll({
        where: {
          userId: userId
        }
      }).then(function (clientRequests) {
        if (clientRequests) {
          if (clientRequests.length === 0) {
            return res.status(200).send([]);
          }
          var clientsInfo = [];
          clientRequests.forEach(function (request) {
            return users.getClient(request.adminid).then(function (clientInfo) {
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
      if (!requestId || !userId) {
        return res.status(400).send({ message: 'missing required field' });
      }
      if (category === 'select' || category === 'Select') {
        return res.status(400).send({ message: 'Please select a category for your repair request' });
      }
      if (!parseInt(adminId)) {
        return res.status(400).send({ message: 'please select a service provider' });
      }
      return requests.find({
        where: {
          userId: userId,
          id: requestId
        }
      }).then(function (request) {
        // users should not be able to modify the status of a request
        if (request.status === 'approved' || request.status === 'resolved') {
          return res.status(200).send({ message: 'request cannot be modify after it has been approved or resolved' });
        }
        return requests.update({
          id: request.id
        }, {
          updatedAt: 'now()',
          category: category || request.category,
          description: description || request.description,
          address: address || request.address,
          adminId: adminId || request.adminid,
          urgent: urgent || request.urgent
        }).then(function (newRequest) {
          return res.status(200).send(newRequest);
        }).catch(function (error) {
          return res.status(500).send(error);
        });
      }).catch(function (error) {
        return res.status(404).send(error);
      });
    }
  }, {
    key: 'deleteRequest',
    value: function deleteRequest(req, res) {
      var requestId = parseInt(req.params.requestId, 10);
      var userId = parseInt(req.body.decode.id, 10);
      if (!requestId || !userId) {
        return res.status(400).send({ message: 'missing required field' });
      }
      return requests.destroy({
        where: {
          userId: userId,
          id: requestId
        }
      }).then(function (rows) {
        if (rows.length === 0) {
          res.status(404).send({ message: 'request not found, not action taken' });
        }
        res.status(200).send({ message: 'request has been deleted' });
      }).catch(function (error) {
        return res.status(404).send(error);
      });
    }
  }]);

  return RequestController;
}();
exports.default = RequestController;
//# sourceMappingURL=RequestController.js.map