import chai from 'chai';
import chaiHttp from 'chai-http';
import app from './../app';

const { expect } = chai;
chai.use(chaiHttp);
const adminUser = {};
const regularUser1 = {};
const regularUser2 = {};
const regularUser3 = {};

export default describe('Users controller', () => {
  describe('signup method', () => {
    it('should create new admin user', () => {
      return chai.request(app)
        .post('/api/v1/auth/signup')
        .set('Content-Type', 'multipart/form-data')
        .field('fullname', 'john doe')
        .field('username', 'johnd')
        .field('email', 'johnd@yahoo.com')
        .field('address', 'market road')
        .field('phone', '07011111111')
        .field('serviceName', 'mk services')
        .field('password', '123456')
        .field('confirmPassword', '123456')
        .field('isAdmin', 'true')
        .attach('profile-photo', './fileuploads/tutug.jpeg') 
        .then((res) => {
          Object.assign(adminUser, res.body);
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('Object');
          expect(res.body).to.have.property('token');
          expect(res.body.token).to.be.a('string');
          expect(res.body.username).to.equal('johnd');
          expect(res.body.email).to.equal('johnd@yahoo.com');
          expect(res.body.isAdmin).to.equal(true);
        });
    });

    it('should create new regular user', () => {
      return chai.request(app)
        .post('/api/v1/auth/signup')
        .set('Content-Type', 'multipart/form-data')
        .field('fullname', 'brain walter')
        .field('username', 'walterb')
        .field('email', 'walterb@yahoo.com')
        .field('address', 'market road')
        .field('phone', '07011111111')
        .field('serviceName', '')
        .field('password', '123456')
        .field('confirmPassword', '123456')
        .field('isAdmin', '')
        .attach('profile-photo', './fileuploads/tutug.jpeg')
        .then((res) => {
          Object.assign(regularUser1, res.body);
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('Object');
          expect(res.body).to.have.property('token');
          expect(res.body.token).to.be.a('string');
          expect(res.body.username).to.equal('walterb');
          expect(res.body.isAdmin).to.equal(false);
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
        .field('phone', '07011111111')
        .field('serviceName', '')
        .field('password', '123456')
        .field('confirmPassword', '123456')
        .field('isAdmin', '')
        .attach('profile-photo', '')
        .then((res) => {
          Object.assign(regularUser2, res.body);
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('Object');
          expect(res.body.password).to.not.equal('123456');
          expect(res.body.imgUrl).to.equal('/users-photo/default.png');
        });
    });

    it('serviceName should be undefined if isAdmin is false', () => {
      return chai.request(app)
        .post('/api/v1/auth/signup')
        .set('Content-Type', 'multipart/form-data')
        .field('fullname', 'brain walter')
        .field('username', 'walterbr')
        .field('email', 'walterbr@yahoo.com')
        .field('address', 'market road')
        .field('phone', '07011111111')
        .field('serviceName', 'somesericename')
        .field('password', '123456')
        .field('confirmPassword', '123456')
        .field('isAdmin', '')
        .attach('profile-photo', './fileuploads/tutug.jpeg')
        .then((res) => {
          Object.assign(regularUser3, res.body);
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('Object');
          expect(res.body).to.have.property('token')
          expect(res.body.isAdmin).to.equal(false);
          expect(res.body.serviceName).to.equal('');
        });
    });

    it('should not create a user if username already exist', () => {
      return chai.request(app)
        .post('/api/v1/auth/signup')
        .set('Content-Type', 'multipart/form-data')
        .field('fullname', 'walter brain')
        .field('username', 'walterb')
        .field('email', 'walterb@yahoo.com')
        .field('address', 'market road')
        .field('phone', '07011111111')
        .field('serviceName', 'mk services')
        .field('password', '123456')
        .field('confirmPassword', '123456')
        .field('isAdmin', 'false')
        .attach('profile-photo', './fileuploads/tutug.jpeg')
        .then((res) => {
          expect(res).to.have.status(409);
          expect(res.body).to.be.an('Object');
          expect(res.body).to.have.property('message')
          expect(res.body.message).to.equal('user already exist');
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
        .field('phone', '07011111111')
        .field('serviceName', 'mk services')
        .field('password', '123456')
        .field('confirmPassword', '123456')
        .field('isAdmin', 'false')
        .attach('profile-photo', './fileuploads/tutug.jpeg')
        .then((res) => {
          expect(res).to.have.status(409);
          expect(res.body).to.be.an('Object');
          expect(res.body).to.have.property('message')
          expect(res.body.message).to.equal('user already exist');
        });
    });

    it('should not create a user without username', () => {
      return chai.request(app)
        .post('/api/v1/auth/signup')
        .set('Content-Type', 'multipart/form-data')
        .field('fullname', 'brain walter')
        .field('username', '')
        .field('email', 'walterb@yahoo.com')
        .field('address', 'user address')
        .field('phone', '07011111111')
        .field('serviceName', 'mk services')
        .field('password', '123456')
        .field('confirmPassword', '123456')
        .field('isAdmin', 'false')
        .attach('profile-photo', './fileuploads/tutug.jpeg')
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('Object');
          expect(res.body).to.have.property('message')
          expect(res.body.message).to.equal('missing required field');
        });
    });

    it('should not create an admin user if service name is not provided', () => {
      return chai.request(app)
        .post('/api/v1/auth/signup')
        .set('Content-Type', 'multipart/form-data')
        .field('fullname', 'brain walter')
        .field('username', '')
        .field('email', 'walterb@yahoo.com')
        .field('address', 'user address')
        .field('phone', '07011111111')
        .field('serviceName', '')
        .field('password', '123456')
        .field('confirmPassword', '123456')
        .field('isAdmin', 'true')
        .attach('profile-photo', './fileuploads/tutug.jpeg')
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('Object');
          expect(res.body).to.have.property('message')
          expect(res.body.message).to.equal('missing required field');
        });
    });

    it('should not create a user without email', () => {
      return chai.request(app)
        .post('/api/v1/auth/signup')
        .set('Content-Type', 'multipart/form-data')
        .field('fullname', 'brain walter')
        .field('username', 'walterbr')
        .field('email', '')
        .field('address', 'user address')
        .field('phone', '07011111111')
        .field('serviceName', 'mk services')
        .field('password', '123456')
        .field('confirmPassword', '123456')
        .field('isAdmin', 'false')
        .attach('profile-photo', './fileuploads/tutug.jpeg')
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('Object');
          expect(res.body).to.have.property('message')
          expect(res.body.message).to.equal('missing required field');
        });
    });

    it('should not create a user if email format is wrong', () => {
      return chai.request(app)
        .post('/api/v1/auth/signup')
        .set('Content-Type', 'multipart/form-data')
        .field('fullname', 'brain walter')
        .field('username', 'walterbr')
        .field('email', 'walterb@youcom')
        .field('address', 'user address')
        .field('phone', '07011111111')
        .field('serviceName', 'mk services')
        .field('password', '123456')
        .field('confirmPassword', '123456')
        .field('isAdmin', 'false')
        .attach('profile-photo', './fileuploads/tutug.jpeg')
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('Object');
          expect(res.body).to.have.property('message')
          expect(res.body.message).to.equal('typeError: invalid email format');
        });
    });

    it('should not create a user without phone number', () => {
      return chai.request(app)
        .post('/api/v1/auth/signup')
        .set('Content-Type', 'multipart/form-data')
        .field('fullname', 'brain walter')
        .field('username', 'walterbr')
        .field('email', 'walterb@yahoo.com')
        .field('address', 'market road')
        .field('phone', '')
        .field('serviceName', 'mk services')
        .field('password', '123456')
        .field('confirmPassword', '123456')
        .field('isAdmin', 'false')
        .attach('profile-photo', './fileuploads/tutug.jpeg')
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('Object');
          expect(res.body).to.have.property('message')
          expect(res.body.message).to.equal('missing required field');
        });
    });

    it('should not create a user without address', () => {
      return chai.request(app)
        .post('/api/v1/auth/signup')
        .set('Content-Type', 'multipart/form-data')
        .field('fullname', 'brain walter')
        .field('username', 'walterbr')
        .field('email', 'walterb@yahoo.com')
        .field('address', '')
        .field('phone', '07011111111')
        .field('serviceName', 'mk services')
        .field('password', '123456')
        .field('confirmPassword', '123456')
        .field('isAdmin', 'false')
        .attach('profile-photo', './fileuploads/tutug.jpeg')
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('Object');
          expect(res.body).to.have.property('message')
          expect(res.body.message).to.equal('missing required field');
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
        .field('phone', '07011111111')
        .field('serviceName', '')
        .field('password', '1234567')
        .field('confirmPassword', '123456')
        .field('isAdmin', '')
        .attach('profile-photo', './fileuploads/tutug.jpeg')
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('Object');
          expect(res.body).to.eql({ message: 'password does not match' });
        });
    });
    it('length of password or comfirmPassword should be >= 6', () => {
      return chai.request(app)
        .post('/api/v1/auth/signup')
        .set('Content-Type', 'multipart/form-data')
        .field('fullname', 'brain walter')
        .field('username', 'walterbr')
        .field('email', 'walterbr@yahoo.com')
        .field('address', 'market road')
        .field('phone', '07011111111')
        .field('serviceName', '')
        .field('password', '12345')
        .field('confirmPassword', '123456')
        .field('isAdmin', '')
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
