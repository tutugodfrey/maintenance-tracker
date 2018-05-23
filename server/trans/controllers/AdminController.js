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
      var isAdmin = req.query.isAdmin;
      if (isAdmin !== 'true') {
        return res.status(402).send({ message: 'missing required field' });
      }
      return requests.findAll().then(function (allRequests) {
        return res.status(200).send(allRequests);
      }).catch(function (error) {
        return res.status(500).send(error);
      });
    }
  }]);

  return AdminController;
}();
exports.default = AdminController;
//# sourceMappingURL=AdminController.js.map