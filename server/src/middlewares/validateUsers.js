import { getImgUrl, handleResponse } from './../services/services'
export const validateSignup = (req, res, next) => {
  const {
    fullname,
    username,
    email,
    address,
    phone,
    password,
    confirmPassword,
    isAdmin,
    serviceName
  } = req.body;

  if (username.trim() === '' || fullname.trim() === '' || email.trim() === ''
  || password.trim() === '' || confirmPassword.trim() === '') {
    handleResponse(res, 400, 'missing required field');
  }
  const emailRegExp = /\w+@\w+\.(net|com|org)/;
  if (!email.match(emailRegExp)) {
    handleResponse(res, 400, 'typeError: invalid email format');
  }

  if (password.length < 6 || confirmPassword.length < 6) {
    handleResponse(res, 400, 'length of password must not be less than 6');
  }

  if (password !== confirmPassword) {
    handleResponse(res, 400, 'password does not match');
  }

  if (address.trim() === '') {
    handleResponse(res, 400, 'missing required field');
  }

  if (phone.trim() === '') {
    handleResponse(res, 400, 'missing required field');
  }
  
  if (!isAdmin && isAdmin.trim() !== '') {
    handleResponse(res, 400, 'isAdmin must be a true if set');
  }

  if (!isAdmin) {
    req.body.serviceName = '';
  }

  if (Boolean(isAdmin) && serviceName.trim() === '') {
    handleResponse(res, 400, 'please provide a service name for users to recognize your services');
  }

  let imgUrl = '/users-photo/default.png';
  if (req.file) {
  // get path to updated file
  imgUrl = getImgUrl(req.file.path);
  }
  req.body.imgUrl = imgUrl;

  next();
}

export const validateSignin = (req, res, next) => {
  const {
    username,
    password,
  } = req.body;
  if (username.trim() === '' || password.trim() === '') {
    handleResponse(res, 400, 'Please fill in the required fields');
  }

  next();
}