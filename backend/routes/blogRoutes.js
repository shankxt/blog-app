const { createBlog,getAllBlogs } = require("../controllers/blogController");
const { isAuthenticated } = require("../middleware/authMiddleware");

const router = require("express").Router();

router.post("/", isAuthenticated, createBlog);
router.get("/", isAuthenticated, getAllBlogs);

module.exports = router;
