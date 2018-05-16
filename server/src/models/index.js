import DummyDataModel from './DummyDataModel';

const requests = new DummyDataModel('requests', ['id'], ['problemType', 'description', 'userId']);

export default {
  requests,
};
