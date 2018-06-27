import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes/index';

const app = express();
app.use(express.static('public'));
app.use(express.static('client'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
routes(app);

export default app;
