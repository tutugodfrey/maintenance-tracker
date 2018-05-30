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

var _Services = require('./../helpers/Services');

var _Services2 = _interopRequireDefault(_Services);

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
          phone = _req$body.phone,
          address = _req$body.address,
          serviceName = _req$body.serviceName,
          password = _req$body.password,
          confirmPassword = _req$body.confirmPassword,
          isAdmin = _req$body.isAdmin;
      // validate input

      if (username.trim() === '' || fullname.trim() === '' || email.trim() === '' || password.trim() === '' || confirmPassword.trim() === '') {
        return res.status(400).send({ message: 'missing required field' });
      }
      var emailRegExp = /\w+@\w+\.(net|com|org)/;
      if (!email.match(emailRegExp)) {
        return res.status(400).send({ message: 'typeError: invalid email format' });
      }

      if (password.length < 6 || confirmPassword.length < 6) {
        return res.status(400).send({ message: 'length of password must not be less than 6' });
      }

      if (password !== confirmPassword) {
        return res.status(400).send({ message: 'password does not match' });
      }

      if (address.trim() === '') {
        return res.status(400).send({ message: 'missing required field' });
      }
      if (!isAdmin && isAdmin.trim() !== '') {
        return res.status(400).send({ message: 'isAdmin must be a true or false' });
      }
      // console.log(req.body)
      if (!req.file) {
        return users.find({
          where: {
            username: username,
            email: email
          }
        }).then(function (user) {
          if (!user) {
            _bcrypt2.default.genSalt(10, function (err, salt) {
              _bcrypt2.default.hash(password, salt, function (hashErr, hash) {
                users.create({
                  fullname: fullname,
                  email: email,
                  username: username,
                  address: address,
                  serviceName: serviceName,
                  password: password,
                  isAdmin: isAdmin || false,
                  imgUrl: 'no/file/uploaded'
                }).then(function (signup) {
                  var authenKeys = {
                    fullname: signup.fullname,
                    email: signup.email,
                    username: signup.username,
                    imgUrl: signup.imgUrl,
                    id: signup.id,
                    isAdmin: signup.isAdmin
                  };
                  var token = _jsonwebtoken2.default.sign(authenKeys, process.env.SECRET_KEY, { expiresIn: '48h' });
                  res.status(201).send({
                    token: token,
                    message: 'signup successful',
                    email: signup.email,
                    username: signup.username,
                    imgUrl: signup.imgUrl,
                    id: signup.id,
                    isAdmin: signup.isAdmin
                  });
                }).catch(function (error) {
                  return res.status(400).send({ error: error });
                });
              });
            });
          } else {
            res.status(409).send({ message: 'user already exist' });
          }
        }).catch(function (error) {
          return res.status(500).send(error);
        });
      }
      return users.find({
        where: {
          username: username,
          email: email
        },
        type: 'or'
      }).then(function (user) {
        if (!user) {
          // handle uploaded profile pix
          var destination = _Services2.default.getImgUrl(req.file.path);
          // const passwd2 = req.body.passwd2;
          _bcrypt2.default.genSalt(10, function (err, salt) {
            _bcrypt2.default.hash(password, salt, function (hashErr, hash) {
              users.create({
                fullname: fullname,
                email: email,
                username: username,
                address: address,
                isAdmin: isAdmin,
                serviceName: serviceName,
                phone: phone,
                imgUrl: destination,
                password: hash
              }).then(function (signup) {
                var authenKeys = {
                  fullname: signup.fullname,
                  email: signup.email,
                  username: signup.username,
                  imgUrl: signup.imgUrl,
                  id: signup.id,
                  isAdmin: signup.isAdmin
                };
                var token = _jsonwebtoken2.default.sign(authenKeys, process.env.SECRET_KEY, { expiresIn: '48h' });
                res.status(201).send({
                  token: token,
                  message: 'signup successful',
                  fullname: signup.fullname,
                  email: signup.email,
                  username: signup.username,
                  imgUrl: signup.imgurl,
                  id: signup.id,
                  isAdmin: signup.isadmin
                });
              }).catch(function (error) {
                return res.status(400).send({ error: error });
              });
            });
          });
        } else {
          res.status(409).send({ message: 'user already exist' });
        }
      }).catch(function (error) {
        return res.status(500).send(error);
      });
    }

    // signin controller

  }, {
    key: 'signin',
    value: function signin(req, res) {
      return users.find({
        where: {
          username: req.body.username
        }
      }).then(function (user) {
        if (user) {
          var passwordConfirmed = false;
          var hashedPassword = user.password;
          var password = req.body.password;

          passwordConfirmed = _bcrypt2.default.compareSync(password, hashedPassword);
          if (passwordConfirmed) {
            var authenKeys = {
              username: user.username,
              fullname: user.fullname,
              isAdmin: user.isAdmin,
              userId: user.id,
              imgUrl: user.imgUrl
            };
            var token = _jsonwebtoken2.default.sign(authenKeys, process.env.SECRET_KEY, { expiresIn: '48h' });
            res.status(200).send({
              token: token,
              success: true,
              username: user.username,
              fullname: user.fullname,
              isAdmin: user.isAdmin,
              userId: user.id,
              imgUrl: user.imgUrl
            });
          } else {
            res.status(400).send({ message: 'authentication fail! check your username or password' });
          }
        } else {
          res.status(400).send({ message: 'authentication fail! check your username or password' });
        }
      }).catch(function (error) {
        return res.status(400).send(error);
      });
    }
  }]);

  return UsersController;
}();

exports.default = UsersController;
//# sourceMappingURL=UsersController.js.map