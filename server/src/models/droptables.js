import client from './connection';
/* eslint-disable no-console */
const queryArray = ['drop table if exists users', 'drop table if exists requests', 'drop table if exists contact'];
queryArray.forEach(queryString => {
  console.log('droping table');
  client.query(queryString)
    .then(() => console.log('table droped'))
    .catch(error => console.log(error));
});
