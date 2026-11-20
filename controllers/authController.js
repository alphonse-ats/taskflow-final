const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });

const sendTokenCookie = (res, token) => {
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 3600000,
    sameSite: 'lax'
  });
};

exports.registerForm = (req, res) =>
  res.render('auth/register', { title: 'Registro' });

exports.register = [
  body('name').trim().isLength({ min: 2 }).withMessage('Nombre muy corto'),
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password mínimo 6 caracteres'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('auth/register', {
        title: 'Registro',
        errors: errors.array(),
        old: req.body
      });
    }
    try {
      const exists = await User.findOne({ email: req.body.email });
      if (exists) {
        return res.status(400).render('auth/register', {
          title: 'Registro',
          errors: [{ msg: 'Email ya registrado' }],
          old: req.body
        });
      }
      const user = await User.create(req.body);
      sendTokenCookie(res, signToken(user._id));
      res.redirect('/tasks');
    } catch (err) {
      res.status(500).render('error', { error: err.message });
    }
  }
];

exports.loginForm = (req, res) =>
  res.render('auth/login', { title: 'Login' });

exports.login = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('auth/login', {
        title: 'Login',
        errors: errors.array()
      });
    }
    try {
      const user = await User.findOne({ email: req.body.email }).select('+password');
      if (!user || !(await user.comparePassword(req.body.password))) {
        return res.status(401).render('auth/login', {
          title: 'Login',
          errors: [{ msg: 'Credenciales inválidas' }]
        });
      }
      sendTokenCookie(res, signToken(user._id));
      res.redirect('/tasks');
    } catch (err) {
      res.status(500).render('error', { error: err.message });
    }
  }
];

exports.logout = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/auth/login');
};