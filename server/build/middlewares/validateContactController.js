'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateAddMessage = undefined;

var _services = require('./../services/services');

var validateAddMessage = exports.validateAddMessage = function validateAddMessage(req, res, next) {
  var _req$body = req.body,
      receiverId = _req$body.receiverId,
      title = _req$body.title,
      message = _req$body.message;

  if (!parseInt(receiverId, 10)) {
    (0, _services.handleResponse)(res, 400, 'missing required field');
  }
  if (message.trim() === '') {
    (0, _services.handleResponse)(res, 400, 'missing required field');
  }

  next();
};
//# sourceMappingURL=validateContactController.js.map