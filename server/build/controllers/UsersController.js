'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dotenvSafe = require('dotenv-safe');

var _dotenvSafe2 = _interopRequireDefault(_dotenvSafe);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _index = require('./../models/index');

var _index2 = _interopRequireDefault(_index);

var _services = require('./../services/services');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

_dotenvSafe2.default.config();

var users = _index2.default.users;

var UsersController = function () {
  function UsersController() {
    _classCallCheck(this, UsersController);
  }

  _createClass(UsersController, null, [{
    key: 'signup',

    // create a new user account
    value: function signup(req, res) {
      var _req$body = req.body,
          fullname = _req$body.fullname,
          username = _req$body.username,
          email = _req$body.email,
          address = _req$body.address,
          phone = _req$body.phone,
          password = _req$body.password,
          confirmPassword = _req$body.confirmPassword,
          isAdmin = _req$body.isAdmin,
          serviceName = _req$body.serviceName,
          imgUrl = _req$body.imgUrl;


      return users.find({
        where: {
          username: username,
          email: email
        },
        type: 'or'
      }).then(function (user) {
        if (!user) {
          var salt = _bcrypt2.default.genSaltSync(10);
          var hashedPassword = _bcrypt2.default.hashSync(password, salt);
          return users.create({
            fullname: fullname,
            email: email,
            username: username,
            address: address,
            serviceName: serviceName,
            phone: phone,
            imgUrl: imgUrl,
            password: hashedPassword,
            isAdmin: Boolean(isAdmin) || false
          }).then(function (createdUser) {
            var authenKeys = {
              fullname: createdUser.fullname,
              email: createdUser.email,
              username: createdUser.username,
              phone: createdUser.phone,
              imgUrl: createdUser.imgUrl,
              id: createdUser.id,
              isAdmin: createdUser.isAdmin,
              serviceName: createdUser.serviceName
            };
            var token = _jsonwebtoken2.default.sign(authenKeys, process.env.SECRET_KEY, { expiresIn: '48h' });
            (0, _services.handleResponse)(res, 201, {
              token: token,
              fullname: createdUser.fullname,
              email: createdUser.email,
              username: createdUser.username,
              imgUrl: createdUser.imgUrl,
              id: createdUser.id,
              isAdmin: createdUser.isAdmin,
              serviceName: createdUser.serviceName
            });
          }).catch(function () {
            return (0, _services.handleResponse)(res, 500, 'something went wrong! try again later');
          });
        }
        return (0, _services.handleResponse)(res, 409, 'user already exist');
      }).catch(function () {
        return (0, _services.handleResponse)(res, 500, 'something went wrong! try again later');
      });
    }

    // signin controller

  }, {
    key: 'signin',
    value: function signin(req, res) {
      var _req$body2 = req.body,
          username = _req$body2.username,
          password = _req$body2.password;


      return users.find({
        where: {
          username: username
        }
      }).then(function (user) {
        if (user) {
          var passwordConfirmed = false;
          var hashedPassword = user.password;
          passwordConfirmed = _bcrypt2.default.compareSync(password, hashedPassword);
          if (passwordConfirmed) {
            var authenKeys = {
              username: user.username,
              fullname: user.fullname,
              isAdmin: user.isAdmin,
              id: user.id,
              imgUrl: user.imgUrl,
              serviceName: user.serviceName
            };
            var token = _jsonwebtoken2.default.sign(authenKeys, process.env.SECRET_KEY, { expiresIn: '48h' });
            return (0, _services.handleResponse)(res, 200, {
              token: token,
              fullname: user.fullname,
              email: user.email,
              username: user.username,
              imgUrl: user.imgUrl,
              id: user.id,
              isAdmin: user.isAdmin,
              serviceName: user.serviceName
            });
          }
          return (0, _services.handleResponse)(res, 401, 'authentication fail! check your username or password');
        }
        return (0, _services.handleResponse)(res, 401, 'authentication fail! check your username or password');
      }).catch(function () {
        return (0, _services.handleResponse)(res, 500, 'something went wrong! try again later');
      });
    }
  }, {
    key: 'getServiceName',
    value: function getServiceName(req, res) {
      return users.findServiceName().then(function (serviceNames) {
        if (serviceNames) {
          return (0, _services.handleResponse)(res, 200, serviceNames);
        }
        return (0, _services.handleResponse)(res, 404, 'service not avialable yet');
      }).catch(function () {
        return (0, _services.handleResponse)(res, 500, 'something went wrong! try again later');
      });
    }
  }]);

  return UsersController;
}();

exports.default = UsersController;
//# sourceMappingURL=UsersController.js.map