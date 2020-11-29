const { generateJWT } = require('./../utils/jwt');
const User = require('./../models/index').User;
const bcrypt = require('bcrypt');

module.exports = function (router) {
  router.post('/sign_up', async function(req,res) {
    const userParams = req.body['user'];
    let user = await User.findOne({
      where: {
        email: userParams['email']
      }
    });

    if(user) return res.json({ success: false, message: 'Email already be taken!' });

    const encryptedPassword = await bcrypt.hash(userParams['password'], 10)
    user = User.build({
      email: userParams['email'],
      password: encryptedPassword,
      role: 'member'
    });

    const createdUser = await user.save();
    if(!createdUser) {
      return res.json({ success: false, message: 'Something went wrong !' });
    }
    const token = generateJWT({ id: createdUser.id, email: createdUser.email, role: createdUser.role });
    res.json({ success: true, message: 'Account registered successfully', token: token });
  });

  router.post('/login', async function (req, res) {
    const userParams = req.body['user'];

    const user = await User.findOne({
      where: {
        email: userParams['email']
      }
    });

    if(!user) return res.json({ success: false, message: "Account isn't registered" });

    const isMatch = await bcrypt.compare(userParams['password'], user.password);

    if(!isMatch) return res.json({ success: false, message: "Password doesn't match" });

    const token = generateJWT({ id: user.id, email: user.email, role: user.role });
    res.json({ success: true, message: 'Account registered successfully', token: token });
  });

  return router;
};