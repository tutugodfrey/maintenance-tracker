import client from './connection';
/* eslint-disable no-console */
const queryString = 'drop table if exists users; drop table if exists requests; drop table if exists contacts';

// let queryCompleted = false;
console.log('droping table');
client.query(queryString)
  .then(() => {
    console.log('table droped');
    client.end();
  })
  .catch((error) => {
    console.log(error);
    client.end();
  });
