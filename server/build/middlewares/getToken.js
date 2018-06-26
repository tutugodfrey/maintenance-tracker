'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getToken = function getToken(req, res, next) {
  var token = req.headers.token;
  /* eslint-disable no-unused-vars */

  var promise = new Promise(function (resolve, reject) {
    if (token) {
      _jsonwebtoken2.default.verify(token, process.env.SECRET_KEY, function (err, decode) {
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
exports.default = getToken;
//# sourceMappingURL=getToken.js.map