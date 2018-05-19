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
      var userId = parseInt(req.body.userId, 10);
      if (!req.body.userId || !req.body.description) {
        return res.status(400).send({ message: 'missing required field' });
      }
      return users.findById(userId).then(function (user) {
        return requests.create({
          userId: userId,
          category: req.body.category,
          description: req.body.description,
          department: req.body.department,
          urgency: req.body.urgency,
          status: req.body.status
        }).then(function (request) {
          return res.status(201).send({
            request: request,
            user: user
          });
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
      if (!requestId) {
        return res.status(400).send({ message: 'missing required field' });
      }
      return requests.find({
        where: {
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
      var requestId = parseInt(req.params.requestId, 10);
      if (!requestId) {
        return res.status(400).send({ message: 'missing required field' });
      }
      return requests.findById(requestId).then(function (request) {
        return requests.update(request, {
          category: req.body.category || request.category,
          description: req.body.description || request.description,
          department: req.body.department || request.department,
          urgency: req.body.urgency || request.urgency,
          status: req.body.status || request.status
        }).then(function (newRequest) {
          return res.status(200).send(newRequest);
        }).catch(function (error) {
          return res.status(400).send(error);
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