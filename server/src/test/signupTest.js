import chai from 'chai';
import chaiHttp from 'chai-http';
import Server from './../app';

const server = new Server();
const app = server.expressServer();
const { expect } = chai;
chai.use(chaiHttp);
const adminUser = {};
const regularUser1 = {};
const regularUser2 = {};

export default describe('Users signup', () => {
  describe('Admin User', () => {
    it('should create new admin user', () => {
      return chai.request(app)
        .post('/api/v1/auth/signup')
        .set('Content-Type', 'multipart/form-data')
        .field('fullname', 'john doe')
        .field('username', 'johnd')
        .field('email', 'johnd@yahoo.com')
        .field('address', 'market road')
        .field('serviceName', 'mk services')
        .field('password', '123456')
        .field('confirmPassword', '123456')
        .field('isAdmin', 'true')
        .attach('profile-photo', './fileuploads/tutug.jpeg')
        .then((res) => {
          Object.assign(adminUser, res.body);
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('Object');
          expect(res.body.isAdmin).to.equal(true);
        });
    });
  });

  describe('Create regular User', () => {
    it('should create new regular user', () => {
      return chai.request(app)
        .post('/api/v1/auth/signup')
        .set('Content-Type', 'multipart/form-data')
        .field('fullname', 'brain walter')
        .field('username', 'walterb')
        .field('email', 'walterb@yahoo.com')
        .field('address', 'market road')
        .field('serviceName', '')
        .field('password', '123456')
        .field('confirmPassword', '123456')
        .field('isAdmin', 'false')
        .attach('profile-photo', './fileuploads/tutug.jpeg')
        .then((res) => {
          Object.assign(regularUser1, res.body);
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('Object');
        });
    });

    it('file submission should be optional', () => {
      return chai.request(app)
        .post('/api/v1/auth/signup')
        .set('Content-Type', 'multipart/form-data')
        .field('fullname', 'ryan bob')
        .field('username', 'ryanb')
        .field('email', 'raynb@yahoo.com')
        .field('address', 'market road')
        .field('serviceName', '')
        .field('password', '123456')
        .field('confirmPassword', '123456')
        .field('isAdmin', 'false')
        .attach('profile-photo', '')
        .then((res) => {
          Object.assign(regularUser2, res.body);
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('Object');
          expect(res.body.password).to.not.equal('1234');
        });
    });

    it('username should be unique ', () => {
      return chai.request(app)
        .post('/api/v1/auth/signup')
        .set('Content-Type', 'multipart/form-data')
        .field('fullname', 'walter brain')
        .field('username', 'walterb')
        .field('email', 'walterb@yahoo.com')
        .field('address', 'market road')
        .field('serviceName', 'mk services')
        .field('password', '123456')
        .field('confirmPassword', '123456')
        .field('isAdmin', 'false')
        .attach('profile-photo', './fileuploads/tutug.jpeg')
        .then((res) => {
          expect(res).to.have.status(409);
          expect(res.body).to.be.an('Object');
          expect(res.body).to.eql({ message: 'user already exist' });
        });
    });

    it('email should be unique ', () => {
      return chai.request(app)
        .post('/api/v1/auth/signup')
        .set('Content-Type', 'multipart/form-data')
        .field('fullname', 'brain walter')
        .field('username', 'walterbr')
        .field('email', 'walterb@yahoo.com')
        .field('address', 'market road')
        .field('serviceName', 'mk services')
        .field('password', '123456')
        .field('confirmPassword', '123456')
        .field('isAdmin', 'false')
        .attach('profile-photo', './fileuploads/tutug.jpeg')
        .then((res) => {
          expect(res).to.have.status(409);
          expect(res.body).to.be.an('Object');
          expect(res.body).to.eql({ message: 'user already exist' });
        });
    });

    it('password, confirm-password should match', () => {
      return chai.request(app)
        .post('/api/v1/auth/signup')
        .set('Content-Type', 'multipart/form-data')
        .field('fullname', 'brain walter')
        .field('username', 'walterbr')
        .field('email', 'walterbr@yahoo.com')
        .field('address', 'market road')
        .field('serviceName', 'mk services')
        .field('password', '1234567')
        .field('confirmPassword', '123456')
        .field('isAdmin', 'false')
        .attach('profile-photo', './fileuploads/tutug.jpeg')
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('Object');
          expect(res.body).to.eql({ message: 'password does not match' });
        });
    });
    it('password, confirm-password should match', () => {
      return chai.request(app)
        .post('/api/v1/auth/signup')
        .set('Content-Type', 'multipart/form-data')
        .field('fullname', 'brain walter')
        .field('username', 'walterbr')
        .field('email', 'walterbr@yahoo.com')
        .field('address', 'market road')
        .field('serviceName', 'mk services')
        .field('password', '12345')
        .field('confirmPassword', '123456')
        .field('isAdmin', 'false')
        .attach('profile-photo', './fileuploads/tutug.jpeg')
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('Object');
          expect(res.body).to.eql({ message: 'length of password must not be less than 6' });
        });
    });
  });
});

export {
  adminUser,
  regularUser1,
  regularUser2,
};
