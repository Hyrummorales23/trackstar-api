const requireAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({
        success: false,
        error: 'Authentication required'
    });
};

const optionalAuth = (req, res, next) => {
    // If user is authenticated, add user ID to request
    if (req.isAuthenticated()) {
        req.userId = req.user._id;
    }
    next();
};

module.exports = {
    requireAuth,
    optionalAuth
};