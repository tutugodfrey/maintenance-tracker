/*
* export a class for working with objects
*/
const Services = class {
  static getImgUrl(path) {
    if (typeof (path) !== 'string') {
      return 'expected a string as argument';
    }
    const newPath = path.replace(/\\/g, '/');
    if (newPath.indexOf('/') < 0) {
      return `Cant resolve path ${newPath}`;
    }
    const indexOfPublic = newPath.indexOf('/');
    const relPath = newPath.substr(indexOfPublic, newPath.length);
    return relPath;
  }

  static getDate() {
    const dateObject = new Date();
    const day = dateObject.getDate();
    let month = dateObject.getMonth();
    if (month < 10) {
      month = `0${month}`;
    }
    const year = dateObject.getFullYear();
    const date = `${year}-${month}-${day}`;
    return date;
  }
};
export default Services;
