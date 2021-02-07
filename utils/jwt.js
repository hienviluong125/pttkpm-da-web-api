const jwt = require('jsonwebtoken');

const generateJWT = function(user) {
  return jwt.sign(user, process.env.JWT_KEY, { expiresIn: '1d' });
}

module.exports = {
  generateJWT
}
