const { getMyProfile } = require("../controllers/userController");
const { isAuthenticated } = require("../middleware/authMiddleware");

const router = require("express").Router();

router.get("/profile", isAuthenticated, getMyProfile);
module.exports = router;
