import path from 'path';
import UsersController from './../controllers/UsersController';
import RequestController from './../controllers/RequestController';
import ContactController from './../controllers/ContactController';
import AdminController from './../controllers/AdminController';
import secureRoute from './../middlewares/getToken';
import usersUpload from './../middlewares/uploadfile';
import swaggerUi from 'swagger-ui-express';
import swaggerApiDoc from './../../../swaggerApiDoc/swaggerApiDoc.json';

const routes = (app) => {
  app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, './../../../client/index.html'));
  });
  app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerApiDoc));
  // routes for us
  app.post('/api/v1/auth/signup', usersUpload.single('profile-photo'), UsersController.signup);
  app.post('/api/v1/auth/signin', UsersController.signin);
  app.get('/api/v1/auth/services', UsersController.getServiceName);

  // admin routes
  app.get('/api/v1/requests', secureRoute, AdminController.getAllRequests);
  app.put('/api/v1/requests/:requestId/disapprove', secureRoute, AdminController.rejectRequest);
  app.put('/api/v1/requests/:requestId/approve', secureRoute, AdminController.approveRequest);
  app.put('/api/v1/requests/:requestId/resolve', secureRoute, AdminController.resolveRequest);

  // user routes
  app.post('/api/v1/users/requests', secureRoute, RequestController.addRequest);
  app.get('/api/v1/users/requests/:requestId', secureRoute, RequestController.getOneRequest);
  app.get('/api/v1/users/requests', secureRoute, RequestController.getAllRequests);
  app.put('/api/v1/users/requests/:requestId', secureRoute, RequestController.updateRequest);
  app.delete('/api/v1/users/requests/:requestId', secureRoute, RequestController.deleteRequest);
  // routes for contacts model
  app.post('/api/v1/contacts', secureRoute, ContactController.addMessage);
  app.get('/api/v1/contacts', secureRoute, ContactController.getMessages);
  return app;
}

export default routes;
