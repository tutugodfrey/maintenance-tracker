import RequestController from './../controllers/RequestController';
const requestController = new RequestController();
const Routes = class {
  constructor() {
    this.requestController = requestController;
  }
  /* eslint-disable class-methods-use-this */
  routes(app) {
    app.get('/', (req, res) => {
      res.status(200).send({ message: 'welcome to the maintenance trackers' });
    });

    app.post('/api/v1/users/requests', this.requestController.addRequest);
  }
};

export default Routes;
