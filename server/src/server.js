import app from './app';

/* eslint-disable no-console */
const port = parseInt(process.env.PORT, 10) || 8080;
app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
