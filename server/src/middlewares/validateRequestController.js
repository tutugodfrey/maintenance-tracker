import { handleResponse } from './../services/services';

export const validateCreateRequest = (req, res, next) => {
  const {
    category,
    description,
    address,
    urgent,
    adminId,
  } = req.body;

  if (description.trim() === '' || address.trim() === '' || category.trim() === '') {
    return handleResponse(res, 400, 'missing required field');
  }
  if (!urgent && urgent.trim() !== '') {
    return handleResponse(res, 400, 'typeError field urgent must be a boolean');
  }
  if (!parseInt(adminId, 10)) {
    return handleResponse(res, 400, 'please select a service');
  }
  // pass userId to req.body
  req.body.userId = req.body.decode.id;
  return next();
};

export const validateGetOneRequest = (req, res, next) => {
  const requestId = parseInt(req.params.requestId, 10);
  if (!requestId) {
    return handleResponse(res, 400, 'missing required field');
  }

  return next();
};

export const validateAdminGetRequests = (req, res, next) => {
  const { isAdmin } = req.body.decode;
  if (!isAdmin) {
    return handleResponse(res, 401, 'you are not authorized to perform this action');
  }

  return next();
};

export const validateAdminUpdate = (req, res, next) => {
  const requestId = parseInt(req.params.requestId, 10);
  const {
    isAdmin,
  } = req.body.decode;
  if (!isAdmin) {
    return handleResponse(res, 401, 'you are not authorized to perform this action');
  }
  if (!requestId) {
    return handleResponse(res, 400, 'missing required field');
  }

  return next();
};

export const validateUpdateRequest = (req, res, next) => {
  const requestId = parseInt(req.params.requestId, 10);
  if (!requestId) {
    return handleResponse(res, 400, 'missing required field');
  }

  return next();
};

export const validateDeleteRequest = (req, res, next) => {
  const requestId = parseInt(req.params.requestId, 10);
  if (!requestId) {
    return handleResponse(res, 400, 'missing required field');
  }

  return next();
};
