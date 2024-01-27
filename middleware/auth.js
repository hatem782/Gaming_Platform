const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY;
const passport = require('passport');
const configureGoogleAuthentication = require('../controllers/googleUsers.js');
const configureFacebookAuthentication = require('../controllers/facebookUsers.js');
const { User } = require('../models/users.js');

configureGoogleAuthentication(passport);
configureFacebookAuthentication(passport);

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: 'Authentication token missing' });
    }

    let decodedData;

    if (token.startsWith('Google ')) {
      // Use Passport.js to authenticate Google token
      passport.authenticate('google', { session: false }, (err, user) => {
        if (err || !user) {
          return res.status(401).json({ message: 'Google authentication failed' });
        }
        req.user = user; // Attach the user object to the request
        next();
      })(req, res, next);
    } else if (token.startsWith('Facebook ')) {
      // Use Passport.js to authenticate Facebook token
      passport.authenticate('facebook', { session: false }, (err, user) => {
        if (err || !user) {
          return res.status(401).json({ message: 'Facebook authentication failed' });
        }
        req.user = user; // Attach the user object to the request
        next();
      })(req, res, next);
    } else {
      const isCustomAuth = token.length < 500;

      if (isCustomAuth) {
        decodedData = jwt.verify(token, secretKey);
        req.user = await User.findOne({ _id: decodedData?.id });
      } else {
        decodedData = jwt.decode(token);
        req.user = await User.findOne({ _id: decodedData?.id });
      }

      next();
    }
  } catch (error) {
    console.error(error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired' });
    }

    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = auth;
