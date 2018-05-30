import multer from 'multer';

const UsersStorage = multer.diskStorage({
  destination: './public/users-photo/',
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const usersUpload = multer({ storage: UsersStorage });
export default usersUpload;
