import { Client } from 'pg';
import dotenv from 'dotenv-safe';
import config from './config';
/* eslint-disable no-mutable-exports */
dotenv.config();
const env = process.env.NODE_ENV || 'development';
let connectionString;
if (config[env]) {
  const databaseURL = config[env].use_env_variable;
  if (process.env.NODE_ENC !== 'production') {
    /* eslint-disable no-console */
    console.log(databaseURL);
  }
  connectionString = process.env[databaseURL];
}
const client = new Client(connectionString);
client.connect();
export default client;
