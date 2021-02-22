const app = require('./index');
const dbModel = require('./models/index');
const faker = require('faker');
const bcrypt = require('bcryptjs');

const { User, Workspace, WorkspaceType, Service, WorkspaceService, Order, Blog, Attachment } = dbModel;
const { Sequelize } = require('sequelize');
const role_enums = ['admin', 'member', 'partner']
const rdGender = ['male', 'female'];

const WorkspaceList = [
  {
    name: 'E-town Central',
    address: '11 Doan Van Bo, Ward 12, District 4, Ho Chi Minh City',
    country: 'Vietnam',
    lat: 10.757190,
    lng: 106.715230,
    price: 100,
    description: 'Located in District 4, WeWork’s coworking space in E. Town Central puts your team in the center of the action. We’ve transformed four floors in this modern high-rise into beautiful communal spaces, sleek private offices, and unique meeting rooms',
    max_capacity: 20,
    min_capacity: 5,
  },
  {
    name: 'Lim tower 3',
    address: '29A Nguyen Dinh Chieu, Dakao Ward, District 1',
    country: 'Vietnam',
    lat: 10.787110,
    lng: 106.698530,
    price: 120,
    description: 'Boasting stylish skyscrapers and old-world culture, Phường 4 is a vibrant area to grow your business. In WeWork’s shared office in Lim Tower 3, greet a client in an art-filled lounge, host a brainstorm in an innovative conference room, or regroup with your team in a private office. Commuting is simple with the Nguyễn Đình Chiểu bus station just a four-minute walk away',
    max_capacity: 30,
    min_capacity: 5,
  },
  {
    name: 'HM Tower',
    address: '412 Nguyen Thi Minh Khai, Ward 5, District 3',
    country: 'Vietnam',
    lat: 10.772730,
    lng: 106.688190,
    price: 80,
    description: '',
    max_capacity: 15,
    min_capacity: 5,
  },
  {
    name: 'Winhome Building',
    address: '132A Dien Bien Phu, Ward 10, District 3',
    country: 'Vietnam',
    lat: 10.788920,
    lng: 106.695820,
    price: 70,
    description: '',
    max_capacity: 10,
    min_capacity: 5,
  },
  {
    name: 'Bitexco Building',
    address: 'Level 3, 2 Hai Trieu, BenNghe Ward, District 1',
    country: 'Vietnam',
    lat: 10.771600,
    lng: 106.704800,
    price: 110,
    description: '',
    max_capacity: 10,
    min_capacity: 5,
  },
  {
    name: 'Tòa nhà Vincom Center',
    address: '72 Lê Thánh Tôn, Phường Bến Nghé, Quận 1, TPHCM',
    country: 'Vietnam',
    lat: 10.777830,
    lng: 106.701830,
    price: 80,
    description: '',
    max_capacity: 20,
    min_capacity: 5
  },

  {
    name: 'Tòa nhà Pearl Plaza',
    address: '561A Điện Biên Phủ, Phường 25, Quận Bình Thạnh, TPHCM',
    country: 'Vietnam',
    lat: 10.799630,
    lng: 106.718970,
    price: 80,
    description: '',
    max_capacity: 20,
    min_capacity: 5
  },

  {
    name: 'Replus Binh Phuoc',
    address: 'Số 1 Đường 5, Vạn Phúc 1, Phường Hiệp Bình Phước, TPHCM',
    country: 'Vietnam',
    lat: 10.836160,
    lng: 106.709520,
    price: 80,
    description: '',
    max_capacity: 20,
    min_capacity: 5
  },

  {
    name: 'C10 Rio Vista',
    address: '72 Dương Đình Hội, Phường Phước Long B, TP. Thủ Đức',
    country: 'Vietnam',
    lat: 10.822680,
    lng: 106.780190,
    price: 80,
    description: '',
    max_capacity: 20,
    min_capacity: 5
  },

  {
    name: 'Replus Thu Duc',
    address: '39 Đường số 10, Khu Phố 2, Phường Phú Hữu,TP. Thủ Đức',
    country: 'Vietnam',
    lat: 10.876680,
    lng: 106.775390,
    price: 80,
    description: '',
    max_capacity: 20,
    min_capacity: 5
  },

];


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
  }



  let randomUsers = await User.findAll({ where: { role: 'partner' }, order: Sequelize.literal('random()'), limit: 5 });

  for (let eachWorkspace of WorkspaceList) {
    let randomWorkspaceTypeId = wpt[faker.random.number(1, 5)].id;
    let randomUserId = randomUsers[faker.random.number(0, 4)].id;
    let workspace = await Workspace.create({
      name: eachWorkspace.name,
      workspace_type_id: randomWorkspaceTypeId,
      address: eachWorkspace.address,
      country: 'Vietnam',
      lat: eachWorkspace.lat,
      lng: eachWorkspace.lng,
      price: eachWorkspace.price,
      description: eachWorkspace.description,
      max_capacity: eachWorkspace.max_capacity,
      min_capacity: eachWorkspace.min_capacity,
      user_id: randomUserId
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
        url: `${faker.image.city()}?random=${Date.now()}`.replace("640", "1024"),
        type: 'Workspace',
        type_id: workspace.id
      })
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
