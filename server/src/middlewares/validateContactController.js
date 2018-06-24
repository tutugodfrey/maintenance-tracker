import { handleResponse } from './../services/services'
export const validateAddMessage = (req, res, next) => {
  const {
    receiverId,
    title,
    message,
  } = req.body;
  if (!parseInt(receiverId, 10)) {
    return handleResponse(res, 400, 'missing required field');
  }
  if (message.trim() === '') {
    return handleResponse(res, 400, 'missing required field');
  }

  next();
}
