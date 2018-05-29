import DummyDataModel from './DummyDataModel';
import client from './connection'
const requests = new DummyDataModel('requests', ['id'], ['category', 'description', 'userId']);
const contacts = new DummyDataModel('contacts', ['id'], ['message', 'userId', 'adminId', 'senderId']);
const users = new DummyDataModel('users', ['id', 'username', 'email']);

export default {
  requests,
  contacts,
  users,
};
