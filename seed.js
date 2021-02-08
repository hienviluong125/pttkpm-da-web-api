const app = require('./index');
const dbModel = require('./models/index');
const faker = require('faker');
const bcrypt = require('bcryptjs');

const { User, Workspace, WorkspaceType, Service, WorkspaceService, Order, Blog, Attachment } = dbModel;
const { Sequelize } = require('sequelize');
const role_enums = ['admin', 'member', 'partner']
const rdGender = ['male', 'female'];

const seedUsers = async ({ seedAdmin }) => {
  let pwd = await bcrypt.hash('12345678', 10);
  if (seedAdmin) {
    await User.create({
      address: faker.address.streetAddress(),
      phone: faker.phone.phoneNumber(),
      first_name: 'admin',
      last_name: 'workspace manager',
      email: 'admin@workspace.com',
      username: 'admin_workspace',
      gender: rdGender[faker.random.number(1)],
      password: pwd,
      role: 'admin',
    });
  }

  let n = 5;
  for (let i = 0; i < n; i++) {
    await User.create({
      address: faker.address.streetAddress(),
      phone: faker.phone.phoneNumber(),
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      email: faker.internet.email().toLowerCase(),
      gender: rdGender[faker.random.number(1)],
      username: faker.internet.userName(),
      password: pwd,
      role: role_enums[faker.random.number(2)],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}

const seedWorkspaceType = async () => {
  await WorkspaceType.create({ name: 'Restaurant', type: 'restaurant' })
  await WorkspaceType.create({ name: 'Beer club', type: 'beer-club' })
  await WorkspaceType.create({ name: 'Co workspace', type: 'co-workspace' })
  await WorkspaceType.create({ name: 'Event', type: 'event' })
  await WorkspaceType.create({ name: 'Office', type: 'Office' })
  await WorkspaceType.create({ name: 'Studio', type: 'studio' })
  await WorkspaceType.create({ name: 'Gaming house', type: 'gaming-house' })
}

const seedWorkspaceWithService = async () => {
  let wpt = await WorkspaceType.findAll({ order: Sequelize.literal('random()'), limit: 5 });
  let pwd = await bcrypt.hash('12345678', 10);
  for (let i = 0; i < 5; i++) {
    let user = await User.create({
      address: faker.address.streetAddress(),
      phone: faker.phone.phoneNumber(),
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      email: faker.internet.email().toLowerCase(),
      gender: rdGender[faker.random.number(1)],
      username: faker.internet.userName(),
      password: pwd,
      role: 'partner',
    });

    for (let j = 0; j < 3; j++) {
      let randomWorkspaceTypeId = wpt[faker.random.number(1, 5)].id;
      let rdNumber = faker.random.number(5, 15)
      let workspace = await Workspace.create({
        name: faker.name.findName(),
        workspace_type_id: randomWorkspaceTypeId,
        address: faker.address.streetAddress(),
        country: faker.address.country(),
        lat: faker.address.latitude(),
        lng: faker.address.longitude(),
        price: faker.commerce.price(),
        description: faker.lorem.sentence(),
        max_capacity: rdNumber + 10,
        min_capacity: rdNumber,
        user_id: user.id
      })

      for (let z = 0; z < 5; z++) {
        let workspaceService = await WorkspaceService.create({
          name: faker.name.findName(),
          price: faker.commerce.price(),
          workspace_id: workspace.id
        })
      }

      for (let z = 0; z < 5; z++) {
        let workspaceAttachment = await Attachment.create({
          url: faker.image.imageUrl(),
          type: 'Workspace',
          type_id: workspace.id
        })
      }
    }
  }
}

const seedBlog = async () => {
  let pwd = await bcrypt.hash('12345678', 10);
  for (let i = 0; i < 5; i++) {
    let user = await User.create({
      address: faker.address.streetAddress(),
      phone: faker.phone.phoneNumber(),
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      email: faker.internet.email().toLowerCase(),
      gender: rdGender[faker.random.number(1)],
      username: faker.internet.userName(),
      password: pwd
    });

    for (let j = 0; j < 5; j++) {
      await Blog.create({
        title: faker.lorem.sentence(),
        short_description: faker.lorem.sentence(),
        content: faker.lorem.sentences(10),
        user_id: user.id
      })
    }

  }
}


const seedOrder = async () => {
  let wp = await Workspace.findAll({ order: Sequelize.literal('random()'), limit: 5 });
  let pwd = await bcrypt.hash('12345678', 10);
  let rdStatus = ['unpaid', 'pending', 'paid', 'rejected'];

  for (let i = 0; i < 5; i++) {
    let user = await User.create({
      address: faker.address.streetAddress(),
      phone: faker.phone.phoneNumber(),
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      email: faker.internet.email().toLowerCase(),
      gender: rdGender[faker.random.number(1)],
      username: faker.internet.userName(),
      password: pwd,
      role: 'member',
    });


    for (let j = 0; j < 5; j++) {
      const randomWp = wp[faker.random.number(1, 5)];
      const order = await Order.create({
        capacity: randomWp.min_capacity + 1,
        note: faker.lorem.sentence(),
        date: faker.date.recent(),
        amount: faker.commerce.price(),
        user_id: user.id,
        workspace_id: randomWp.id,
        status: rdStatus[faker.random.number(3)],
      })
    }

  }
}

(async function () {
  await User.destroy({ where: {} });
  await Workspace.destroy({ where: {} });
  await WorkspaceType.destroy({ where: {} });
  await WorkspaceService.destroy({ where: {} });
  await Order.destroy({ where: {} });
  await Blog.destroy({ where: {} });
  await Attachment.destroy({ where: {} });

  await seedWorkspaceType()
  await seedUsers({ seedAdmin: true });
  await seedWorkspaceWithService();
  await seedOrder();
  await seedBlog();

  process.exit()
})();
