# Quill & Query

Quill & Query is a web-based blog management system that demonstrates key principles of software development. The application provides distinct views and functionalities for authors and readers. Authors can create, edit, and delete blog posts, while readers can view blogs, leave comments, and sort blogs dynamically based on date or comment count.

## Features

- **User Authentication:**
  - Separate roles for authors and readers.
  - Secure login and session management.

- **Blog Management (Authors):**
  - Create new blog posts.
  - Edit and delete your own blog posts.
  - Dynamic sorting of blogs (by date or by number of comments).

- **Comment Management (Readers & Authors):**
  - Add, edit, and delete comments.
  - Display the username of each commenter along with a timestamp.

- **Dynamic Sorting:**
  - A toggle button on both the reader and author dashboards allows users to sort blogs either by creation date or by the number of comments.

## Technologies Used

- **Backend:** Node.js with Express, SQLite3 for database, Express-session for session management.
- **Frontend:** HTML, CSS, and vanilla JavaScript.
- **Additional Libraries:** bcryptjs, dotenv, ejs, highlight.js, method-override, multer, passport, and passport-local.

## Installation

1. **Install dependencies:**

```bash
npm install
```

Note: Most of the dependencies were installed on an ARM architecture machine. If you are running on an x86 (Intel/AMD) system, you might need to rebuild the dependencies. In that case, run:

```bash
npm rebuild
```

or, if necessary:

```bash
rm -rf node_modules
npm install
```

2. **Configure Environment Variables:**

If needed, create a `.env` file in the project root to override default configurations (e.g., session secret, database path).

## Running the Application

Start the application with:

```bash
node server.js
```

Alternatively, add a start script to your `package.json`:

```json
"scripts": {
  "start": "node server.js"
}
```

Then run:

```bash
npm start
```

Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to view the application.

## Usage

### For Authors:
- Log in as an author to access your dashboard.
- Create new blog posts and manage your existing posts (edit/delete).
- Use the dynamic sort toggle to view your blogs sorted by date or by the number of comments.

### For Readers:
- Log in as a reader to view blogs and leave comments.
- Use the dynamic sort toggle to switch between sorting blogs by date or by comment count.
- Comments display the commenter’s username and timestamp.

## Troubleshooting

### Dependency Issues on x86 Systems:

If you encounter issues with native dependencies, try running:

```bash
npm rebuild
```

Or remove and reinstall the modules:

```bash
rm -rf node_modules
npm install
```

### Session & Authentication:

Ensure that your session configuration in `server.js` is correct and that cookies are enabled in your browser.

