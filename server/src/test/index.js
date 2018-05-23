import serverTest from './serverTest';
import modelTest from './dummyDataTest';
import signupTest from './signupTest';
import signinTest from './signinTest';
import userRequestTest from './userRequestTest';
import adminTest from './adminTest';

// enforce test to run only in test env
if (process.env.NODE_ENV !== 'test') {
  /* eslint-disable no-console */
  console.log(`can't run test in non test env. you are in ${process.env.NODE_ENV} environment`);
} else {
  /* eslint-disable no-unused-expressions */
  serverTest;
  modelTest;
  signupTest;
  signinTest;
  userRequestTest;
  adminTest;
}
