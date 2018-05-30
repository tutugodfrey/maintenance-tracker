import client from './connection';

/* eslint-disable no-underscore-dangle */
const DummyDataModel = class {
  constructor(modelName) {
    /*
    if (!Array.isArray(uniqueKeys) || !Array.isArray(requiredFields)) {
      return { typeError: 'argument2 and argument3 must be of type array' };
    } */
    this.modelName = modelName;
    this.singleModel = modelName.substring(0, modelName.length - 1);
    this._generateCreateQuery = this._generateCreateQuery;
    this._generateUpdateQuery = this._generateUpdateQuery;
    this._generateGetQuery = this._generateGetQuery;
    this._generateDeleteQuery = this._generateDeleteQuery;
  }

  _generateCreateQuery(condition) {
    if (!condition) {
      return { message: 'type error! expecting an object' };
    } 
    const keys = Object.keys(condition);
    let queryString = `insert into ${this.modelName}`;
    let keyString = '(';
    keys.forEach((key) => {
      if (keyString === '(') {
        keyString = `${keyString} ${key}`;
      } else {
        keyString = `${keyString}, ${key}`;
      }
    });
    keyString = `${keyString}) values`;

    let valueString = '(';
    keys.forEach((key) => {
      if (valueString === '(') {
        valueString = `${valueString} '${condition[key]}'`;
      } else {
        valueString = `${valueString}, '${condition[key]}'`;
      }
    });
    valueString = `${valueString})`;
    queryString = `${queryString} ${keyString} ${valueString} returning *`; 

    if (process.env.NODE_ENV !== 'production') {
      /* eslint-disable no-console */
      console.log(queryString);
    }
    return queryString;
  }

  _generateUpdateQuery(newProps, condition) {
    // console.log(newProps)
    if (typeof newProps !== 'object' || typeof condition !== 'object') {
      return { message: 'type error! expecting an object' };
    }
    let queryString;
    // console.log('condition', condition)
    const whereKeys = Object.keys(condition);
    const newPropsKeys = Object.keys(newProps);
    queryString = `update ${this.modelName} set`;
    let propString = '';
    newPropsKeys.forEach((prop) => {
      if (propString === '') {
        propString = `${propString}${prop} = '${newProps[prop]}'`;
      } else {
        propString = `${propString}, ${prop} = '${newProps[prop]}'`;
      }
    });
    console.log(condition)
    let whereString = '';
    whereKeys.forEach((prop) => {
      if (whereString === '') {
        whereString = `${whereString}${prop} = '${condition[prop]}'`;
      } else {
        whereString = `${whereString} and ${prop} = '${condition[prop]}'`;
      }
    });

    queryString = `${queryString} ${propString} where ${whereString}`;
    if (process.env.NODE_ENV !== 'production') {
      /* eslint-disable no-console */
      console.log(queryString);
    }
    return queryString;
  }

  _generateGetQuery(condition) {
    const typeOfCondition = (typeof condition);
    if (typeOfCondition !== 'string' && typeOfCondition !== 'object' && typeOfCondition !== 'number') {
      return { message: 'type error!' };
    }

    let queryString;
    if (condition === 'all') {
      queryString = `select * from ${this.modelName}`;
    } else if (typeof condition === 'number') {
      queryString = `select * from ${this.modelName} where id = ${condition}`;
    } else {
      let type;
      if(!condition.type) {
        type = 'and';
      } else {
        type = condition.type;
      }
      const keys = Object.keys(condition.where);
      queryString = `select * from ${this.modelName}`;
      keys.forEach((key) => {
        if (queryString.indexOf('where') < 0) {
          queryString = `${queryString} where ${key} = '${condition.where[key]}'`;
        } else {
          queryString = `${queryString} ${type} ${key} = '${condition.where[key]}'`;
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

  _generateDeleteQuery(condition) {
    const typeOfCondition = (typeof condition);
    if (typeOfCondition !== 'object') {
      return { message: 'type error! expecting an object' };
    }
    let queryString;
    if (!condition) {
      queryString = `select all from ${this.modelName}`;
    } else {
      const keys = Object.keys(condition.where);
      queryString = `delete from ${this.modelName}`;
      keys.forEach((key) => {
        if (queryString.indexOf('where') < 0) {
          queryString = `${queryString} where ${key} = '${condition.where[key]}'`;
        } else {
          queryString = `${queryString} and ${key} = '${condition.where[key]}'`;
        }
      });
    }
    if (process.env.NODE_ENV !== 'production') {
      /* eslint-disable no-console */
      console.log(queryString);
    }
    return queryString;
  }

  create(modelToCreate) {
    // create a new model
    const result = new Promise((resolve, reject) => {
      const queryString = this._generateCreateQuery(modelToCreate);
      client.query(queryString)
        .then((res) => {
            resolve(res.rows[0]);
        })
        .catch(error => console.log(error));
    });
    return result;
  }

  update(modelToUpdate, propsToUpdate) {
    /*
      propsToUpdate contain the new properties to replace the old ones
      this method should be called on the particular object to update.
      which means that before call update you must use the finder methods to
      get the particular object.
    */
    const result = new Promise((resolve, reject) => {
      if ((typeof propsToUpdate === 'object') && (typeof modelToUpdate === 'object')) {
        const queryString = this._generateUpdateQuery(propsToUpdate, modelToUpdate);
        client.query(queryString)
          .then((res) => {
            // if (res.rows.length === 0) {
              console.log("from update models", res.rows[0])
              resolve(res.rows[0])
              // resolve(modelToUpdate);
           // }
          })
          .catch(error => console.log(error));
      } else {
        reject({ message: 'invalid argument passed to update! expects argument1 and argument2 to be objects' });
      }
    });
    return result;
  }

  findById(id) {
    // return an object with the given id
    /* eslint-disable array-callback-return */
    const result = new Promise((resolve, reject) => {
      const queryString = this._generateGetQuery(id);
      client.query(queryString)
        .then((res) => {
        // console.log(res.rows[0])
          resolve(res.rows[0]);
        })
        .catch(error => console.log(error));
    });
    return result;
  }

  find(condition = 'all') {
    /* return a single object that meet the condition
      condition is single object with property where whose value is further
      an object with key => value pair of the properties of the object to find
    */
    const result = new Promise((resolve, reject) => {
      if (!condition || !condition.where) {
        reject({ message: 'missing object propertiy \'where\' to find model' });
      } else {
        const queryString = this._generateGetQuery(condition);
        client.query(queryString)
          .then((res) => {
           resolve(res.rows[0]);
          })
         // .catch(error => console.log(error));
      }
    });

    return result;
  }

  findAll(condition = 'all') {
    const result = new Promise((resolve, reject) => {
      const queryString = this._generateGetQuery(condition);
      client.query(queryString)
        .then((res) => {
          resolve(res.rows);
        })
        .catch(error => reject(error));
    });
    return result;
  }

  destroy(condition) {
    /*
      delete the object that meet the condition
      condition is single object with property where whose value is further
      an object with key => value pair of the properties of the object to find.
      if several object match the specified condition, only the first match will
      be deleted
    */
    const result = new Promise((resolve, reject) => {
      const queryString = this._generateGetQuery(condition);
      const res = client.query(queryString);
      res.then((result) => {
        const response = result.rows;
        resolve(response);
      })
        .catch(err => reject(err));
    });

    return result;
  }
};

export default DummyDataModel;
