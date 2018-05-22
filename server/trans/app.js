'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _index = require('./routes/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var route = new _index2.default();
// setup server class

var Server = function () {
  function Server() {
    _classCallCheck(this, Server);

    this.express = _express2.default;
    this.bodyParser = _bodyParser2.default;
    this.logger = _morgan2.default;
    this.route = route;
  }

  _createClass(Server, [{
    key: 'expressServer',
    value: function expressServer() {
      this.app = this.express();
      this.app.use(this.express.static('public'));
      this.app.use(this.bodyParser.urlencoded({ extended: true }));
      this.app.use(this.bodyParser.json());
      this.route.routes(this.app);
      return this.app;
    }
  }]);

  return Server;
}();

exports.default = Server;
//# sourceMappingURL=app.js.map