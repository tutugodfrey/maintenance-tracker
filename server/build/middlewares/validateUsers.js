'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateSignin = exports.validateSignup = undefined;

var _services = require('./../services/services');

var validateSignup = exports.validateSignup = function validateSignup(req, res, next) {
  var _req$body = req.body,
      fullname = _req$body.fullname,
      username = _req$body.username,
      email = _req$body.email,
      address = _req$body.address,
      phone = _req$body.phone,
      password = _req$body.password,
      confirmPassword = _req$body.confirmPassword,
      isAdmin = _req$body.isAdmin,
      serviceName = _req$body.serviceName;


  if (username.trim() === '' || fullname.trim() === '' || email.trim() === '' || password.trim() === '' || confirmPassword.trim() === '') {
    (0, _services.handleResponse)(res, 400, 'missing required field');
  }
  var emailRegExp = /\w+@\w+\.(net|com|org)/;
  if (!email.match(emailRegExp)) {
    (0, _services.handleResponse)(res, 400, 'typeError: invalid email format');
  }

  if (password.length < 6 || confirmPassword.length < 6) {
    (0, _services.handleResponse)(res, 400, 'length of password must not be less than 6');
  }

  if (password !== confirmPassword) {
    (0, _services.handleResponse)(res, 400, 'password does not match');
  }

  if (address.trim() === '') {
    (0, _services.handleResponse)(res, 400, 'missing required field');
  }

  if (phone.trim() === '') {
    (0, _services.handleResponse)(res, 400, 'missing required field');
  }

  if (!isAdmin && isAdmin.trim() !== '') {
    (0, _services.handleResponse)(res, 400, 'isAdmin must be a true if set');
  }

  if (!isAdmin) {
    req.body.serviceName = '';
  }

  if (Boolean(isAdmin) && serviceName.trim() === '') {
    (0, _services.handleResponse)(res, 400, 'please provide a service name for users to recognize your services');
  }

  var imgUrl = '/users-photo/default.png';
  if (req.file) {
    // get path to updated file
    imgUrl = (0, _services.getImgUrl)(req.file.path);
  }
  req.body.imgUrl = imgUrl;

  next();
};

var validateSignin = exports.validateSignin = function validateSignin(req, res, next) {
  var _req$body2 = req.body,
      username = _req$body2.username,
      password = _req$body2.password;

  if (username.trim() === '' || password.trim() === '') {
    (0, _services.handleResponse)(res, 400, 'Please fill in the required fields');
  }

  next();
};
//# sourceMappingURL=validateUsers.js.map