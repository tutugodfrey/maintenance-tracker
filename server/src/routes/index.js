import multer from 'multer';
import jwt from 'jsonwebtoken';
import UsersController from './../controllers/UsersController';
import RequestController from './../controllers/RequestController';
import ContactController from './../controllers/ContactController';
import AdminController from './../controllers/AdminController';

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
    this.AdminController = AdminController;
  }
  /* eslint-disable class-methods-use-thiss */
  routes(app) {
    app.get('/', (req, res) => {
      res.status(200).send({ message: 'welcome to the maintenance trackers' });
    });

    // secure api
    app.use('/secure/', (req, res, next) => {
      const { token } = req.headers;
      /* eslint-disable no-unused-vars */
      const promise = new Promise((resolve, reject) => {
        if (token) {
          jwt.verify(token, process.env.SECRET_KEY, (err, decode) => {
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
};

export default Routes;
