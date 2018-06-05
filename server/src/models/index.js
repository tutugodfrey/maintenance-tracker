import DummyDataModel from './DummyDataModel';

const requests = new DummyDataModel('requests', ['id'], ['category', 'description', 'userId']);
const contacts = new DummyDataModel('contacts', ['id'], ['message', 'userId', 'adminId', 'senderId']);
const users = new DummyDataModel('users', ['id', 'username', 'email']);

export default {
  requests,
  contacts,
  users,
};
