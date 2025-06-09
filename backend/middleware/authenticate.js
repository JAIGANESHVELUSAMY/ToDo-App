const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    // 1. Look for the 'authorization' header
    const authHeader = req.headers.authorization;

    // 2. Check if it exists and is correctly formatted
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authentication token is required.' });
    }

    // 3. Extract the token from the header string
    const token = authHeader.split(' ')[1];

    // 4. Verify the token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 5. IMPORTANT: Attach the decoded payload to the request object
        // The payload is now just { id: '...' }
        req.user = decoded; 
        
        // 6. Pass control to the next function (the route handler)
        next();
    } catch (err) {
        // This will catch expired tokens or invalid signatures
        return res.status(403).json({ message: 'Forbidden: Invalid or expired token.' });
    }
};

module.exports = authenticate;