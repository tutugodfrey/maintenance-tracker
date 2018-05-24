'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _UsersController = require('./../controllers/UsersController');

var _UsersController2 = _interopRequireDefault(_UsersController);

var _RequestController = require('./../controllers/RequestController');

var _RequestController2 = _interopRequireDefault(_RequestController);

var _ContactController = require('./../controllers/ContactController');

var _ContactController2 = _interopRequireDefault(_ContactController);

var _AdminController = require('./../controllers/AdminController');

var _AdminController2 = _interopRequireDefault(_AdminController);

var _getToken = require('./../middlewares/getToken');

var _uploadfile = require('./../middlewares/uploadfile');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

      // routes for us
      app.post('/api/v1/auth/signup', _uploadfile.usersUpload.single('profile-photo'), this.UsersController.signup);
      app.post('/api/v1/auth/signin', this.UsersController.signin);

      // admin routes
      app.get('/api/v1/requests', _getToken.secureRoute, this.AdminController.getAllRequests);
      app.put('/api/v1/requests/:requestId/disapprove', _getToken.secureRoute, this.AdminController.rejectRequest);
      app.put('/api/v1/requests/:requestId/approve', _getToken.secureRoute, this.AdminController.approveRequest);
      app.put('/api/v1/requests/:requestId/resolve', _getToken.secureRoute, this.AdminController.resolveRequest);

      // user routes
      app.post('/api/v1/users/requests', _getToken.secureRoute, this.RequestController.addRequest);
      app.get('/api/v1/users/requests/:requestId', _getToken.secureRoute, this.RequestController.getOneRequest);
      app.get('/api/v1/users/requests', _getToken.secureRoute, this.RequestController.getAllRequests);
      app.put('/api/v1/users/requests/:requestId', _getToken.secureRoute, this.RequestController.updateRequest);
      app.delete('/api/v1/users/requests/:requestId', _getToken.secureRoute, this.RequestController.deleteRequest);
      // routes for contacts model
      app.post('/api/v1/contacts', _getToken.secureRoute, this.ContactController.addMessage);
      app.get('/api/v1/contacts', _getToken.secureRoute, this.ContactController.getMessages);
    }
  }]);

  return Routes;
}();

exports.default = Routes;
//# sourceMappingURL=index.js.map