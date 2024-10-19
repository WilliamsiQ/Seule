const User = require("../model/User");

const bcrypt = require("bcrypt");

//handles user registration save data to database and show the data in database

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "username and password are required" });

  const duplicate = await User.findOne({ username: user }).exec();
  if (duplicate) return res.sendStatus(409); // 409 conflict, cos its a user with that same username already

  try {
    //encrypt password
    const hashedPwd = await bcrypt.hash(pwd, 10);

    //create and store new user
    const result = await User.create({
      username: user,
      password: hashedPwd,
    });

    console.log(result);

    res.status(201).json({ success: `New User  ${user} created` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
