require('dotenv').config()
const jwt = require('jsonwebtoken');

const authUser = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    try {
        if (!token) {
            throw new Error("No token provided");
        }
        const data = jwt.verify(token, process.env.SECRET);
        req.user = data.user;
        next();
        
    } catch (err) {
        console.error(err);

        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expired" });
        }
        return res.status(403).json({ message: "Invalid token or token expired!" });
    }
};

module.exports = {authUser};
