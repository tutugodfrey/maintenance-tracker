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
      return users.findById(senderId).then(function (user) {
        if (user) {
          return contacts.create({
            receiverId: receiverId,
            senderId: senderId,
            message: message,
            title: title
          }).then(function (newMessage) {
            (0, _services.handleResponse)(res, 201, newMessage);
          }).catch(function () {
            return (0, _services.handleResponse)(res, 500, 'something went wrong. please try again');
          });
        }
        return (0, _services.handleResponse)(res, 404, 'Your identity could not be verified. Please make sure you are logged in');
      }).catch(function () {
        return (0, _services.handleResponse)(res, 500, 'something went wrong. please try again');
      });
    }
  }, {
    key: 'getMessages',
    value: function getMessages(req, res) {
      var userId = parseInt(req.body.decode.id, 10);
      return contacts.findAll({
        where: {
          senderId: userId,
          receiverId: userId
        },
        type: 'or'
      }).then(function (messages) {
        if (messages) {
          // no messages has been send or received
          if (messages.length === 0) {
            return (0, _services.handleResponse)(res, 200, []);
          }
          var clientsInfo = [];
          messages.forEach(function (message) {
            // object to hold message sender and receiver
            var messageObj = {};
            messageObj.message = message;

            // get info of message sender
            return users.getClient(message.senderId).then(function (sender) {
              return sender;
            }).then(function (sender) {
              if (sender) {
                messageObj.sender = sender;
              } else {
                messageObj.sender = { message: 'user not found' };
              }
            }).then(function () {
              // get info of message receiver
              return users.getClient(message.receiverId).then(function (receiver) {
                return receiver;
              }).then(function (receiver) {
                if (receiver) {
                  messageObj.receiver = receiver;
                } else {
                  messageObj.receiver = { message: 'user not found' };
                }

                // push messageObj to collection
                clientsInfo.push(messageObj);
                if (clientsInfo.length === messages.length) {
                  return (0, _services.handleResponse)(res, 200, clientsInfo);
                }
              });
            });
          });
        }
      }).catch(function () {
        return (0, _services.handleResponse)(res, 500, 'something went wrong. please try again');
      });
    }
  }]);

  return ContactController;
}();

exports.default = ContactController;
//# sourceMappingURL=ContactController.js.map