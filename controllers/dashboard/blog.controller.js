const { authenticateToken, authorization } = require('./../../middlewares/auth.middleware');
const { Blog } = require('./../../models/index');
const pagy = require('./../../utils/pagy');
const slugify = require('./../../utils/slugify');
const router = require('express').Router();

router.get('/', authenticateToken, authorization(['admin']), async function (req, res) {
  const page = typeof (req.query.page) !== 'undefined' ? parseInt(req.query.page) : 1;
  const blogPagy = await pagy({ model: Blog, limit: 10, page: page });

  res.json({ success: true, blogPagy });
});

// {
//   "name": "Meeting room"
// }
router.post('/create', authenticateToken, authorization(['admin']), async function (req, res) {
  const { title, content, short_description } = req.body;

  const blog = await Blog.build({ title, content, short_description });

  if (await blog.save()) {
    return res.json({ success: true, blog: { title, content, short_description } });
  } else {
    return res.status(500).json({ success: false });
  }
});

router.get('/:id/show', authenticateToken, authorization(['admin']), async function (req, res) {
  const blog = await Blog.findOne({ where: { id: req.params.id } });

  res.json({ success: true, blog });
});

// {
//   "name": "Private room"
// }
router.post('/:id/update', authenticateToken, authorization(['admin']), async function (req, res) {
  const { title, content, short_description } = req.body;

  let blog = await Blog.findOne({ where: { id: req.params.id } });

  blog.title = title;
  blog.content = content;
  blog.short_description = short_description;

  if (await blog.save()) {
    return res.json({ success: true, blog });
  } else {
    return res.status(500).json({ success: false });
  }
});

router.post('/:id/delete', authenticateToken, authorization(['admin']), async function (req, res) {
  if (await Blog.destroy({ where: { id: req.params.id } })) {
    return res.json({ success: true });
  } else {
    return res.status(500).json({ success: false });
  }
});

module.exports = router;