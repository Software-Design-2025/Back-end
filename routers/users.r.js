const express = require('express');
const router = express.Router();
const UsersC = require('../controllers/users.c');
const multer = require('multer');
const upload = multer(); 
const userController = require('../controllers/users.c');

// GET /routers/users/detail?id=...
router.get('/detail', userController.getUserDetail);

router.patch('/:id/avatar', upload.single('avatar'), UsersC.updateAvatar);
router.patch('/:id/profile', UsersC.updateProfile);
router.get('/:id', UsersC.getUser);
router.post('/update-credits', userController.updateUserCredits);

module.exports = router;