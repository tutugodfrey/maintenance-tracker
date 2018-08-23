import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './routes/index';


const app = express();
app.use(express.static('public'));
app.use(express.static('client'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
routes(app);

export default app;
