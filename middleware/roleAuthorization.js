module.exports = function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    // Pastikan role ada dan bandingkan dengan .name
    if (!req.user || !req.user.role || !allowedRoles.includes(req.user.role.name)) {
      return res.status(403).json({ message: 'Forbidden: You do not have access.' });
    }
    next();
  };
};
