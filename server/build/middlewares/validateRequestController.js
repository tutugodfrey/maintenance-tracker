'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateDeleteRequest = exports.validateUpdateRequest = exports.validateAdminUpdate = exports.validateAdminGetRequests = exports.validateGetOneRequest = exports.validateCreateRequest = undefined;

var _services = require('./../services/services');

var validateCreateRequest = exports.validateCreateRequest = function validateCreateRequest(req, res, next) {
  var _req$body = req.body,
      category = _req$body.category,
      description = _req$body.description,
      address = _req$body.address,
      urgent = _req$body.urgent,
      adminId = _req$body.adminId;


  if (description.trim() === '' || address.trim() === '' || category.trim() === '') {
    return (0, _services.handleResponse)(res, 400, 'missing required field');
  }
  if (!urgent && urgent.trim() !== '') {
    return (0, _services.handleResponse)(res, 400, 'typeError field urgent must be a boolean');
  }
  if (!parseInt(adminId)) {
    return (0, _services.handleResponse)(res, 400, 'please select a service');
  }
  // pass userId to req.body
  req.body.userId = req.body.decode.id;
  next();
};

var validateGetOneRequest = exports.validateGetOneRequest = function validateGetOneRequest(req, res, next) {
  var requestId = parseInt(req.params.requestId, 10);
  if (!requestId) {
    return (0, _services.handleResponse)(res, 400, 'missing required field');
  }

  next();
};

var validateAdminGetRequests = exports.validateAdminGetRequests = function validateAdminGetRequests(req, res, next) {
  var isAdmin = req.body.decode.isAdmin;

  if (!isAdmin) {
    return (0, _services.handleResponse)(res, 401, 'you are not authorized to perform this action');
  }

  next();
};

var validateAdminUpdate = exports.validateAdminUpdate = function validateAdminUpdate(req, res, next) {
  var requestId = parseInt(req.params.requestId, 10);
  var _req$body$decode = req.body.decode,
      isAdmin = _req$body$decode.isAdmin,
      id = _req$body$decode.id;

  if (!isAdmin) {
    return (0, _services.handleResponse)(res, 401, 'you are not authorized to perform this action');
  }
  if (!requestId) {
    return (0, _services.handleResponse)(res, 400, 'missiging required field');
  }

  next();
};

var validateUpdateRequest = exports.validateUpdateRequest = function validateUpdateRequest(req, res, next) {
  var requestId = parseInt(req.params.requestId, 10);
  if (!requestId) {
    return (0, _services.handleResponse)(res, 400, 'missing required field');
  }

  next();
};

var validateDeleteRequest = exports.validateDeleteRequest = function validateDeleteRequest(req, res, next) {
  var requestId = parseInt(req.params.requestId, 10);
  if (!requestId) {
    return (0, _services.handleResponse)(res, 400, 'missing required field');
  }

  next();
};
//# sourceMappingURL=validateRequestController.js.map