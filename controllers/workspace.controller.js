const { authenticateToken, authorization } = require('./../middlewares/auth.middleware');
const { Order, Workspace, Attachment, WorkspaceService, User, WorkspaceType } = require('./../models/index');
const pagy = require('./../utils/pagy');
const router = require('express').Router();

router.get('/', authenticateToken, authorization(['admin', 'partner']), async function (req, res) {
  const page = typeof (req.query.page) !== 'undefined' ? parseInt(req.query.page) : 1;
  const queryOption = {
    user_id: req.user.id,
  }

  const includeOption = [
    { model: User, attributes: { exclude: ['password', 'createdAt', 'updatedAt'] } },
    { model: Attachment },
    { model: WorkspaceService },
    { model: WorkspaceType }
  ]

  const workspacePagy = await pagy({ model: Workspace, queryOption, include: includeOption, limit: 10, page: page });

  res.json({ success: true, workspacePagy });
});

router.get('/:id/show', authenticateToken, authorization(['admin', 'partner']), async function (req, res) {
  const workspace = await Workspace.findOne({
    where: { id: req.params.id },
    include: [
      { model: User, attributes: { exclude: ['password', 'createdAt', 'updatedAt'] } },
      { model: Attachment },
      { model: WorkspaceService },
      { model: WorkspaceType }
    ]
  })

  res.json({ success: true, workspace });
});

// {
//   "name": "Van Phong KHTN",
//   "address": "272 Nguyen Van Cu",
//   "country": "Vietnam",
//   "lat": -69.3349,
//   "lng": 153.901,
//   "price": 2000,
//   "description": "Test description",
//   "max_capacity": 20,
//   "min_capacity": 10,
//   "user_id": 51,
//   "workspace_type_id": 4,
//   "workspace_services": [
//       {
//           "name": "Thue Noi That",
//           "price": 100
//       },
//       {
//           "name": "May chieu",
//           "price": 50
//       }
//   ],
//   "attachments": [
//       {
//           "url": "https://i.picsum.photos/id/607/200/300.jpg?hmac=ZEvzqI62NudR3rgqTkRZzFnlEeOt9z-b_i8VdLoTgoI"
//       },
//       {
//           "url": "https://i.picsum.photos/id/531/200/300.jpg?hmac=zfPpbPSZ6_bXrCHp-HkvsObzLfkIb7pvmBoZhXrjKo4"
//       }
//   ]
// }
router.post('/create', authenticateToken, authorization(['admin', 'partner']), async function (req, res) {
  const {
    name,
    address,
    country,
    lat,
    lng,
    price,
    description,
    max_capacity,
    min_capacity,
    workspace_type_id,
    workspace_services,
    attachments
  } = req.body

  try {
    const workspace = await Workspace.create({
      name,
      address,
      country,
      lat,
      lng,
      price,
      description,
      max_capacity,
      min_capacity,
      workspace_type_id,
      user_id: req.user.id,
    });

    if (workspace && workspace_services) {
      for (let ws of workspace_services) {
        await WorkspaceService.create({ name: ws.name, price: ws.price, workspace_id: workspace.id })
      }
    }

    if (workspace && attachments) {
      for (let atta of attachments) {
        await Attachment.create({ url: atta.url, type: 'Workspace', type_id: workspace.id })
      }
    }

    return res.status(200).json({ success: true })
  } catch {
    return res.status(500).json({ success: false });
  }
});

//   {
//     "name": "Van Phong KHTN Updated By Hien",
//     "address": "272 Nguyen Van Cu",
//     "country": "Vietnam",
//     "lat": -69.3349,
//     "lng": 153.901,
//     "price": 2000,
//     "description": "Test description",
//     "max_capacity": 20,
//     "min_capacity": 10,
//     "user_id": 51,
//     "workspace_type_id": 4,
//     "workspace_services": [
//         {
//             "name": "Ca Nhac",
//             "price": 100
//         },
//         {
//             "name": "Gui xe",
//             "price": 50
//         }
//     ],
//     "attachments": [
//         {
//             "url": "https://i.picsum.photos/id/607/200/300.jpg?hmac=ZEvzqI62NudR3rgqTkRZzFnlEeOt9z-b_i8VdLoTgoI"
//         },
//         {
//             "url": "https://salt.topdev.vn/4iaT1BPwMLVfhWRq_YxDSzgBZjoexC274TH0lLU23SU/auto/312/274/ce/1/aHR0cHM6Ly9hc3NldHMudG9wZGV2LnZuL2ltYWdlcy8yMDIxLzAxLzE5L3JzenRyaXAtOC1yeU5ZWC5qcGc/rsztrip-8-rynyx.jpg"
//         }
//     ]
// }
router.post('/:id/update', authenticateToken, authorization(['admin', 'partner']), async function (req, res) {
  const {
    name,
    address,
    country,
    lat,
    lng,
    price,
    description,
    max_capacity,
    min_capacity,
    workspace_type_id,
    workspace_services,
    attachments
  } = req.body

  try {
    const workspace = await Workspace.findOne({ where: { id: req.params.id } });

    if (workspace.user_id !== req.user.id)
      return res.status.json({ success: false })

    workspace.name = name
    workspace.address = address
    workspace.country = country
    workspace.lat = lat
    workspace.lng = lng
    workspace.price = price
    workspace.description = description
    workspace.max_capacity = max_capacity
    workspace.min_capacity = min_capacity
    workspace.workspace_type_id = workspace_type_id

    if (workspace.save()) {
      if (workspace_services) {
        await WorkspaceService.destroy({ where: { workspace_id: workspace.id } });

        for (let ws of workspace_services) {
          await WorkspaceService.create({ name: ws.name, price: ws.price, workspace_id: workspace.id })
        }
      }

      if (attachments) {
        await Attachment.destroy({ where: { type: 'Workspace', type_id: workspace.id } });

        for (let atta of attachments) {
          await Attachment.create({ url: atta.url, type: 'Workspace', type_id: workspace.id })
        }
      }

      return res.status(200).json({ success: true });
    } else {
      return res.status(500).json({ success: false });
    }
  } catch {
    return res.status(500).json({ success: false });
  }
});

router.post('/:id/delete', authenticateToken, authorization(['admin', 'partner']), async function (req, res) {
  const order = await Order.findAll({ where: { workspace_id: req.params.id } })
  if (order && order.length > 0)
    return res.status(500).json({ success: false })

  try {
    const workspace = await Workspace.findOne({ where: { id: req.params.id } });

    if (workspace.user_id !== req.user.id)
      return res.status(500).json({ success: false })

    await Workspace.destroy({ where: { id: req.params.id } })

    return res.json({ success: true })
  } catch {
    return res.status(500).json({ success: false })
  }
});

module.exports = router;
