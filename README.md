# Blog Website Backend

A RESTful backend for a blog platform where users can create blogs,
browse recent posts, view their own blogs, and comment on other users'
blogs.

## Features

-   User registration and login
-   Role-based users: `user` and `admin`
-   Create, read, update, and delete blogs
-   Optional image for each blog
-   View the latest blogs published within the last 24 hours
-   Paginated home feed with 10 blogs per page
-   Personal profile showing the logged-in user's blogs
-   Add and view comments on blogs
-   Admin panel and admin-specific features --- planned, not implemented
    yet

## Tech Stack

-   Node.js
-   Express.js
-   MongoDB
-   Mongoose
-   JWT authentication

## Main Models

### User

  Field                   Type     Notes
  ----------------------- -------- --------------------------------------------
  username                String   Required
  email                   String   Required, unique
  password                String   Required; store a securely hashed password
  role                    String   `user` or `admin`; defaults to `user`
  createdAt / updatedAt   Date     Managed by timestamps

### Blog

  Field                   Type       Notes
  ----------------------- ---------- -----------------------
  title                   String     Required
  content                 String     Required
  image                   String     Optional
  author                  ObjectId   Reference to User
  createdAt / updatedAt   Date       Managed by timestamps

### Comment

  Field                   Type       Notes
  ----------------------- ---------- -----------------------
  content                 String     Required
  blog                    ObjectId   Reference to Blog
  author                  ObjectId   Reference to User
  createdAt / updatedAt   Date       Managed by timestamps

## Core API Modules

-   **Auth:** Register and login
-   **Users:** Get profile and the logged-in user's blogs
-   **Blogs:** Create, list, view, update, and delete blogs
-   **Comments:** Add and retrieve comments for a blog
-   **Admin:** To be developed

## Home Feed Rules

-   Show blogs created within the latest 24 hours.
-   Return 10 blogs per page.
-   Use pagination parameters such as `page` and `limit`.
-   Sort blogs by newest first.

## Getting Started

1.  Clone the repository.

2.  Install dependencies:

    ``` bash
    npm install
    ```

3.  Create a `.env` file in the project root:

    ``` env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

4.  Start the development server:

    ``` bash
    npm run dev
    ```

> Add your actual start scripts to `package.json` if they are not
> configured yet.

## Project Status

Backend development is starting. The admin panel and admin-specific
functionality are planned for a later phase.
