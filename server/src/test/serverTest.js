import chai from 'chai';
import Server from './../app';
import client from './../models/connection';
const server = new Server();
const { expect } = chai;

export default describe('Server', () => {
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

