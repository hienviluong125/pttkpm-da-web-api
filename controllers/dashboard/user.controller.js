const { authenticateToken, authorization } = require('./../../middlewares/auth.middleware');
const { User } = require('./../../models/index');
const pagy = require('./../../utils/pagy');
const router = require('express').Router();

router.get('/', authenticateToken, authorization(['admin']), async function (req, res) {
  const page = typeof (req.query.page) !== 'undefined' ? parseInt(req.query.page) : 1;
  const attributes = { exclude: ['password', 'createdAt', 'updatedAt'] }
  const userPagy = await pagy({ model: User, limit: 10, page: page, attributes: attributes });

  res.json({ success: true, userPagy });
});

module.exports = router;