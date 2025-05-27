const router = require('express').Router();
const UsersC = require('../controllers/users.c');
const multer = require('multer');
const upload = multer(); 

router.put('/:id/avatar', upload.single('avatar'), UsersC.updateAvatar);

module.exports = router;