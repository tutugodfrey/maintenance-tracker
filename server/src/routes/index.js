
const Routes = class {
  /* eslint-disable class-methods-use-this */
  routes(app) {
    app.get('/', (req, res) => {
      res.status(200).send({ message: 'welcome to the maintenance trackers' });
    });
  }
};

export default Routes;
