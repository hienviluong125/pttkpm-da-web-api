const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.JWT_KEY, (err, user) => {
    console.log(err)

    if (err) return res.sendStatus(403)

    req.user = user;
    next()
  });
}

function authorization(roles) {
  return (req, res, next) => {
    const currentUser = req.user
    if (currentUser && typeof currentUser !== 'undefined') {
      if (roles.includes(currentUser.role)) {
        return next();
      } else {
        return res.sendStatus(401)
      }
    }
  }
}

module.exports = {
  authenticateToken,
  authorization
}
