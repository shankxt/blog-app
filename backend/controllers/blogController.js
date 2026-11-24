const Blog = require("../models/blogModel");

const createBlog = async (req, res) => {
  try {
    const { title, content, image } = req.body;

    if (!title || !title.trim() || !content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide both title and content",
      });
    }

    const blog = await Blog.create({
      title,
      content,
      image,
      author: req.user.userId,
    });

    return res.status(201).json({
      success: true,
      message: "Blog created successfully",
      blog: blog,
    });
  } catch (err) {
    // TODO: This code needs to change later it is a demo code for try catch block implementation
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const now = new Date();
    const last24Hours = new Date(now - 24 * 60 * 60 * 1000);
    const page = Number(req.query.page) || 1;
    if (!page.isInteger() || !page.isNaN()) {
      return res.status(400).json({
        success: false,
        message: "Incorrect page value",
      });
    }
    const limit = 10;
    const skip = (page - 1) * limit;
    const blogs = await Blog.find({
      createdAt: {
        $gte: last24Hours,
        $lte: now,
      },
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (blogs.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No blogs available",
        blogs: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Blogs fetched successfully",
      blogs: blogs,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
module.exports = { createBlog, getAllBlogs };
