// routes/blog.js
const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../db/database');

// Middleware to check if a user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/auth/login');
}

// GET /blog/:id - Retrieve and display a single blog post along with its comments
router.get('/:id', (req, res) => {
  const blogId = req.params.id;
  db.db.get("SELECT * FROM blogs WHERE id = ?", [blogId], (err, blog) => {
    if (err || !blog) {
      return res.status(404).send('Blog not found.');
    }
    // Retrieve comments for the blog using helper function
    db.getComments(blogId, (err, comments) => {
      if (err) {
        return res.status(500).send('Error retrieving comments.');
      }
     
      res.json({ blog, comments });
    });
  });
});

// POST /blog/create - Create a new blog post (authors only)
router.post('/create', isAuthenticated, (req, res) => {
  if (req.session.user.role !== 'author') {
    return res.status(403).send('Only authors can create blogs.');
  }
  const { title, content } = req.body;
  const author_id = req.session.user.id;
  db.addBlog(author_id, title, content, (err, blog) => {
    if (err) {
      return res.status(500).send('Error creating blog.');
    }
    res.redirect('/'); // Redirect to home or the new blog post page
  });
});

// POST /blog/edit/:id - Edit an existing blog post (only by the author)
router.post('/edit/:id', isAuthenticated, (req, res) => {
  const blogId = req.params.id;
  const { title, content } = req.body;
  // Check if the logged-in user owns the blog
  db.db.get("SELECT * FROM blogs WHERE id = ?", [blogId], (err, blog) => {
    if (err || !blog) {
      return res.status(404).send('Blog not found.');
    }
    if (blog.author_id !== req.session.user.id) {
      return res.status(403).send('Not authorized to edit this blog.');
    }
    // Update blog details
    const query = "UPDATE blogs SET title = ?, content = ? WHERE id = ?";
    db.db.run(query, [title, content, blogId], function(err) {
      if (err) {
        return res.status(500).send('Error updating blog.');
      }
      res.redirect(`/blog/${blogId}`);
    });
  });
});

// POST /blog/delete/:id - Delete a blog post (only by the author)
router.post('/delete/:id', isAuthenticated, (req, res) => {
  const blogId = req.params.id;
  db.db.get("SELECT * FROM blogs WHERE id = ?", [blogId], (err, blog) => {
    if (err || !blog) {
      return res.status(404).send('Blog not found.');
    }
    if (blog.author_id !== req.session.user.id) {
      return res.status(403).send('Not authorized to delete this blog.');
    }
    db.deleteBlog(blogId, (err) => {
      if (err) {
        return res.status(500).send('Error deleting blog.');
      }
      res.redirect('/');
    });
  });
});

// POST /blog/comment - Add a comment to a blog post
router.post('/comment', isAuthenticated, (req, res) => {
  const { blog_id, content } = req.body;
  const user_id = req.session.user.id;
  db.addComment(blog_id, user_id, content, (err, comment) => {
    if (err) {
      return res.status(500).send('Error adding comment.');
    }
    res.redirect(`/blog/${blog_id}`);
  });
});

// POST /blog/comment/delete/:id - Delete a comment (only if it belongs to the logged-in user)
router.post('/comment/delete/:id', isAuthenticated, (req, res) => {
  const commentId = req.params.id;
  // Retrieve the comment to check ownership
  db.db.get("SELECT * FROM comments WHERE id = ?", [commentId], (err, comment) => {
    if (err || !comment) {
      return res.status(404).send('Comment not found.');
    }
    if (comment.user_id !== req.session.user.id) {
      return res.status(403).send('Not authorized to delete this comment.');
    }
    db.deleteComment(commentId, (err) => {
      if (err) {
        return res.status(500).send('Error deleting comment.');
      }
      res.redirect('back');
    });
  });
});

module.exports = router;
