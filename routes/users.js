var express = require('express');
var router = express.Router();
const { signin, signup, updateUser, deleteUser } = require('../controllers/users.js');
const auth = require('../middleware/auth.js');

// singin and signup routes
router.post('/signin', signin);
router.post('/signup', signup);

//update and delete routes
router.put('/update/:id', auth, updateUser);
router.delete('/delete/:id', auth, deleteUser);

module.exports = router;
