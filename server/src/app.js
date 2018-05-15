import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';

// setup server class
class Server {
  constructor() {
    this.express = express;
    this.bodyParser = bodyParser;
    this.logger = morgan;
  }
  expressServer() {
    this.app = this.express();
    this.app.use(this.express.static('public'));
    this.app.use(this.bodyParser.urlencoded({ extended: true }));
    this.app.use(this.bodyParser.json());
    return this.app;
  }
}

export default Server;
