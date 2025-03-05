// database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to the SQLite database
const db = new sqlite3.Database(path.join(__dirname, 'database.db'), (err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Create tables if not created already
db.serialize(() => {
    // Users Table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT CHECK(role IN ('author', 'reader')) NOT NULL
    );`);

    // Blogs Table
    db.run(`CREATE TABLE IF NOT EXISTS blogs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        author_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);

    // Comments Table
    db.run(`CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        blog_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);

    console.log('Database tables created successfully.');
});

// Functions for database interactions
module.exports = {
    // Get all users
    getUsers: (callback) => {
        db.all("SELECT * FROM users", callback);
    },

    // Add a new user
    addUser: (name, email, password, role, callback) => {
        const stmt = db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)");
        stmt.run(name, email, password, role, function (err) {
            callback(err, { id: this.lastID, name, email, role });
        });
        stmt.finalize();
    },

    // Get all blog posts ordered by timestamp
    getBlogs: (callback) => {
        db.all("SELECT * FROM blogs ORDER BY created_at DESC", callback);
    },

    // Add a new blog post
    addBlog: (author_id, title, content, callback) => {
        const stmt = db.prepare("INSERT INTO blogs (author_id, title, content) VALUES (?, ?, ?)");
        stmt.run(author_id, title, content, function (err) {
            callback(err, { id: this.lastID, author_id, title, content });
        });
        stmt.finalize();
    },

    // Get comments for a blog post ordered by timestamp
    getComments: (blog_id, callback) => {
        db.all("SELECT * FROM comments WHERE blog_id = ? ORDER BY created_at DESC", [blog_id], callback);
    },

    // Add a comment to a blog post
    addComment: (blog_id, user_id, content, callback) => {
        const stmt = db.prepare("INSERT INTO comments (blog_id, user_id, content) VALUES (?, ?, ?)");
        stmt.run(blog_id, user_id, content, function (err) {
            callback(err, { id: this.lastID, blog_id, user_id, content });
        });
        stmt.finalize();
    },

    // Delete a user and their blogs/comments
    deleteUser: (user_id, callback) => {
        db.serialize(() => {
            db.run("DELETE FROM comments WHERE user_id = ?", [user_id], (err) => {
                if (err) return callback(err);

                db.run("DELETE FROM blogs WHERE author_id = ?", [user_id], (err) => {
                    if (err) return callback(err);

                    db.run("DELETE FROM users WHERE id = ?", [user_id], callback);
                });
            });
        });
    },

    // Delete a blog and its comments
    deleteBlog: (blog_id, callback) => {
        db.serialize(() => {
            db.run("DELETE FROM comments WHERE blog_id = ?", [blog_id], (err) => {
                if (err) return callback(err);

                db.run("DELETE FROM blogs WHERE id = ?", [blog_id], callback);
            });
        });
    },

    // Delete a comment
    deleteComment: (comment_id, callback) => {
        db.run("DELETE FROM comments WHERE id = ?", [comment_id], callback);
    }
};
