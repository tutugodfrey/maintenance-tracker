import DummyDataModel from './DummyDataModel';

const requests = new DummyDataModel('requests', ['id'], ['category', 'description', 'userId']);
const contacts = new DummyDataModel('contacts', ['id'], ['message', 'userId']);
const users = new DummyDataModel('users', ['id', 'username', 'email']);
users.bulkCreate([
  {
    username: 'janed',
    email: 'janed@somebody.com',
  },
  {
    username: 'alice',
    email: 'alice@somebody.com',
  },
]);

export default {
  requests,
  contacts,
  users,
};
