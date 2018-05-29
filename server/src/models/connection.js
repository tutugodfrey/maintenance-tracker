import { Client } from 'pg';
import dotenv from 'dotenv-safe';
import config from './config';
/* eslint-disable import/no-mutable-export */
dotenv.config();
const env = process.env.NODE_ENV || 'test';
let client;
if (config[env]) {
  const databaseURL = config[env].use_env_variable;
  console.log(databaseURL);
  const connectionString = process.env[databaseURL];
  client = new Client(connectionString);
  client.connect();
}


export default client;
