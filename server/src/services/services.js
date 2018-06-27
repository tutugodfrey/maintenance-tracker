
// const Services = class {
export const getImgUrl = (path) => {
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
};

export const handleResponse = (res, statusCode, message) => {
  if (typeof message !== 'string') {
    return res.status(statusCode).send(message);
  }
  return res.status(statusCode).send({ message });
};

