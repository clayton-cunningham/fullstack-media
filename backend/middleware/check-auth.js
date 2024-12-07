const HttpError = require("../models/http-error");
const jsonwebtoken = require("jsonwebtoken");

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            throw new Error('Authentication failed');
        }

        const decodedToken = jsonwebtoken.verify(token, 'gerudoSecretCodeDiamond');

        req.userData = { userId: decodedToken.userId };

        next();

    } catch (e) {
        const error = new HttpError('Authentication failed', 401);
        return next(error);
    }
}