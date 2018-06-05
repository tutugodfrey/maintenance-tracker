import chai from 'chai';
import chaiHttp from 'chai-http';
import Server from './../app';
import { adminUser, regularUser1, regularUser2 } from './signupTest';

const server = new Server();
const app = server.expressServer();
const { expect } = chai;
chai.use(chaiHttp);
const signedInUser = {};
const message4 = {
  title: 'Apologise',
  message: 'Please we will attend to it right away',
  userId: 0,
  senderId: 7,
};

const message5 = {
  title: 'unresolved request',
  message: ' ',
  receiverId: adminUser.id,
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

    describe('user sending messages', () => {
      it('users should be able to send message to the admin', () => {
        const userMessage = {
          title: 'unresolved request',
          message: 'request to replace wall socket was not attended to',
          receiverId: adminUser.id,
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
      // failing here
      it('should return bad request if required fields are not presents', () => {
        const message3 = {
          title: 'Apologise',
          message: '',
          senderId: regularUser1.id,
          receiverId: adminUser.id,
        };
        return chai.request(app)
          .post('/api/v1/contacts')
          .set('token', signedInUser.token)
          .send(message3)
          .then((res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.be.an('object');
          });
      });

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
          .get('/api/v1/contacts')
          // regularuser2 does not have any messages
          .set('token', regularUser2.token)
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
          receiverId: regularUser1.id,
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
    // failing here
    it('should return bad request if required fields are not presents', () => {
      const message3 = {
        title: 'Apologise',
        message: '',
        receiverId: regularUser1.id,
        senderId: adminUser.id,
      };
      return chai.request(app)
        .post('/api/v1/contacts')
        .set('token', signedInUser.token)
        .send(message3)
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
        });
    });

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
    it('should return all messages if isAdmin === true', () => {
      return chai.request(app)
        .get('/api/v1/contacts?isAdmin=true')
        .set('token', signedInUser.token)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.equal(2);
        });
    });
  });
});

