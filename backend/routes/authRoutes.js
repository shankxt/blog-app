const { registerUser, loginUser } = require("../controllers/authController");
const { isAuthenticated } = require("../middleware/authMiddleware");

const router = require("express").Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", isAuthenticated, (req, res) => {
  // Yahan response bhejna hai
  res
    .status(200)
    .json({
      success: true,
      message: "Authenticated successfully",
      user: req.user,
    });
});

module.exports = router;
