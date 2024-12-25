import jwt from 'jsonwebtoken'

const adminAuth = async (req, res, next) => {
    try {
        const token = req.headers.token; // Retrieve the token from the 'token' header

        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized! Token is missing." });
        }

        // Decode and verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded)
        // Validate token payload
        if (decoded.email !== process.env.ADMIN_EMAIL || decoded.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Forbidden! You are not authorized to access admin pages." });
        }

        next(); // Token is valid, proceed to the next middleware
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export default adminAuth;