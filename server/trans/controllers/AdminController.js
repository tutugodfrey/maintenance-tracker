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

var requests = _index2.default.requests;

var AdminController = function () {
  function AdminController() {
    _classCallCheck(this, AdminController);
  }

  _createClass(AdminController, null, [{
    key: 'getAllRequests',

    // get all request for a logged in user
    value: function getAllRequests(req, res) {
      var isAdmin = req.query.isAdmin;

      if (isAdmin !== 'true') {
        return res.status(402).send({ message: 'missing required field' });
      }
      return requests.findAll().then(function (allRequests) {
        return res.status(200).send(allRequests);
      }).catch(function () {
        return res.status(500).send({ message: 'some went wrong' });
      });
    }
  }, {
    key: 'rejectRequest',
    value: function rejectRequest(req, res) {
      var requestId = parseInt(req.params.requestId, 10);
      var isAdmin = req.query.isAdmin;

      if (isAdmin !== 'true') {
        return res.status(402).send({ message: 'you are not permitted to perform this action' });
      }
      if (isAdmin !== 'true' || !requestId) {
        return res.status(400).send({ message: 'missiging required field' });
      }
      var updatedAt = _Services2.default.getDate();
      var dateRegExp = /\d{4}-\d{2}-\d{2}/;
      if (!dateRegExp.test(updatedAt)) {
        return res.status(500).send({ message: 'an error occur while processing your request' });
      }
      return requests.findById(requestId).then(function (request) {
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
      var isAdmin = req.query.isAdmin;

      if (isAdmin !== 'true') {
        return res.status(402).send({ message: 'you are not permitted to perform this action' });
      }
      if (!requestId) {
        return res.status(400).send({ message: 'missiging required field' });
      }
      var updatedAt = _Services2.default.getDate();
      var dateRegExp = /\d{4}-\d{2}-\d{2}/;
      if (!dateRegExp.test(updatedAt)) {
        return res.status(500).send({ message: 'an error occur while processing your request' });
      }
      return requests.findById(requestId).then(function (request) {
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
      var isAdmin = req.query.isAdmin;

      if (isAdmin !== 'true') {
        return res.status(402).send({ message: 'you are not permitted to perform this action' });
      }
      if (!requestId) {
        return res.status(400).send({ message: 'missiging required field' });
      }
      var updatedAt = _Services2.default.getDate();
      var dateRegExp = /\d{4}-\d{2}-\d{2}/;
      if (!dateRegExp.test(updatedAt)) {
        return res.status(500).send({ message: 'an error occur while processing your request' });
      }
      return requests.findById(requestId).then(function (request) {
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