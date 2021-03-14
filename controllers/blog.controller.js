const { authenticateToken, authorization } = require('./../middlewares/auth.middleware');
const { Blog, User } = require('./../models/index');
const pagy = require('./../utils/pagy');
const router = require('express').Router();

router.get('/', authenticateToken, authorization(['admin', 'partner', 'member']), async function (req, res) {
  const page = typeof (req.query.page) !== 'undefined' ? parseInt(req.query.page) : 1;
  const queryOption = {
    user_id: req.user.id,
  }
  const blogPagy = await pagy({ model: Blog, limit: 10, page: page, queryOption: queryOption });

  res.json({ success: true, blogPagy });
});

router.get('/hot_blogs', async function (req, res) {
  const page = typeof (req.query.page) !== 'undefined' ? parseInt(req.query.page) : 1;
  const limit = typeof(req.query.limit) !== 'undefined' ? parseInt(req.query.limit) : 10;
  const includeOption = [
    { model: User, attributes: { exclude: ['password', 'createdAt', 'updatedAt'] } }
  ]

  const blogPagy = await pagy({ model: Blog, include: includeOption, limit: limit, page: page });

  res.json({ success: true, blogPagy });
})

// {
//   "title": "aaa",
//   "short_description": "ahihi",
//   "content": "hello world !!!!!!"
// }
router.post('/create', authenticateToken, authorization(['admin', 'partner', 'member']), async function (req, res) {
  const { title, content, short_description, image } = req.body;

  const blog = await Blog.build({ title, content, short_description, user_id: req.user.id, image });

  if (await blog.save()) {
    return res.json({ success: true, blog: { title, content, short_description, image } });
  } else {
    return res.status(500).json({ success: false });
  }
});

router.get('/:id/show', async function (req, res) {
  const blog = await Blog.findOne({ where: { id: req.params.id } });

  res.json({ success: true, blog });
});

// {
//   "title": "aaa updated",
//   "short_description": "ahihi updated",
//   "content": "hello world !!!!!! updated"
// }
router.post('/:id/update', authenticateToken, authorization(['admin', 'partner', 'member']), async function (req, res) {
  const { title, content, short_description, image } = req.body;

  let blog = await Blog.findOne({ where: { id: req.params.id, user_id: req.user.id } });

  blog.title = title;
  blog.content = content;
  blog.short_description = short_description;
  blog.image = image;

  if (await blog.save()) {
    return res.json({ success: true, blog });
  } else {
    return res.status(500).json({ success: false });
  }
});

router.post('/:id/delete', authenticateToken, authorization(['admin', 'partner', 'member']), async function (req, res) {
  if (await Blog.destroy({ where: { id: req.params.id, user_id: req.user.id } })) {
    return res.json({ success: true });
  } else {
    return res.status(500).json({ success: false });
  }
});

module.exports = router;
