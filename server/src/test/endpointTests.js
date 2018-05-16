import chai from 'chai';
import chaiHttp from 'chai-http';
import Server from './../app';

const server = new Server();
const app = server.expressServer();
const { expect } = chai;
chai.use(chaiHttp);

// enforce test to run in test env
if (process.env.NODE_ENV !== 'test') {
  /* eslint-disable no-console */
  console.log(`can't run test in non test env. you are in ${process.env.NODE_ENV} environment`);
} else {
  describe('API End Points', () => {
    // test home route
    describe('Home', () => {
      it('should return welcome message', () => {
        return chai.request(app)
          .get('/')
          .then((res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('Object');
            expect(res.body).to.eql({ message: 'welcome to the maintenance trackers' });
          });
      });
    });

    describe('Empty request model', () => {
      it('should return an empty array', () => {
        return chai.request(app)
          .get('/api/v1/users/requests')
          .then((res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.length(0);
          });
      });
      it('should return not found for the request id', () => {
        return chai.request(app)
          .get('/api/v1/users/requests/1')
          .then((res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.be.an('object');
            expect(res.body).to.eql({ Error: 'request not found' });
          });
      });
    });
  });
}
