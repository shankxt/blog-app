const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Controller for registering a new user
const registerUser = async (req, res) => {
  try {
    // Extract user details from request body
    const { username, email, password } = req.body;

    // Validate all required fields
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Normalize email to maintain consistency
    // trim() removes extra spaces and toLowerCase() converts email to lowercase
    const normalizedEmail = email.trim().toLowerCase();

    // Check whether a user already exists with the provided email
    const existingUser = await User.findOne({ email: normalizedEmail });

    // Prevent duplicate user registration
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash the user's password before storing it in the database
    // 10 represents the salt rounds used by bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user document in MongoDB
    const user = await User.create({
      username,
      email: normalizedEmail,
      password: hashedPassword,
    });

    // Return successful registration response
    // 201 -> Resource created successfully
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (err) {
    // Handle unexpected server errors
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message, // TODO: Recommended: Remove this for production level code
    });
  }
};

// Controller for authenticating an existing user
const loginUser = async (req, res) => {
  try {
    // Extract login credentials from request body
    const { email, password } = req.body;

    // Validate required login fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Normalize email before searching in database
    const normalizedEmail = email.trim().toLowerCase();

    // Find user using normalized email
    const existingUser = await User.findOne({ email: normalizedEmail });

    // Check whether the user exists
    // 401 -> Unauthorized request
    if (!existingUser) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare entered password with the hashed password stored in database
    // bcrypt.compare() returns true if both passwords match
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password,
    );

    // Reject login if password does not match
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT token after successful authentication
    // Payload contains the logged-in user's ID
    // JWT_SECRET is used to sign the token
    // Token expires after 7 days
    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    // Store JWT token inside an HTTP cookie
    res.cookie("token", token, {
      // Prevent client-side JavaScript from accessing the cookie
      httpOnly: true,

      // Allow cookies only over HTTPS in production
      secure: process.env.NODE_ENV === "production",

      // Control cross-site cookie sending behavior
      sameSite: "lax",

      // Cookie expiration time: 7 days in milliseconds
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Return successful login response
    return res.status(200).json({
      success: true,
      message: "Login successful",
    });
  } catch (err) {
    // Handle unexpected server errors
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Controller for logging out the currently authenticated user
const logoutUser = async (req, res) => {
  try {
    // Clear the authentication cookie from the client's browser
    // Cookie options should match the options used while setting the cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    // Return successful logout response
    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (err) {
    // Handle unexpected server errors
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Export authentication controllers to use them inside routes
module.exports = { registerUser, loginUser, logoutUser };
