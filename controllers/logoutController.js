const User = require("../model/User");

const handleLogout = async (req, res) => {
  // on client side also delete the accesstoken

  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res.sendStatus(204); // successful and no content to send back
  }

  const refreshToken = cookies.jwt;

  // check if user/refreshtoken exist in the database
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    res.sendStatus(204);
  }
  //delete the refresh token in database
  foundUser.refreshToken = "";
  const result = await foundUser.save();
  console.log(result);
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true }); // secure: true only - serve on https
  res.sendStatus(204);
};

module.exports = { handleLogout };
