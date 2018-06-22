'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _swaggerUiExpress = require('swagger-ui-express');

var _swaggerUiExpress2 = _interopRequireDefault(_swaggerUiExpress);

var _swaggerApiDoc = require('./../../../swaggerApiDoc/swaggerApiDoc.json');

var _swaggerApiDoc2 = _interopRequireDefault(_swaggerApiDoc);

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

var _validateUsers = require('./../middlewares/validateUsers');

var _validateRequestController = require('./../middlewares/validateRequestController');

var _validateContactController = require('./../middlewares/validateContactController');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var routes = function routes(app) {
  app.get('/', function (req, res) {
    res.status(200).sendFile(_path2.default.join(__dirname, './../../../client/index.html'));
  });
  app.use('/api/v1/docs', _swaggerUiExpress2.default.serve, _swaggerUiExpress2.default.setup(_swaggerApiDoc2.default));
  // routes for us
  app.post('/api/v1/auth/signup', _uploadfile2.default.single('profile-photo'), _validateUsers.validateSignup, _UsersController2.default.signup);
  app.post('/api/v1/auth/signin', _validateUsers.validateSignin, _UsersController2.default.signin);
  app.get('/api/v1/auth/services', _UsersController2.default.getServiceName);

  // admin routes
  app.get('/api/v1/requests', _getToken2.default, _validateRequestController.validateAdminGetRequests, _AdminController2.default.getAllRequests);
  app.put('/api/v1/requests/:requestId/disapprove', _getToken2.default, _validateRequestController.validateAdminUpdate, _AdminController2.default.rejectRequest);
  app.put('/api/v1/requests/:requestId/approve', _getToken2.default, _validateRequestController.validateAdminUpdate, _AdminController2.default.approveRequest);
  app.put('/api/v1/requests/:requestId/resolve', _getToken2.default, _validateRequestController.validateAdminUpdate, _AdminController2.default.resolveRequest);

  // user routes
  app.post('/api/v1/users/requests', _getToken2.default, _validateRequestController.validateCreateRequest, _RequestController2.default.addRequest);
  app.get('/api/v1/users/requests/:requestId', _getToken2.default, _validateRequestController.validateGetOneRequest, _RequestController2.default.getOneRequest);
  app.get('/api/v1/users/requests', _getToken2.default, _RequestController2.default.getAllRequests);
  app.put('/api/v1/users/requests/:requestId', _getToken2.default, _validateRequestController.validateUpdateRequest, _RequestController2.default.updateRequest);
  app.delete('/api/v1/users/requests/:requestId', _getToken2.default, _validateRequestController.validateDeleteRequest, _RequestController2.default.deleteRequest);
  // routes for contacts model
  app.post('/api/v1/contacts', _getToken2.default, _validateContactController.validateAddMessage, _ContactController2.default.addMessage);
  app.get('/api/v1/contacts', _getToken2.default, _ContactController2.default.getMessages);
  return app;
};

exports.default = routes;
//# sourceMappingURL=index.js.map