import chai from 'chai';
import chaiHttp from 'chai-http';
import app from './../app';

const { expect } = chai;
chai.use(chaiHttp);

export default describe('get services controller', () => {
  it('should return info about service providers', () => {
    return chai.request(app)
    .get('/api/v1/auth/services')
    .then((res) => {
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body).to.have.length.of.at.least(1);
      expect(res.body[0]).to.have.property('id');
      expect(res.body[0]).to.have.property('serviceName');
      expect(res.body[0]).to.have.property('phone');
    })
  });
})