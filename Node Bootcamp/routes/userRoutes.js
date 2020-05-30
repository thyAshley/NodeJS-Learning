const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');

const authController = require('../controllers/authenticationController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.patch('/updatePassword', authController.protect, authController.updatePassword);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:resetToken', authController.resetPassword);
router.post('/updateMe', authController.protect, userController.updateMe);

router.route('/')
.get(userController.getAllUsers)
.post(userController.createUser);

router.route('/:id')
.get(userController.getUser)
.patch(userController.updateUser)
.delete(userController.deleteUser)

module.exports = router;