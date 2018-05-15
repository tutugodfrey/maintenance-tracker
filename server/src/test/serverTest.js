
import chai from 'chai';
import chaiHttp from 'chai-http';
import Server from './../app';

const server = new Server();
const { expect } = chai;
chai.use(chaiHttp);

// enforce test to run only in test env
if (process.env.NODE_ENV !== 'test') {
  /* eslint-disable no-console */
  console.log(`can't run test in non test env. you are in ${process.env.NODE_ENV} environment`);
} else {
  describe('Server', () => {
    describe('unit test', () => {
      it('should export a function', () => {
        expect(Server).to.be.a('function');
      });

      it('should to be an object', () => {
        expect(server).to.be.a('Object');
      });

      it('server should be an instanceOf Server', () => {
        expect(server).to.be.an.instanceOf(Server);
      });
    });
  });
}
