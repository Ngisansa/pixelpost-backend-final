const jwt = require('jsonwebtoken');

exports.signAccess = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: '15m',
  });
};

exports.signRefresh = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};
