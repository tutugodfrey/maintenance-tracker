import multer from 'multer';
import UsersController from './../controllers/UsersController';
import RequestController from './../controllers/RequestController';
import ContactController from './../controllers/ContactController';

const UsersStorage = multer.diskStorage({
  destination: './public/users-photo/',
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const usersUpload = multer({ storage: UsersStorage });
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
    app.post('/api/v1/users/signup', usersUpload.single('profile-photo'), this.UsersController.signup);
    app.post('/api/v1/users/signin', this.UsersController.signin);
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
