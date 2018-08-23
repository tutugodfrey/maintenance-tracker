import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes/index';
import cors from 'cors';

const app = express();
app.use(express.static('public'));
app.use(express.static('client'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())
routes(app);

export default app;
