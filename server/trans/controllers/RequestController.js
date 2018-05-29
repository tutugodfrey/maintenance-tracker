'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require('./../models/index');

var _index2 = _interopRequireDefault(_index);

var _Services = require('./../helpers/Services');

var _Services2 = _interopRequireDefault(_Services);

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
      var _req$body = req.body,
          userId = _req$body.userId,
          category = _req$body.category,
          description = _req$body.description,
          address = _req$body.address,
          urgent = _req$body.urgent,
          serviceName = _req$body.serviceName;


      if (!parseInt(userId, 10) || description.trim() === '' || address.trim() === '' || category.trim() === '') {
        return res.status(400).send({ message: 'missing required field' });
      }
      if (!urgent && urgent.trim() !== '') {
        return res.status(400).send({ message: 'typeError field urgent must be a boolean' });
      }
      var issueDate = _Services2.default.getDate();
      var dateRegExp = /\d{4}-\d{2}-\d{2}/;
      if (!dateRegExp.test(issueDate)) {
        return res.status(500).send({ message: 'an error occur while processing your request' });
      }
      return users.findById(parseInt(userId, 10)).then(function (user) {
        return requests.create({
          userId: userId,
          category: category,
          description: description,
          address: address,
          issueDate: 'now()',
          updatedAt: 'now()',
          status: 'awaiting confirmation',
          urgent: urgent || false
        }).then(function (request) {
          return res.status(201).send(request);
        }).catch(function (error) {
          return res.status(400).send(error);
        });
      }).catch(function (error) {
        return res.status(404).send(error);
      });
    }

    // get a signle requests for a logged in user

  }, {
    key: 'getOneRequest',
    value: function getOneRequest(req, res) {
      var requestId = parseInt(req.params.requestId, 10);
      var userId = parseInt(req.query.userId, 10);
      if (!requestId || !userId) {
        return res.status(400).send({ message: 'missing required field' });
      }
      return requests.find({
        where: {
          userId: userId,
          id: requestId
        }
      }).then(function (request) {
        return res.status(200).send(request);
      }).catch(function (error) {
        return res.status(404).send(error);
      });
    }

    // get all request for a logged in user

  }, {
    key: 'getAllRequests',
    value: function getAllRequests(req, res) {
      var userId = parseInt(req.query.userId, 10);
      if (!userId) {
        return res.status(400).send({ message: 'missing required field' });
      }
      return requests.findAll({
        where: {
          userId: userId
        }
      }).then(function (allRequests) {
        return res.status(200).send(allRequests);
      }).catch(function (error) {
        return res.status(500).send(error);
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
          serviceName = _req$body2.serviceName,
          urgent = _req$body2.urgent;

      var requestId = parseInt(req.params.requestId, 10);
      var userId = parseInt(req.query.userId, 10);
      if (!requestId || !userId) {
        return res.status(400).send({ message: 'missing required field' });
      }
      var updatedAt = _Services2.default.getDate();
      var dateRegExp = /\d{4}-\d{2}-\d{2}/;
      if (!dateRegExp.test(updatedAt)) {
        return res.status(500).send({ message: 'an error occur while processing your request' });
      }
      return requests.find({
        where: {
          userId: userId,
          id: requestId
        },
        type: 'or'
      }).then(function (request) {
        // users should not be able to modify the status of a request
        if (request.status === 'approved' || request.status === 'resolved') {
          return res.status(200).send({ message: 'request cannot be modify after it has been approved or resolved' });
        }
        return requests.update(request, {
          updatedAt: 'now()',
          category: category || request.category,
          description: description || request.description,
          address: address || request.address,
          serviceName: serviceName || request.serviceName,
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
      var userId = parseInt(req.query.userId, 10);
      if (!requestId || !userId) {
        return res.status(400).send({ message: 'missing required field' });
      }
      return requests.destroy({
        where: {
          userId: userId,
          id: requestId
        }
      }).then(function (newRequest) {
        return res.status(200).send(newRequest);
      }).catch(function (error) {
        return res.status(404).send(error);
      });
    }
  }]);

  return RequestController;
}();
exports.default = RequestController;
//# sourceMappingURL=RequestController.js.map