import http from 'http';
import Server from './../app';

/* eslint-disable no-console */
let app = new Server();
app = app.expressServer();
const port = parseInt(process.env.PORT, 10) || 8080;
const server = http.createServer(app);
server.listen(port);
console.log(`server started on port ${port}`);
