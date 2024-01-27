const express = require('express');
const router = express.Router();
const { signin, signup, updateUser, deleteUser, forgotPassword, resetPassword } = require('../controllers/users.js');
const auth = require('../middleware/auth.js');

// singin and signup routes
router.post('/signin', signin);
router.post('/signup', signup);

//update and delete routes
router.put('/update/:id', auth, updateUser);
router.delete('/delete/:id', auth, deleteUser);

//forgot password route 
router.post('/forgot-password', forgotPassword);

//reset password route
router.post('/reset-password', resetPassword);

module.exports = router;