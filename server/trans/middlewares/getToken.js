'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var secureRoute = function secureRoute(req, res, next) {
  var token = req.headers.token;
  /* eslint-disable no-unused-vars */

  var promise = new Promise(function (resolve, reject) {
    if (token) {
      _jsonwebtoken2.default.verify(token, process.env.SECRET_KEY, function (err, decode) {
        if (err) {
          resolve(res.status(401).send('Invalid Token'));
        } else {
          resolve(next());
        }
      });
    } else {
      resolve(res.status(402).send('Please send a token'));
    }
  });
  return promise;
};
exports.default = secureRoute;
//# sourceMappingURL=getToken.js.map