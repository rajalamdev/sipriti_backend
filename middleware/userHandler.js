const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');

exports.authentication = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).json({ message: 'Harap login terlebih dahulu' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id, {
      include: { model: Role, as: 'role' }
    });
    if (!user) return res.status(401).json({ message: 'User tidak ditemukan' });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token tidak valid atau expired' });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role && req.user.role.name === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Akses ditolak: Anda bukan admin.' });
};


