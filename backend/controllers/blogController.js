const mongoose = require("mongoose");
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
    // Time for latest24Hours data only
    const now = new Date();
    const last24Hours = new Date(now - 24 * 60 * 60 * 1000);
    const dateFilter = {
      createdAt: {
        // $gte -> greaterthan or equal & $lte -> smallerthan or equal
        $gte: last24Hours,
        $lte: now,
      },
    };

    // Pagination Implementation
    const page = Number(req.query.page ?? 1); //accepts through query

    // query page validation
    if (!Number.isInteger(page) || Number.isNaN(page) || page < 1) {
      return res.status(400).json({
        success: false,
        message: "Incorrect page value",
      });
    }
    // Concepts for pagination & formulas
    const limit = 10; // content in one page
    const skip = (page - 1) * limit; // skip page iteration for next page's content
    const totalBlogs = await Blog.countDocuments(dateFilter); // find totalBlogs in our database
    const totalPages = Math.ceil(totalBlogs / limit); // totalPages formula

    // filter & sort blogs with pagination limits
    const blogs = await Blog.find(dateFilter)
      .sort({ createdAt: -1, _id: -1 })
      .skip(skip)
      .limit(limit);

    // check if no content avilable or fetched with pagination
    if (blogs.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No blogs available",
        pagination: {
          currentPage: page,
          totalBlogs,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
        blogs: [],
      });
    }

    // successfully return fetched blogs
    return res.status(200).json({
      success: true,
      message: "Blogs fetched successfully",
      pagination: {
        currentPage: page,
        totalBlogs,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      blogs: blogs,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getSingleBlog = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Id",
      });
    }

    const blog = await Blog.findById(id).populate("author", "fullName email");

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog doesn't exist",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Blog fetched successfully",
      blog: blog,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateBlog = async (req, res) => {
  try {
    const id = req.params.id;
    const { title, content, image } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Id",
      });
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog doesn't exist",
      });
    }

    if (!blog.author.equals(req.user.userId)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this blog",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = { createBlog, getAllBlogs, getSingleBlog, updateBlog };
