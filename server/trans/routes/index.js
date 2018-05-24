'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _UsersController = require('./../controllers/UsersController');

var _UsersController2 = _interopRequireDefault(_UsersController);

var _RequestController = require('./../controllers/RequestController');

var _RequestController2 = _interopRequireDefault(_RequestController);

var _ContactController = require('./../controllers/ContactController');

var _ContactController2 = _interopRequireDefault(_ContactController);

var _AdminController = require('./../controllers/AdminController');

var _AdminController2 = _interopRequireDefault(_AdminController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UsersStorage = _multer2.default.diskStorage({
  destination: './public/users-photo/',
  filename: function filename(req, file, cb) {
    cb(null, file.originalname);
  }
});
var usersUpload = (0, _multer2.default)({ storage: UsersStorage });
// const requestController = new RequestController();
var Routes = function () {
  function Routes() {
    _classCallCheck(this, Routes);

    this.UsersController = _UsersController2.default;
    this.RequestController = _RequestController2.default;
    this.ContactController = _ContactController2.default;
    this.AdminController = _AdminController2.default;
  }
  /* eslint-disable class-methods-use-thiss */


  _createClass(Routes, [{
    key: 'routes',
    value: function routes(app) {
      app.get('/', function (req, res) {
        res.status(200).send({ message: 'welcome to the maintenance trackers' });
      });

      // secure api
      app.use('/secure/', function (req, res, next) {
        var token = req.headers.token;
        /* eslint-disable no-unused-vars */

        var promise = new Promise(function (resolve, reject) {
          if (token) {
            _jsonwebtoken2.default.verify(token, process.env.SECRET_KEY, function (err, decode) {
              if (err) {
                resolve(res.status(401).send('Invalid Token'));
              } else {
                resolve(next());
              }
            });
          } else {
            resolve(res.status(402).send('Please send a token'));
          }
        });
        return promise;
      });
      // routes for us
      app.post('/api/v1/auth/signup', usersUpload.single('profile-photo'), this.UsersController.signup);
      app.post('/api/v1/auth/signin', this.UsersController.signin);

      // admin routes
      app.get('/secure/api/v1/requests', this.AdminController.getAllRequests);
      app.put('/secure/api/v1/requests/:requestId/disapprove', this.AdminController.rejectRequest);
      app.put('/secure/api/v1/requests/:requestId/approve', this.AdminController.approveRequest);
      app.put('/secure/api/v1/requests/:requestId/resolve', this.AdminController.resolveRequest);

      // user routes
      app.post('/secure/api/v1/users/requests', this.RequestController.addRequest);
      app.get('/secure/api/v1/users/requests/:requestId', this.RequestController.getOneRequest);
      app.get('/secure/api/v1/users/requests', this.RequestController.getAllRequests);
      app.put('/secure/api/v1/users/requests/:requestId', this.RequestController.updateRequest);
      app.delete('/secure/api/v1/users/requests/:requestId', this.RequestController.deleteRequest);
      // routes for contacts model
      app.post('/secure/api/v1/contacts', this.ContactController.addMessage);
      app.get('/secure/api/v1/contacts', this.ContactController.getMessages);
    }
  }]);

  return Routes;
}();

exports.default = Routes;
//# sourceMappingURL=index.js.map