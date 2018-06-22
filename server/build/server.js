'use strict';

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-console */
var port = parseInt(process.env.PORT, 10) || 8080;
_app2.default.listen(port, function () {
  console.log('server started on port ' + port);
});
//# sourceMappingURL=server.js.map