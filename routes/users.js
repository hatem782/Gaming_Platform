var express = require('express');
var router = express.Router();
const { signin, signup } = require('../controllers/users.js');

// singin and signup routes
router.post('/signin', signin);
router.post('/signup', signup);

module.exports = router;
