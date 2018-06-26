'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _connection = require('./connection');

var _connection2 = _interopRequireDefault(_connection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint-disable no-underscore-dangle */
var DataModel = function () {
  function DataModel(modelName) {
    _classCallCheck(this, DataModel);

    this.modelName = modelName;
    this.singleModel = modelName.substring(0, modelName.length - 1);
    this._generateCreateQuery = this._generateCreateQuery;
    this._generateUpdateQuery = this._generateUpdateQuery;
    this._generateGetQuery = this._generateGetQuery;
    this._generateDeleteQuery = this._generateDeleteQuery;
  }

  _createClass(DataModel, [{
    key: '_generateCreateQuery',
    value: function _generateCreateQuery(condition) {
      if (!condition) {
        return { message: 'type error! expecting an object' };
      }
      var keys = Object.keys(condition);
      var queryString = 'insert into ' + this.modelName;
      var keyString = '(';
      keys.forEach(function (key) {
        if (keyString === '(') {
          keyString = keyString + ' "' + key + '"';
        } else {
          keyString = keyString + ', "' + key + '"';
        }
      });
      keyString = keyString + ') values';

      var valueString = '(';
      keys.forEach(function (key) {
        if (valueString === '(') {
          valueString = valueString + ' \'' + condition[key] + '\'';
        } else {
          valueString = valueString + ', \'' + condition[key] + '\'';
        }
      });
      valueString = valueString + ')';
      queryString = queryString + ' ' + keyString + ' ' + valueString + ' returning *';

      if (process.env.NODE_ENV !== 'production') {
        /* eslint-disable no-console */
        console.log(queryString);
      }
      return queryString;
    }
  }, {
    key: '_generateUpdateQuery',
    value: function _generateUpdateQuery(newProps, condition) {
      // console.log(newProps)
      if ((typeof newProps === 'undefined' ? 'undefined' : _typeof(newProps)) !== 'object' || (typeof condition === 'undefined' ? 'undefined' : _typeof(condition)) !== 'object') {
        return { message: 'type error! expecting an object' };
      }
      var queryString = void 0;
      // console.log('condition', condition)
      var whereKeys = Object.keys(condition);
      var newPropsKeys = Object.keys(newProps);
      queryString = 'update ' + this.modelName + ' set';
      var propString = '';
      newPropsKeys.forEach(function (prop) {
        if (propString === '') {
          propString = propString + '"' + prop + '" = \'' + newProps[prop] + '\'';
        } else {
          propString = propString + ', "' + prop + '" = \'' + newProps[prop] + '\'';
        }
      });

      var whereString = '';
      whereKeys.forEach(function (prop) {
        if (whereString === '') {
          whereString = whereString + '"' + prop + '" = \'' + condition[prop] + '\'';
        } else {
          whereString = whereString + ' and "' + prop + '" = \'' + condition[prop] + '\'';
        }
      });

      queryString = queryString + ' ' + propString + ' where ' + whereString + ' returning *';
      if (process.env.NODE_ENV !== 'production') {
        /* eslint-disable no-console */
        console.log(queryString);
      }
      return queryString;
    }
  }, {
    key: '_generateGetQuery',
    value: function _generateGetQuery(condition) {
      var typeOfCondition = typeof condition === 'undefined' ? 'undefined' : _typeof(condition);
      if (typeOfCondition !== 'string' && typeOfCondition !== 'object' && typeOfCondition !== 'number') {
        return { message: 'type error!' };
      }

      var queryString = void 0;
      if (condition === 'all') {
        queryString = 'select * from ' + this.modelName;
      } else if (typeof condition === 'number') {
        queryString = 'select * from ' + this.modelName + ' where "id" = ' + condition;
      } else {
        /* eslint-disable prefer-destructuring */
        var type = void 0;
        if (!condition.type) {
          type = 'and';
        } else {
          type = condition.type;
        }
        var keys = Object.keys(condition.where);
        queryString = 'select * from ' + this.modelName;
        keys.forEach(function (key) {
          if (queryString.indexOf('where') < 0) {
            queryString = queryString + ' where "' + key + '" = \'' + condition.where[key] + '\'';
          } else {
            queryString = queryString + ' ' + type + ' "' + key + '" = \'' + condition.where[key] + '\'';
          }
        });
      }
      if (process.env.NODE_ENV !== 'production') {
        /* eslint-disable no-console */
        console.log(queryString);
      }
      return queryString;

      // return 'select all from users where username = \'john\'';
    }
  }, {
    key: '_generateDeleteQuery',
    value: function _generateDeleteQuery(condition) {
      var typeOfCondition = typeof condition === 'undefined' ? 'undefined' : _typeof(condition);
      if (typeOfCondition !== 'object') {
        return { message: 'type error! expecting an object' };
      }
      var queryString = void 0;
      if (!condition) {
        queryString = 'select all from ' + this.modelName;
      } else {
        var keys = Object.keys(condition.where);
        queryString = 'delete from ' + this.modelName;
        keys.forEach(function (key) {
          if (queryString.indexOf('where') < 0) {
            queryString = queryString + ' where "' + key + '" = \'' + condition.where[key] + '\'';
          } else {
            queryString = queryString + ' and "' + key + '" = \'' + condition.where[key] + '\'';
          }
        });
      }
      queryString = queryString + ' returning *';
      if (process.env.NODE_ENV !== 'production') {
        /* eslint-disable no-console */
        console.log(queryString);
      }
      return queryString;
    }

    /* eslint-disable prefer-promise-reject-errors */

  }, {
    key: 'create',
    value: function create(modelToCreate) {
      var _this = this;

      // create a new model
      var result = new Promise(function (resolve, reject) {
        var queryString = _this._generateCreateQuery(modelToCreate);
        _connection2.default.query(queryString).then(function (res) {
          resolve(res.rows[0]);
        }).catch(function (error) {
          return reject(error);
        });
      });
      return result;
    }
  }, {
    key: 'update',
    value: function update(modelToUpdate, propsToUpdate) {
      var _this2 = this;

      /*
        propsToUpdate contain the new properties to replace the old ones
        this method should be called on the particular object to update.
        which means that before call update you must use the finder methods to
        get the particular object.
      */
      var result = new Promise(function (resolve, reject) {
        if ((typeof propsToUpdate === 'undefined' ? 'undefined' : _typeof(propsToUpdate)) === 'object' && (typeof modelToUpdate === 'undefined' ? 'undefined' : _typeof(modelToUpdate)) === 'object') {
          var queryString = _this2._generateUpdateQuery(propsToUpdate, modelToUpdate);
          _connection2.default.query(queryString).then(function (res) {
            resolve(res.rows[0]);
          }).catch(function (error) {
            return console.log(error);
          });
        } else {
          reject({ message: 'invalid argument passed to update! expects argument1 and argument2 to be objects' });
        }
      });
      return result;
    }
  }, {
    key: 'findById',
    value: function findById(id) {
      var _this3 = this;

      // return an object with the given id
      /* eslint-disable array-callback-return */
      var result = new Promise(function (resolve, reject) {
        var queryString = _this3._generateGetQuery(id);
        _connection2.default.query(queryString).then(function (res) {
          // console.log(res.rows[0])
          resolve(res.rows[0]);
        }).catch(function (error) {
          return reject(error);
        });
      });
      return result;
    }
  }, {
    key: 'find',
    value: function find() {
      var _this4 = this;

      var condition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'all';

      /* return a single object that meet the condition
        condition is single object with property where whose value is further
        an object with key => value pair of the properties of the object to find
      */
      var result = new Promise(function (resolve, reject) {
        if (!condition || !condition.where) {
          reject({ message: 'missing object propertiy \'where\' to find model' });
        } else {
          var queryString = _this4._generateGetQuery(condition);
          _connection2.default.query(queryString).then(function (res) {
            resolve(res.rows[0]);
          }).catch(function (error) {
            return reject(error);
          });
        }
      });

      return result;
    }
  }, {
    key: 'findAll',
    value: function findAll() {
      var _this5 = this;

      var condition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'all';

      var result = new Promise(function (resolve, reject) {
        var queryString = _this5._generateGetQuery(condition);
        _connection2.default.query(queryString).then(function (res) {
          resolve(res.rows);
        }).catch(function (error) {
          return reject(error);
        });
      });
      return result;
    }
  }, {
    key: 'findServiceName',
    value: function findServiceName() {
      var _this6 = this;

      var result = new Promise(function (resolve, reject) {
        var queryString = 'select "id", "serviceName", "phone" from ' + _this6.modelName + ' where "isAdmin" = true';
        _connection2.default.query(queryString).then(function (res) {
          resolve(res.rows);
        }).catch(function (error) {
          return reject(error);
        });
      });
      return result;
    }
  }, {
    key: 'getClient',
    value: function getClient(userId) {
      var _this7 = this;

      var result = new Promise(function (resolve, reject) {
        var queryString = 'select "id", "fullname", "serviceName", "email", "phone" from ' + _this7.modelName + ' where "id" = ' + userId;
        _connection2.default.query(queryString).then(function (res) {
          resolve(res.rows[0]);
        }).catch(function (error) {
          return reject(error);
        });
      });
      return result;
    }
  }, {
    key: 'destroy',
    value: function destroy(condition) {
      var _this8 = this;

      /*
        delete the object that meet the condition
        condition is single object with property where whose value is further
        an object with key => value pair of the properties of the object to find.
        if several object match the specified condition, only the first match will
        be deleted
      */
      var result = new Promise(function (resolve, reject) {
        var queryString = _this8._generateDeleteQuery(condition);
        _connection2.default.query(queryString).then(function (res) {
          var response = res.rows;
          resolve(response);
        }).catch(function (err) {
          return reject(err);
        });
      });

      return result;
    }
  }]);

  return DataModel;
}();

exports.default = DataModel;
//# sourceMappingURL=DataModel.js.map