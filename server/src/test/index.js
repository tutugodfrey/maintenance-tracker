import serverTest from './serverTest';
// import modelTest from './dummyDataTest';
import signupTest from './signupTest';
import signinTest from './signupTest';
import client from './../models/connection';
import userRequestTest from './userRequestTest';
import adminTest from './adminTest';
import contactTest from './contactTest';

// enforce test to run only in test env
if (process.env.NODE_ENV !== 'test') {
  /* eslint-disable no-console */
  console.log(`can't run test in non test env. you are in ${process.env.NODE_ENV} environment`);
} else {
  serverTest;
/*  modelTest; */
  signupTest;
  signinTest;
  userRequestTest;
  adminTest;
  contactTest;
}
