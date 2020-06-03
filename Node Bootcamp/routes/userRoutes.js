const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authenticationController');

const router = express.Router();

router.get('/me', authController.protect, userController.getMe, userController.getUser)

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:resetToken', authController.resetPassword);

// all middleware protected after this row
router.use(authController.protect)

router.patch('/updatePassword',  authController.updatePassword);
router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

// restrict to admin after this row
router.use(authController.restrictTo('admin'));

router.route('/')
.get(userController.getAllUsers)

router.route('/:id')
.get(userController.getUser)
.patch(userController.updateUser)
.delete(userController.deleteUser)


module.exports = router;