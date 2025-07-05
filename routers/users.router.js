const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();

const {
  updateAvatarController,
  updateProfileController,
  getUserController,
} = require('../controllers/users.controller');

router.patch('/:id/avatar', upload.single('avatar'), updateAvatarController);
router.patch('/:id/profile', updateProfileController);
router.get('/:id', getUserController);

module.exports = router;
