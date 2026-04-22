const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });

  res.json({
    token: generateToken(user._id),
    user
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  const match = await bcrypt.compare(password, user.password);

  if (user && match) {
    res.json({
      token: generateToken(user._id),
      user
    });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};