import chai from 'chai';
import chaiHttp from 'chai-http';
import app from './../app';
import { adminUser, regularUser1, regularUser2 } from './signupTest';

const { expect } = chai;
chai.use(chaiHttp);
const signedInUser = {};

const userMessage = {
  title: 'unresolved request',
  message: '',
  receiverId: adminUser.id,
};

const adminMessage = {
  title: 'Apologise',
  message: 'Please we will attend to it right away',
  receiverId: regularUser1.id,
};

const createdMessage1 = {};
const createdMessage2 = {};

// tests for the contact model
export default describe('contacts controller', () => {
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

    it('should return bad request if message is null', () => {
      return chai.request(app)
        .post('/api/v1/contacts')
        .set('token', signedInUser.token)
        .send(userMessage)
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('missing required field');
        });
    });

    it('should not create a message if receiverId is not provided', () => {
      userMessage.receiverId = '';
      userMessage.message = 'request to replace wall socket was not attended to';
      return chai.request(app)
        .post('/api/v1/contacts')
        .set('token', signedInUser.token)
        .send(userMessage)
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('missing required field');
        });
    });

    it('should not create a message if receiver does not exist', () => {
      userMessage.receiverId = 20;
      return chai.request(app)
        .post('/api/v1/contacts')
        .set('token', signedInUser.token)
        .send(userMessage)
        .then((res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('receiver does not exist');
        });
    });

    it('users should be able to send message to the admin', () => {
      userMessage.receiverId = adminUser.id;
      return chai.request(app)
        .post('/api/v1/contacts')
        .set('token', signedInUser.token)
        .send(userMessage)
        .then((res) => {
          Object.assign(createdMessage1, res.body);
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body).to.have.property('senderId');
          expect(res.body).to.have.property('receiverId');
          expect(res.body).to.have.property('title');
          expect(res.body.senderId).to.equal(signedInUser.id);
        });
    });
  });

  describe('admin reply users messages', () => {
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

    it('should return authentication error if token is invalid', () => {
      return chai.request(app)
        .post('/api/v1/contacts')
        .set('token', 'signedInUser.tokeninvalidtoken')
        .send(adminMessage)
        .then((res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('authentication fail! invalid token');
        });
    });

    it('admin should be able to reply a message', () => {
      adminMessage.receiverId = regularUser1.id;
      return chai.request(app)
        .post('/api/v1/contacts')
        .set('token', signedInUser.token)
        .send(adminMessage)
        .then((res) => {
          Object.assign(createdMessage2, res.body);
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body).to.have.property('senderId');
          expect(res.body).to.have.property('receiverId');
          expect(res.body).to.have.property('title');
          expect(res.body.senderId).to.equal(adminUser.id);
        });
    });
  });

  describe('get messages', () => {
    it('should return all messages for the given userId', () => {
      return chai.request(app)
        .get('/api/v1/contacts')
        .set('token', signedInUser.token)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.be.at.least(1);
          expect(res.body[0]).to.have.property('message');
          expect(res.body[0]).to.have.property('sender');
          expect(res.body[0]).to.have.property('receiver');
        });
    });

    it('should return an empty array if no message exist for the logged in user', () => {
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

