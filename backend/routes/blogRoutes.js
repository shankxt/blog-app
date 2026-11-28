const {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
} = require("../controllers/blogController");
const { isAuthenticated } = require("../middleware/authMiddleware");

const router = require("express").Router();

router.post("/", isAuthenticated, createBlog);
router.get("/", getAllBlogs);
router.get("/:id", getSingleBlog);
router.put("/:id", isAuthenticated, updateBlog);

module.exports = router;
