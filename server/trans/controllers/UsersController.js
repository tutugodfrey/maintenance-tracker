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

var _HelperFuncts = require('./../helpers/HelperFuncts');

var _HelperFuncts2 = _interopRequireDefault(_HelperFuncts);

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
      if (!req.file) {
        return users.findAll({
          where: {
            username: req.body.username,
            email: req.body.email
          }
        }).then(function () {
          var _req$body = req.body,
              passwd1 = _req$body.passwd1,
              passwd2 = _req$body.passwd2;

          var passwd = void 0;
          if (passwd1 === passwd2) {
            _bcrypt2.default.genSalt(10, function (err, salt) {
              _bcrypt2.default.hash(passwd1, salt, function (hashErr, hash) {
                passwd = hash;
                users.create({
                  password: passwd,
                  fullname: req.body.fullname,
                  email: req.body.email,
                  username: req.body.username,
                  imgUrl: 'no/file/uploaded',
                  address: req.body.address,
                  isAdmin: req.body.isAdmin,
                  serviceName: req.body.serviceName
                }).then(function (signup) {
                  res.status(201).send({
                    message: 'signup successful',
                    fullname: signup.fullname,
                    email: signup.email,
                    username: signup.username,
                    imgUrl: signup.imgUrl,
                    id: signup.id
                  });
                }).catch(function () {
                  return res.status(400).send({ message: 'user already exist' });
                });
              });
            });
          } else {
            // password match fail
            res.status(400).send({ message: 'password does not match' });
          }
        }).catch(function (error) {
          return res.status(500).send(error);
        });
      }
      return users.findAll({
        where: {
          username: req.body.username,
          email: req.body.email
        }
      }).then(function () {
        // handle uploaded profile pix
        var destination = _HelperFuncts2.default.getImgUrl(req.file.path);
        var _req$body2 = req.body,
            passwd1 = _req$body2.passwd1,
            passwd2 = _req$body2.passwd2;
        // const passwd2 = req.body.passwd2;

        var passwd = void 0;
        if (passwd1 === passwd2) {
          _bcrypt2.default.genSalt(10, function (err, salt) {
            _bcrypt2.default.hash(passwd1, salt, function (hashErr, hash) {
              passwd = hash;
              users.create({
                password: passwd,
                fullname: req.body.fullname,
                email: req.body.email,
                username: req.body.username,
                imgUrl: destination,
                address: req.body.address,
                isAdmin: req.body.isAdmin,
                serviceName: req.body.serviceName
              }).then(function (signup) {
                res.status(201).send({
                  message: 'signup successful',
                  fullname: signup.fullname,
                  email: signup.email,
                  username: signup.username,
                  imgUrl: signup.imgUrl,
                  id: signup.id,
                  isAdmin: signup.isAdmin
                });
              }).catch(function () {
                return res.status(400).send({ message: 'user already exist' });
              });
            });
          });
        } else {
          // password match fail
          res.status(400).send({ message: 'password does not match' });
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
            var authenKey = user.username;
            var token = _jsonwebtoken2.default.sign({ authenKey: authenKey }, process.env.SECRET_KEY, { expiresIn: '48h' });
            res.status(200).send({
              token: token,
              success: true,
              username: user.username,
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