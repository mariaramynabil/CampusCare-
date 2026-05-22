const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const userRole = req.user.role;

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          error: "Access forbidden",
        });
      }

      next();
    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }
  };
};

module.exports = authorizeRoles;