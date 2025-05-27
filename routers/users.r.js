const router = require('express').Router();
const UsersC = require('../controllers/users.c');
const multer = require('multer');
const upload = multer(); 

router.put('/:id/avatar', upload.single('avatar'), UsersC.updateAvatar);
router.put('/:id/profile', UsersC.updateProfile);
router.get('/:id', UsersC.getUser);

module.exports = router;