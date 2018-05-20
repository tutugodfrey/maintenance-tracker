import RequestController from './../controllers/RequestController';
import ContactController from './../controllers/ContactController';
import UsersController from './../controllers/UsersController';

// const requestController = new RequestController();
const Routes = class {
  constructor() {
    this.UsersController = UsersController;
    this.RequestController = RequestController;
    this.ContactController = ContactController;
  }
  /* eslint-disable class-methods-use-thiss */
  routes(app) {
    app.get('/', (req, res) => {
      res.status(200).send({ message: 'welcome to the maintenance trackers' });
    });

    // routes for users
    app.post('/api/v1/users/signup', this.UsersController.signup);

    // routes for requests model
    app.post('/api/v1/users/requests', this.RequestController.addRequest);
    app.get('/api/v1/users/requests/:requestId', this.RequestController.getOneRequest);
    app.get('/api/v1/users/requests', this.RequestController.getAllRequests);
    app.put('/api/v1/users/requests/:requestId', this.RequestController.updateRequest);
    app.delete('/api/v1/users/requests/:requestId', this.RequestController.deleteRequest);

    // routes for contacts model
    app.post('/api/v1/contacts', this.ContactController.addMessage);
    app.get('/api/v1/contacts', this.ContactController.getMessages);
  }
};

export default Routes;
