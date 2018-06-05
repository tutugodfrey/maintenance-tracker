import path from 'path';
import UsersController from './../controllers/UsersController';
import RequestController from './../controllers/RequestController';
import ContactController from './../controllers/ContactController';
import AdminController from './../controllers/AdminController';
import secureRoute from './../middlewares/getToken';
import usersUpload from './../middlewares/uploadfile';

// const requestController = new RequestController();
const Routes = class {
  constructor() {
    this.UsersController = UsersController;
    this.RequestController = RequestController;
    this.ContactController = ContactController;
    this.AdminController = AdminController;
  }
  /* eslint-disable class-methods-use-thiss */
  routes(app) {
    app.get('/', (req, res) => {
      res.status(200).sendFile(path.join(__dirname, './../../../client/index.html'));
    });
    // routes for us
    app.post('/api/v1/auth/signup', usersUpload.single('profile-photo'), this.UsersController.signup);
    app.post('/api/v1/auth/signin', this.UsersController.signin);
    app.get('/api/v1/auth/services', this.UsersController.getServiceName);

    // admin routes
    app.get('/api/v1/requests', secureRoute, this.AdminController.getAllRequests);
    app.put('/api/v1/requests/:requestId/disapprove', secureRoute, this.AdminController.rejectRequest);
    app.put('/api/v1/requests/:requestId/approve', secureRoute, this.AdminController.approveRequest);
    app.put('/api/v1/requests/:requestId/resolve', secureRoute, this.AdminController.resolveRequest);

    // user routes
    app.post('/api/v1/users/requests', secureRoute, this.RequestController.addRequest);
    app.get('/api/v1/users/requests/:requestId', secureRoute, this.RequestController.getOneRequest);
    app.get('/api/v1/users/requests', secureRoute, this.RequestController.getAllRequests);
    app.put('/api/v1/users/requests/:requestId', secureRoute, this.RequestController.updateRequest);
    app.delete('/api/v1/users/requests/:requestId', secureRoute, this.RequestController.deleteRequest);
    // routes for contacts model
    app.post('/api/v1/contacts', secureRoute, this.ContactController.addMessage);
    app.get('/api/v1/contacts', secureRoute, this.ContactController.getMessages);
  }
};

export default Routes;
