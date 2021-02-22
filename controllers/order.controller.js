const { authenticateToken, authorization } = require('./../middlewares/auth.middleware');
const Workspace = require('./../models/index').Workspace;
const Order = require('./../models/index').Order;
const User = require('./../models/index').User;
const pagy = require('./../utils/pagy');
const router = require('express').Router();

router.get('/partner/:id/index', authenticateToken, authorization(['partner']), async (req, res) => {
  if (req.user.id != req.params.id) {
    return res.json({ success: false, message: 'Cannot perform this action!' });
  }

  const myWorkspaces = await Workspace.findAll({ where: { user_id: parseInt(req.params.id) } });
  const workspaceIds = myWorkspaces.map(workspace => workspace.id);

  const page = typeof (req.query.page) !== 'undefined' ? parseInt(req.query.page) : 1;
  const limit = typeof (req.query.limit) !== 'undefined' ? parseInt(req.query.limit) : 10;
  const includeOption = [
    { model: Workspace },
    { model: User, attributes: { exclude: ['password', 'createdAt', 'updatedAt'] } },
  ]
  const queryOption = {
    workspace_id: workspaceIds
  };

  const orderPagy = await pagy({ model: Order, include: includeOption, limit: limit, page: page, queryOption: queryOption });

  return res.json({ success: true, orderPagy });

  // const workspaceIds =



});

router.get('/member/:id/index', authenticateToken, authorization(['member']), async (req, res) => {
  if (req.user.id != req.params.id) {
    return res.json({ success: false, message: 'Cannot perform this action!' });
  }

  const page = typeof (req.query.page) !== 'undefined' ? parseInt(req.query.page) : 1;
  const limit = typeof (req.query.limit) !== 'undefined' ? parseInt(req.query.limit) : 10;
  const includeOption = [
    { model: Workspace }
  ]

  const queryOption = {
    user_id: req.params.id
  };

  const orderPagy = await pagy({ model: Order, include: includeOption, limit: limit, page: page, queryOption: queryOption });

  return res.status(200).json({
    success: true,
    orderPagy: orderPagy
  })
});

router.post('/create', authenticateToken, authorization(['member']), async (req, res) => {
  const orderParams = req.body.order;
  const isExistPending = await Order.findOne({ where: { workspace_id: orderParams.workspace_id, status: 'pending', user_id: req.user.id } });
  const isExistUnpaid = await Order.findOne({ where: { workspace_id: orderParams.workspace_id, status: 'unpaid', user_id: req.user.id } });
  if (isExistPending) {
    return res.json({ success: false, message: "Your already booked this workspace, your order's is in processing!" });
  }

  if (isExistUnpaid) {
    return res.json({ success: true, message: "Your already booked this workspace, please pay it to continue!" });
  }

  const order = await Order.build({ ...orderParams, user_id: req.user.id, status: 'pending' });
  if (await order.save()) {
    return res.json({ success: true, order: orderParams });
  }

  return res.json({ success: false, message: 'Something went wrong!' });
});

router.post('/:id/update', authenticateToken, authorization(['partner', 'member']), async (req, res) => {
  const orderParams = req.body.order;
  const order = await Order.findOne({ where: { id: req.params.id } });

  if (!order) {
    return res.json({ success: false, message: 'Order not found!' });
  }

  order.status = orderParams.status;
  order.amount = orderParams.amount;

  if (await order.save()) {
    return res.json({ success: true, order: order });
  }

  return res.json({ success: false, message: 'Something went wrong!' });
});

module.exports = router;