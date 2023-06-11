const router = require('express').Router();

const {
  updateUserInfo,
  getCurrentUser,
} = require('../controllers/user');

const { userUpdateInfoValidation } = require('../middlewares/validations');

router.get('/me', getCurrentUser);
router.patch('/me', userUpdateInfoValidation, updateUserInfo);

module.exports = router;
