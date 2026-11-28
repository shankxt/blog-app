const { isAuthenticated } = require("../middleware/authMiddleware");
const { addComment } = require("../controllers/commentController");

const router = require("express").Router();

router.post("/:id/comments", isAuthenticated, addComment);

module.exports = router;
