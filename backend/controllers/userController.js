const getMyProfile = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Authenticated successfully",
    user: req.user,
  });
};

module.exports = { getMyProfile };
