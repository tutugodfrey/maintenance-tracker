/*
* export a class for working with objects
*/
const HelperFuncts = class {
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
};
export default HelperFuncts;
