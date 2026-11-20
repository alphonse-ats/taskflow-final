const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;
  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    if (req.accepts('html')) return res.redirect('/auth/login');
    return res.status(401).json({ msg: 'No autorizado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) throw new Error('Usuario no existe');
    next();
  } catch (err) {
    if (req.accepts('html')) return res.redirect('/auth/login');
    res.status(401).json({ msg: 'Token inválido' });
  }
};

exports.adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    if (req.accepts('html')) {
      return res.status(403).render('error', {
        error: 'Acceso solo para administradores',
        user: req.user
      });
    }
    return res.status(403).json({ msg: 'Acceso denegado' });
  }
  next();
};

exports.setUser = async (req, res, next) => {
  res.locals.user = null;
  if (req.cookies && req.cookies.jwt) {
    try {
      const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
      res.locals.user = await User.findById(decoded.id);
    } catch (_) {}
  }
  next();
};