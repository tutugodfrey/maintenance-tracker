import path from 'path';
import swaggerUi from 'swagger-ui-express';
import swaggerApiDoc from './../../../swaggerApiDoc/swaggerApiDoc.json';
import UsersController from './../controllers/UsersController';
import RequestController from './../controllers/RequestController';
import ContactController from './../controllers/ContactController';
import AdminController from './../controllers/AdminController';
import secureRoute from './../middlewares/getToken';
import usersUpload from './../middlewares/uploadfile';
import {
  validateSignup,
  validateSignin,
} from './../middlewares/validateUsers';
import {
  validateCreateRequest,
  validateGetOneRequest,
  validateUpdateRequest,
  validateDeleteRequest,
  validateAdminUpdate,
  validateAdminGetRequests,
} from './../middlewares/validateRequestController';
import { validateAddMessage } from './../middlewares/validateContactController';

const routes = (app) => {
  app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, './../../../client/index.html'));
  });
  app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerApiDoc));
  // routes for us
  app.post('/api/v1/auth/signup', usersUpload.single('profile-photo'), validateSignup, UsersController.signup);
  app.post('/api/v1/auth/signin', validateSignin, UsersController.signin);
  app.get('/api/v1/auth/services', UsersController.getServiceName);

  // admin routes
  app.get('/api/v1/requests', secureRoute, validateAdminGetRequests, AdminController.getAllRequests);
  app.put('/api/v1/requests/:requestId/disapprove', secureRoute, validateAdminUpdate, AdminController.rejectRequest);
  app.put('/api/v1/requests/:requestId/approve', secureRoute, validateAdminUpdate, AdminController.approveRequest);
  app.put('/api/v1/requests/:requestId/resolve', secureRoute, validateAdminUpdate, AdminController.resolveRequest);

  // user routes
  app.post('/api/v1/users/requests', secureRoute, validateCreateRequest, RequestController.addRequest);
  app.get('/api/v1/users/requests/:requestId', secureRoute, validateGetOneRequest, RequestController.getOneRequest);
  app.get('/api/v1/users/requests', secureRoute, RequestController.getAllRequests);
  app.put('/api/v1/users/requests/:requestId', secureRoute, validateUpdateRequest, RequestController.updateRequest);
  app.delete('/api/v1/users/requests/:requestId', secureRoute, validateDeleteRequest, RequestController.deleteRequest);
  // routes for contacts model
  app.post('/api/v1/contacts', secureRoute, validateAddMessage, ContactController.addMessage);
  app.get('/api/v1/contacts', secureRoute, ContactController.getMessages);
  return app;
};

export default routes;
