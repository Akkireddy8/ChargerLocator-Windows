const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel.js');
const dotenv = require('dotenv').config();

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
    const user = await userModel.findOne({ _id: decoded._id, token: token });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

module.exports = auth;
