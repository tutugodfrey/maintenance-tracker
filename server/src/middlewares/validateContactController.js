import { handleResponse } from './../services/services';
/*  eslint-disable import/prefer-default-export */
export const validateAddMessage = (req, res, next) => {
  const {
    receiverId,
    message,
  } = req.body;
  if (!parseInt(receiverId, 10)) {
    return handleResponse(res, 400, 'missing required field');
  }
  if (message.trim() === '') {
    return handleResponse(res, 400, 'missing required field');
  }

  return next();
};
