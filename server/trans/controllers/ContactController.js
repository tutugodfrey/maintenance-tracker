'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require('./../models/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var users = _index2.default.users,
    contacts = _index2.default.contacts;

var ContactController = function () {
  function ContactController() {
    _classCallCheck(this, ContactController);
  }

  _createClass(ContactController, null, [{
    key: 'addMessage',

    // create a new message
    value: function addMessage(req, res) {
      var userId = parseInt(req.body.userId, 10);
      var adminId = parseInt(req.body.adminId, 10);
      if (!userId) {
        return res.status(400).send({ message: 'missing required field' });
      }
      return users.findById(userId).then(function (user) {
        return contacts.create({
          userId: userId,
          adminId: adminId,
          title: req.body.title,
          message: req.body.message
        }).then(function (message) {
          res.status(201).send({
            message: message,
            user: user
          });
        }).catch(function (error) {
          return res.status(400).send(error);
        });
      }).catch(function (error) {
        return res.status(404).send(error);
      });
    }
  }]);

  return ContactController;
}();

exports.default = ContactController;
//# sourceMappingURL=ContactController.js.map