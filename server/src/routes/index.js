import RequestController from './../controllers/RequestController';

// const requestController = new RequestController();
const Routes = class {
  constructor() {
    this.RequestController = RequestController;
  }
  /* eslint-disable class-methods-use-thiss */
  routes(app) {
    app.get('/', (req, res) => {
      res.status(200).send({ message: 'welcome to the maintenance trackers' });
    });

    app.post('/api/v1/users/requests', this.RequestController.addRequest);
    app.get('/api/v1/users/requests/:requestId', this.RequestController.getOneRequest);
    app.get('/api/v1/users/requests', this.RequestController.getAllRequests);
    app.put('/api/v1/users/requests/:requestId', this.RequestController.updateRequest);
  }
};

export default Routes;
