const mongoose = require("mongoose");
const Blog = require("../models/blogModel");

const addComment = async (req, res) => {
  try {
    // Get the blog ID from URL parameters
    const id = req.params.id;

    // Validate MongoDB ObjectId before querying the database
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

    // Get the comment text from request body
    const { text } = req.body;

    // Validate comment text
    if (typeof text !== "string") {
      return res.status(400).json({
        success: false,
        message: "Comment must be a string",
      });
    }

    // Reject empty or whitespace-only comments
    if (text.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Comment cannot be empty",
      });
    }

    // Add the new comment with the logged-in user's ID
    blog.comments.push({
      user: req.user.userId,
      text: text.trim(),
    });

    // Save the updated blog document in the database
    await blog.save();

    // Send success response
    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment: blog.comments[blog.comments.length - 1],
    });
  } catch (err) {
    // Log unexpected errors for debugging
    console.error("Add Comment Error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = { addComment };
