const { authenticateToken } = require('./../middlewares/auth.middleware');
const User = require('./../models/index').User;
const router = require('express').Router();

/**
 * @api {get} /api/user/profile Request User Profile
 * @apiName User Profile
 * @apiGroup User
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer eyJhb....."
 *     }
 *
 * @apiSuccessExample
 * {
 *  "success": true,
 *  "user": {
 *    "id": 4,
 *    "first_name": null,
 *    "last_name": null,
 *    "username": null,
 *    "email": "arlo.luong.golden@gmail.com",
 *    "gender": null,
 *    "phone": null,
 *    "address": null,
 *    "role": "member"
 *   }
 * }
 *
 */
router.get('/profile', authenticateToken, async function (req, res) {
  const currentUserId = req.user.id;
  const user = await User.findOne({
    where: { id: currentUserId },
    attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
  });
  res.json({ success: true, user });
});

module.exports = router;
