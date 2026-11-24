const mongoose = require("mongoose");
const Blog = require("./models/blogModel");
require("dotenv").config();

const authorId = "6afc5938d73a88ec7e960361";

const demoBlogs = [
  {
    title: "Getting Started with JavaScript",
    content:
      "Learn JavaScript fundamentals, variables, data types and functions.",
  },
  {
    title: "Understanding Node.js",
    content:
      "Node.js allows developers to execute JavaScript outside the browser.",
  },
  {
    title: "Complete Guide to Express.js",
    content: "Express.js makes building REST APIs simple and efficient.",
  },
  {
    title: "MongoDB for Beginners",
    content:
      "MongoDB is a NoSQL database that stores information in documents.",
  },
  {
    title: "Understanding Mongoose",
    content:
      "Mongoose provides schema-based modeling for MongoDB applications.",
  },
  {
    title: "What is React?",
    content:
      "React is a JavaScript library used for building interactive user interfaces.",
  },
  {
    title: "Introduction to REST APIs",
    content:
      "REST APIs allow different applications to communicate through HTTP.",
  },
  {
    title: "Understanding HTTP Methods",
    content: "GET, POST, PUT, PATCH and DELETE are commonly used HTTP methods.",
  },
  {
    title: "JWT Authentication Explained",
    content:
      "JSON Web Tokens are commonly used to implement stateless authentication.",
  },
  {
    title: "How Middleware Works in Express",
    content: "Middleware functions can access request and response objects.",
  },
  {
    title: "Learning CSS Flexbox",
    content:
      "Flexbox helps developers create flexible one-dimensional layouts.",
  },
  {
    title: "CSS Grid Complete Guide",
    content: "CSS Grid is useful for creating two-dimensional layouts.",
  },
  {
    title: "JavaScript Array Methods",
    content: "Learn map, filter, reduce, find and other useful array methods.",
  },
  {
    title: "Understanding Async Await",
    content:
      "Async and await make asynchronous JavaScript easier to understand.",
  },
  {
    title: "Promises in JavaScript",
    content:
      "Promises represent the eventual completion or failure of asynchronous operations.",
  },
  {
    title: "Git and GitHub Basics",
    content: "Git helps developers track changes and collaborate on projects.",
  },
  {
    title: "Introduction to Tailwind CSS",
    content:
      "Tailwind CSS provides utility classes for rapidly building interfaces.",
  },
  {
    title: "Building Your First MERN App",
    content: "MERN combines MongoDB, Express, React and Node.js.",
  },
  {
    title: "Understanding Database Relationships",
    content: "Learn how documents can reference other documents in MongoDB.",
  },
  {
    title: "How Pagination Works",
    content: "Pagination divides large datasets into smaller manageable pages.",
  },
  {
    title: "Error Handling in Express",
    content: "Proper error handling makes backend applications more reliable.",
  },
  {
    title: "Introduction to Web Development",
    content:
      "Web development involves frontend, backend and database technologies.",
  },
  {
    title: "What is an API Endpoint?",
    content:
      "An endpoint is a specific URL through which an API exposes functionality.",
  },
  {
    title: "Understanding JavaScript Closures",
    content:
      "Closures allow functions to remember variables from their outer scope.",
  },
  {
    title: "How Browser Cookies Work",
    content:
      "Cookies allow websites to store small pieces of information in browsers.",
  },
  {
    title: "Introduction to Software Testing",
    content:
      "Testing helps developers identify bugs and verify application behaviour.",
  },
  {
    title: "Why Clean Code Matters",
    content: "Readable and maintainable code makes collaboration easier.",
  },
  {
    title: "Understanding MVC Architecture",
    content:
      "MVC separates application logic into models, views and controllers.",
  },
  {
    title: "Building Secure Backend APIs",
    content:
      "Input validation, authentication and authorization improve API security.",
  },
  {
    title: "The Future of Full Stack Development",
    content:
      "Full stack developers work across frontend and backend technologies.",
  },
].map((blog) => ({
  ...blog,
  image: "",
  author: authorId,
}));

const seedBlogs = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const result = await Blog.insertMany(demoBlogs);

    console.log(`${result.length} demo blogs inserted successfully`);

    await mongoose.disconnect();
  } catch (error) {
    console.error("Seeding failed:", error.message);
    await mongoose.disconnect();
    process.exitCode = 1;
  }
};

seedBlogs();
