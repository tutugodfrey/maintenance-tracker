import pg from 'pg';
import dotenv from 'dotenv-safe';
import config from './config';

dotenv.config();
const env = process.env.NODE_ENV || 'development';
let client;
if (config[env]) {
  const databaseURL = config[env].use_env_variable;
  const connectionString = process.env[databaseURL]; 
  client = new pg.Client(connectionString);
  client.connect();
}

export default client;
