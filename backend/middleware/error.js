const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error('❌ ERROR:', err.message);
  console.error('Stack:', err.stack);
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server Error',
    stack: err.stack
  });
};

module.exports = errorHandler;
