import chai from 'chai';
import chaiHttp from 'chai-http';
import Server from './../app';
import { adminUser, regularUser1 } from './signupTest';

const server = new Server();
const app = server.expressServer();
const { expect } = chai;
chai.use(chaiHttp);
const signedInUser = {};
const message4 = {
  title: 'Apologise',
  message: 'Please we will attend to it right away',
  userId: 0,
  adminId: 0,
  senderId: 7,
};

const message5 = {
  title: 'unresolved request',
  message: ' ',
  userId: regularUser1.id,
  adminId: adminUser.id,
  senderId: regularUser1.id,
};

const createdMessage1 = {};
const createdMessage2 = {};

// tests for the contact model
export default describe('contacts', () => {
  describe('user send message', () => {
    it('should signin a User in and give a token', () => {
      return chai.request(app)
        .post('/api/v1/auth/signin')
        .send({
          username: regularUser1.username,
          password: '123456',
        })
        .then((res) => {
          Object.assign(signedInUser, res.body);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('Object');
          expect(res.body).to.have.property('token');
          expect(res.body.token).to.be.a('string');
        });
    });

    describe('user send messages', () => {
      it('users should be able to send message to the admin', () => {
        const userMessage = {
          title: 'unresolved request',
          message: 'request to replace wall socket was not attended to',
          userId: signedInUser.id,
          adminId: adminUser.id,
          senderId: signedInUser.id,
        };
        return chai.request(app)
          .post('/api/v1/contacts')
          .set('token', signedInUser.token)
          .send(userMessage)
          .then((res) => {
            Object.assign(createdMessage1, res.body);
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
          });
      });
      /*
      it('should return bad request if required fields are not presents', () => {
        const message3 = {
          title: 'Apologise',
          message: 'Please we will attend to it right away',
          userId: regularUser1.id,
          adminId: adminUser.id,
          senderId: 7,
        };
        return chai.request(app)
          .post('/api/v1/contacts')
          .set('token', signedInUser.token)
          .send(message3)
          .then((res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.be.an('object');
          });
      }); */

      it('should not create a message for a sender that does not exist', () => {
        return chai.request(app)
          .post('/api/v1/contacts')
          .set('token', signedInUser.token)
          .send(message4)
          .then((res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.be.an('object');
          });
      });

      it('should not create a message if no message is posted', () => {
        return chai.request(app)
          .post('/api/v1/contacts')
          .set('token', signedInUser.token)
          .send(message5)
          .then((res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.be.an('object');
          });
      });
    });

    describe('get messages', () => {
      it('should return all messages for the given userId', () => {
        return chai.request(app)
          .get(`/api/v1/contacts?userId=${regularUser1.id}`)
          .set('token', signedInUser.token)
          .then((res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body.length).to.be.at.least(1);
          });
      });

      it('should return an empty array if no message exist for the given userId', () => {
        return chai.request(app)
          .get('/api/v1/contacts?userId=9')
          .set('token', signedInUser.token)
          .then((res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body.length).to.equal(0);
          });
      });
    });
  });

  describe('admin messages', () => {
    it('should signin a User in and give a token', () => {
      return chai.request(app)
        .post('/api/v1/auth/signin')
        .send({
          username: adminUser.username,
          password: '123456',
        })
        .then((res) => {
          Object.assign(signedInUser, res.body);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('Object');
          expect(res.body).to.have.property('token');
          expect(res.body.token).to.be.a('string');
        });
    });

    describe('admin reply messages', () => {
      it('admin should be able to reply a message', () => {
        const adminMessage = {
          title: 'Apologise',
          message: 'Please we will attend to it right away',
          userId: regularUser1.id,
          adminId: adminUser.id,
          senderId: adminUser.id,
        };
        return chai.request(app)
          .post('/api/v1/contacts')
          .set('token', signedInUser.token)
          .send(adminMessage)
          .then((res) => {
            Object.assign(createdMessage2, res.body);
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
          });
      });
    });
    /*
    it('should return bad request if required fields are not presents', () => {
      const message3 = {
        title: 'Apologise',
        message: 'Please we will attend to it right away',
        userId: regularUser1.id,
        adminId: adminUser.id,
        senderId: 7,
      };
      return chai.request(app)
        .post('/api/v1/contacts')
        .set('token', signedInUser.token)
        .send(message3)
        .then((res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
        });
    }); */

    it('should not create a message for a sender that does not exist', () => {
      return chai.request(app)
        .post('/api/v1/contacts')
        .set('token', signedInUser.token)
        .send(message4)
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
        });
    });

    it('should not create a message if no message is posted', () => {
      return chai.request(app)
        .post('/api/v1/contacts')
        .set('token', signedInUser.token)
        .send(message5)
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
        });
    });
  });

  describe('admin get message', () => {
   
   /* it('should return all messages if isAdmin === true', () => {
      return chai.request(app)
        .get('/api/v1/contacts?isAdmin=true')
        .set('token', signedInUser.token)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.equal(2);
        });
    }); */

    it('should return bad request if neither isAdim or userId is not set', () => {
      return chai.request(app)
        .get('/api/v1/contacts?userId=&isAdmin=')
        .set('token', signedInUser.token)
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.eql({ message: 'missing required field' });
        });
    });
  });
});

