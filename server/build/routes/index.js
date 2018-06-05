'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _UsersController = require('./../controllers/UsersController');

var _UsersController2 = _interopRequireDefault(_UsersController);

var _RequestController = require('./../controllers/RequestController');

var _RequestController2 = _interopRequireDefault(_RequestController);

var _ContactController = require('./../controllers/ContactController');

var _ContactController2 = _interopRequireDefault(_ContactController);

var _AdminController = require('./../controllers/AdminController');

var _AdminController2 = _interopRequireDefault(_AdminController);

var _getToken = require('./../middlewares/getToken');

var _getToken2 = _interopRequireDefault(_getToken);

var _uploadfile = require('./../middlewares/uploadfile');

var _uploadfile2 = _interopRequireDefault(_uploadfile);

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
        res.status(200).sendFile(_path2.default.join(__dirname, './../../../client/index.html'));
      });
      // routes for us
      app.post('/api/v1/auth/signup', _uploadfile2.default.single('profile-photo'), this.UsersController.signup);
      app.post('/api/v1/auth/signin', this.UsersController.signin);
      app.get('/api/v1/auth/services', this.UsersController.getServiceName);

      // admin routes
      app.get('/api/v1/requests', _getToken2.default, this.AdminController.getAllRequests);
      app.put('/api/v1/requests/:requestId/disapprove', _getToken2.default, this.AdminController.rejectRequest);
      app.put('/api/v1/requests/:requestId/approve', _getToken2.default, this.AdminController.approveRequest);
      app.put('/api/v1/requests/:requestId/resolve', _getToken2.default, this.AdminController.resolveRequest);

      // user routes
      app.post('/api/v1/users/requests', _getToken2.default, this.RequestController.addRequest);
      app.get('/api/v1/users/requests/:requestId', _getToken2.default, this.RequestController.getOneRequest);
      app.get('/api/v1/users/requests', _getToken2.default, this.RequestController.getAllRequests);
      app.put('/api/v1/users/requests/:requestId', _getToken2.default, this.RequestController.updateRequest);
      app.delete('/api/v1/users/requests/:requestId', _getToken2.default, this.RequestController.deleteRequest);
      // routes for contacts model
      app.post('/api/v1/contacts', _getToken2.default, this.ContactController.addMessage);
      app.get('/api/v1/contacts', _getToken2.default, this.ContactController.getMessages);
    }
  }]);

  return Routes;
}();

exports.default = Routes;
//# sourceMappingURL=index.js.map