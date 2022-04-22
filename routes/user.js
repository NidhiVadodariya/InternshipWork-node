const express = require('express');
const router = express.Router();
const { isLoggedIn ,customRole } = require('../middleware/user');

const {signUp,
    login,
    logout,
    forgotPassword,
    passwordReset,
    getLoggedInUserDetails,
    changePassword,
    updateUserDetails,
    adminAllUser,
    managerAllUser,
    adminGetOneUser,
    adminUpdateOneUserDetails,
    adminDeleteOneUserDetails } = require('../controllers/userController');

router.route('/signUp').post(signUp);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/forgotPassword').post(forgotPassword);
router.route('/password/reset/:token').post(passwordReset);
router.route('/userdashboard').get(isLoggedIn,getLoggedInUserDetails);
router.route('/password/update').post(isLoggedIn,changePassword);
router.route('/userdashboard/update').post(isLoggedIn,updateUserDetails);

//admin routes
router.route('/admin/users').get(isLoggedIn,customRole('admin'),adminAllUser);
router
    .route('/admin/users/:id')
    .get(isLoggedIn,customRole('admin'),adminGetOneUser)
    .put(isLoggedIn,customRole('admin'),adminUpdateOneUserDetails)
    .delete(isLoggedIn,customRole('admin'),adminDeleteOneUserDetails);

//manager only route
router.route('/manager/users').get(isLoggedIn,customRole('manager'),managerAllUser);

module.exports = router;