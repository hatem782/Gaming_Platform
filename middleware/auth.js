const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY;
const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: 'Authentication token missing' });
        }

        const isCustomAuth = token.length < 500;
        let decodedData;

        if (isCustomAuth) {
            decodedData = jwt.verify(token, secretKey);
            req.userId = decodedData?.id;
        } else {
            decodedData = jwt.decode(token);
            req.userId = decodedData?.sub;
        }

        next();
    } catch (error) {
        console.error(error);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired' });
        }

        return res.status(401).json({ message: 'Invalid token' });
    }
};
module.exports = auth;
