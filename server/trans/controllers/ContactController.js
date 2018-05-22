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
      var senderId = parseInt(req.body.senderId, 10);
      var message = req.body.message.trim();
      if (!userId || !adminId || !senderId) {
        return res.status(400).send({ message: 'missing required field' });
      }
      return users.findById(senderId).then(function (user) {
        return contacts.create({
          userId: userId,
          adminId: adminId,
          senderId: senderId,
          message: message,
          title: req.body.title
        }).then(function (newMessage) {
          res.status(201).send({
            newMessage: newMessage,
            user: user
          });
        }).catch(function (error) {
          return res.status(400).send(error);
        });
      }).catch(function (error) {
        return res.status(404).send(error);
      });
    }
  }, {
    key: 'getMessages',
    value: function getMessages(req, res) {
      var userId = parseInt(req.query.userId, 10);
      var isAdmin = req.query.isAdmin;

      if (!(userId || isAdmin)) {
        return res.status(400).send({ message: 'missing required field' });
      }
      if (isAdmin === 'true') {
        return contacts.findAll().then(function (messages) {
          return res.status(200).send(messages);
        }).catch(function (error) {
          return res.status(500).send(error);
        });
      }
      return contacts.findAll({
        where: {
          userId: userId
        }
      }).then(function (messages) {
        return res.status(200).send(messages);
      }).catch(function (error) {
        return res.status(500).send(error);
      });
    }
  }]);

  return ContactController;
}();

exports.default = ContactController;
//# sourceMappingURL=ContactController.js.map