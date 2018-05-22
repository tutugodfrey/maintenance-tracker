'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
* export a class for working with objects
*/
var HelperFuncts = function () {
  function HelperFuncts() {
    _classCallCheck(this, HelperFuncts);
  }

  _createClass(HelperFuncts, null, [{
    key: 'getImgUrl',
    value: function getImgUrl(path) {
      if (typeof path !== 'string') {
        return 'expected a string as argument';
      }
      var newPath = path.replace(/\\/g, '/');
      if (newPath.indexOf('/') < 0) {
        return 'Cant resolve path ' + newPath;
      }
      var indexOfPublic = newPath.indexOf('/');
      var relPath = newPath.substr(indexOfPublic, newPath.length);
      return relPath;
    }
  }]);

  return HelperFuncts;
}();
exports.default = HelperFuncts;
//# sourceMappingURL=HelperFuncts.js.map