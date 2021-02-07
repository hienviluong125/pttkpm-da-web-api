const { authenticateToken, authorization } = require('./../../middlewares/auth.middleware');
const { WorkspaceType, Workspace } = require('./../../models/index');
const pagy = require('./../../utils/pagy');
const slugify = require('./../../utils/slugify');
const router = require('express').Router();

router.get('/', authenticateToken, authorization(['admin']), async function (req, res) {
  const page = typeof (req.query.page) !== 'undefined' ? parseInt(req.query.page) : 1;
  const workspaceTypePagy = await pagy({ model: WorkspaceType, limit: 10, page: page });

  res.json({ success: true, workspaceTypePagy });
});

// {
//   "name": "Meeting room"
// }
router.post('/create', authenticateToken, authorization(['admin']), async function (req, res) {
  const { name } = req.body;
  const nameSlug = slugify(name);

  const workspaceType = await WorkspaceType.build({ name: name, type: nameSlug });

  if (await workspaceType.save()) {
    return res.json({ success: true, workspace_type: { name, type: nameSlug } });
  } else {
    return res.status(500).json({ success: false });
  }
});

router.get('/:id/show', authenticateToken, authorization(['admin']), async function (req, res) {
  const workspaceType = await WorkspaceType.findOne({ where: { id: req.params.id } });

  res.json({ success: true, workspace_type: workspaceType });
});

// {
//   "name": "Private room"
// }
router.post('/:id/update', authenticateToken, authorization(['admin']), async function (req, res) {
  const { name } = req.body;
  const nameSlug = slugify(name);
  let workspaceType = await WorkspaceType.findOne({ where: { id: req.params.id } });

  workspaceType.name = name;
  workspaceType.type = nameSlug;

  if (await workspaceType.save()) {
    return res.json({ success: true, workspace_type: { name, type: nameSlug } });
  } else {
    return res.status(500).json({ success: false });
  }
});

router.post('/:id/delete', authenticateToken, authorization(['admin']), async function (req, res) {
  const workspaceType = await Workspace.findOne({ where: { workspace_type_id: req.params.id } });

  if (workspaceType)
    return res.json({ success: false, message: 'Some workspaces is using this workspace type' });

  if (await WorkspaceType.destroy({ where: { id: req.params.id } })) {
    return res.json({ success: true });
  } else {
    return res.status(500).json({ success: false });
  }
});

module.exports = router;