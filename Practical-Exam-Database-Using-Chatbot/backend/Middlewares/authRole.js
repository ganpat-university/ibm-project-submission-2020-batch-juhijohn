const authRole = (role) => {
    return (req, res, next) => {
        const userRole = req.user.role;
        if (userRole === role) {
            next();
        } else {
            res.status(403).json({ message: "Permission denied!" });
        }
    };
};

module.exports = {authRole};
