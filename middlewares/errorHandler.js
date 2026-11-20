exports.notFound = (req, res) => {
  res.status(404).render('error', {
    error: 'Página no encontrada',
    user: res.locals.user
  });
};

exports.errorHandler = (err, req, res, next) => {
  console.error('💥', err);
  const status = err.status || 500;
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Error interno del servidor'
      : err.message;
  res.status(status).render('error', {
    error: message,
    user: res.locals.user
  });
};