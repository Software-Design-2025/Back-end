const router = require('express').Router();
const UsersC = require('../controllers/users.c');
const multer = require('multer');
const upload = multer(); 

router.patch('/:id/avatar', upload.single('avatar'), UsersC.updateAvatar);
router.patch('/:id/profile', UsersC.updateProfile);
router.get('/:id', UsersC.getUser);

module.exports = router;