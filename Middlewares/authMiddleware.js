const jwt = require('jsonwebtoken')

const authMiddleware = async function(req, res, next) {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.json({
            status:401,
            message:"Access Denied"
        })
    }

    const token = authHeader.split(' ')[1];

    if(token === null) {
        return res.json({
            status:401,
            message:"No Login Token. Try to login again."
        })
    }

    try {
        const payload = await jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        next();
    } catch (error) {
        return res.json({
            status:500,
            message:"error message"
        })
    }
}

module.exports = authMiddleware