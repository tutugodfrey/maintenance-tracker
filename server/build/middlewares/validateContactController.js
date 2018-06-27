'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateAddMessage = undefined;

var _services = require('./../services/services');

/*  eslint-disable import/prefer-default-export */
var validateAddMessage = exports.validateAddMessage = function validateAddMessage(req, res, next) {
  var _req$body = req.body,
      receiverId = _req$body.receiverId,
      message = _req$body.message;

  if (!parseInt(receiverId, 10)) {
    return (0, _services.handleResponse)(res, 400, 'missing required field');
  }
  if (message.trim() === '') {
    return (0, _services.handleResponse)(res, 400, 'missing required field');
  }

  return next();
};
//# sourceMappingURL=validateContactController.js.map