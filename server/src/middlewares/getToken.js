import jwt from 'jsonwebtoken';

const getToken = (req, res, next) => {
  const { token } = req.headers;
  /* eslint-disable no-unused-vars */
  const promise = new Promise((resolve, reject) => {
    if (token) {
      jwt.verify(token, process.env.SECRET_KEY, (err, decode) => {
        if (err) {
          resolve(res.status(401).send({ message: 'authentication fail! invalid token' }));
        } else {
          req.body.decode = decode;
          resolve(next());
        }
      });
    } else {
      resolve(res.status(401).send({ message: 'authentication fail! please send a token' }));
    }
  });
  return promise;
};
export default getToken;
