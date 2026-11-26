const mongoose = require("mongoose");
const Blog = require("../models/blogModel");

// Controller for creating a new blog
const createBlog = async (req, res) => {
  try {
    // Extract blog details from request body
    const { title, content, image } = req.body;

    // Validate required fields
    // trim() removes extra whitespace from the beginning and end
    if (!title || !title.trim() || !content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide both title and content",
      });
    }

    // Create a new blog document in MongoDB
    // author is taken from the logged-in user's JWT payload
    const blog = await Blog.create({
      title,
      content,
      image,
      author: req.user.userId,
    });

    // Return successfully created blog
    // 201 -> Resource created successfully
    return res.status(201).json({
      success: true,
      message: "Blog created successfully",
      blog: blog,
    });
  } catch (err) {
    // TODO: Replace demo error handling with proper error logging later
    // 500 -> Internal server error
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Controller for fetching all blogs created within the latest 24 hours
const getAllBlogs = async (req, res) => {
  try {
    // Get the current date and time
    const now = new Date();

    // Calculate the date and time exactly 24 hours ago
    const last24Hours = new Date(now - 24 * 60 * 60 * 1000);

    // Create MongoDB date filter
    const dateFilter = {
      createdAt: {
        // $gte -> Greater than or equal to
        // $lte -> Less than or equal to
        // Fetch blogs created between last24Hours and now
        $gte: last24Hours,
        $lte: now,
      },
    };

    // Pagination Implementation

    // Get page number through query parameters
    // Default page will be 1 if page is not provided
    const page = Number(req.query.page ?? 1);

    // Validate page number
    // Page must be a positive integer
    if (!Number.isInteger(page) || Number.isNaN(page) || page < 1) {
      return res.status(400).json({
        success: false,
        message: "Incorrect page value",
      });
    }

    // Concepts for pagination & formulas

    // Maximum number of blogs displayed on one page
    const limit = 10;

    // Calculate how many documents should be skipped
    // Formula: (currentPage - 1) * limit
    const skip = (page - 1) * limit;

    // Count total blogs matching our date filter
    const totalBlogs = await Blog.countDocuments(dateFilter);

    // Calculate total number of pages
    // Math.ceil() rounds the result upwards
    const totalPages = Math.ceil(totalBlogs / limit);

    // Filter and sort blogs with pagination limits
    const blogs = await Blog.find(dateFilter)
      // Sort by newest blogs first
      // _id is used as a secondary sorting condition
      .sort({ createdAt: -1, _id: -1 })

      // Skip previously fetched documents
      .skip(skip)

      // Limit the number of documents returned
      .limit(limit);

    // Check if no blogs are available for the requested page
    if (blogs.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No blogs available",

        // Pagination metadata
        pagination: {
          currentPage: page,
          totalBlogs,
          totalPages,

          // Check whether next and previous pages exist
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },

        // Return an empty array when no blogs are found
        blogs: [],
      });
    }

    // Successfully return fetched blogs
    return res.status(200).json({
      success: true,
      message: "Blogs fetched successfully",

      // Pagination details for frontend navigation
      pagination: {
        currentPage: page,
        totalBlogs,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },

      // Return fetched blog documents
      blogs: blogs,
    });
  } catch (err) {
    // Handle unexpected server errors
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Controller for fetching a single blog using its ID
const getSingleBlog = async (req, res) => {
  try {
    // Get blog ID from URL parameters
    const id = req.params.id;

    // Validate MongoDB ObjectId before querying database
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Id",
      });
    }

    // Find blog by ID
    // populate() replaces author ObjectId with selected user details
    // Only fullName and email fields will be fetched from User model
    const blog = await Blog.findById(id).populate("author", "fullName email");

    // Check whether the requested blog exists
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog doesn't exist",
      });
    }

    // Return successfully fetched blog
    return res.status(200).json({
      success: true,
      message: "Blog fetched successfully",
      blog: blog,
    });
  } catch (err) {
    // Handle unexpected server errors
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Controller for updating an existing blog
const updateBlog = async (req, res) => {
  try {
    // Get blog ID from URL parameters
    const id = req.params.id;

    // Extract updated blog details from request body
    const { title, content, image } = req.body;

    // Validate MongoDB ObjectId before querying database
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Id",
      });
    }

    // Find the blog document using its ID
    const blog = await Blog.findById(id);

    // Check whether the requested blog exists
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog doesn't exist",
      });
    }

    // Check whether the logged-in user is the author of this blog
    // Only the original author is allowed to update their blog
    if (!blog.author.equals(req.user.userId)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this blog",
      });
    }
  } catch (err) {
    // Handle unexpected server errors
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Export all blog controllers to use them inside routes
module.exports = {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
};
