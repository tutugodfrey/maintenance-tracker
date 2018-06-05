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
      var _req$body = req.body,
          receiverId = _req$body.receiverId,
          title = _req$body.title,
          message = _req$body.message;

      // sender is user with token

      var senderId = req.body.decode.id;
      if (!parseInt(senderId, 10)) {
        return res.status(400).send({ message: 'you are authorized to perform this action. please make sure you are logged in' });
      }
      if (!parseInt(receiverId, 10)) {
        return res.status(400).send({ message: 'missing required field' });
      }
      if (message.trim() === '' || title.trim() === '') {
        return res.status(400).send({ message: 'missing required field' });
      }
      return users.findById(senderId).then(function (user) {
        if (user) {
          return contacts.create({
            receiverId: receiverId,
            senderId: senderId,
            message: message,
            title: title
          }).then(function (newMessage) {
            res.status(201).send(newMessage);
          }).catch(function (error) {
            return res.status(400).send(error);
          });
        }
        return res.status(201).send({ messag: 'Your identity could not be verified. Please make sure you are logged in' });
      }).catch(function (error) {
        return res.status(404).send(error);
      });
    }
  }, {
    key: 'getMessages',
    value: function getMessages(req, res) {
      var userId = parseInt(req.body.decode.id, 10);
      var isAdmin = req.body.decode.isAdmin;

      if (!(userId || isAdmin)) {
        return res.status(400).send({ message: 'you are not authorized to perform this action. please make sure you are logged in' });
      }
      return contacts.findAll({
        where: {
          senderId: userId,
          receiverId: userId
        },
        type: 'or'
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