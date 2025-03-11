// routes/blog.js
const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../database');

// Middleware to check if a user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/auth/login');
}

// GET /blog/all - Retrieve all blogs with optional sorting

router.get('/all', (req, res) => {
  const sort = req.query.sort;
  let query = `
    SELECT b.*, COUNT(c.id) AS commentCount 
    FROM blogs b 
    LEFT JOIN comments c ON b.id = c.blog_id 
    GROUP BY b.id 
  `;
  if (sort === 'comments') {
    query += "ORDER BY commentCount DESC";
  } else {
    query += "ORDER BY b.created_at DESC";
  }
  db.db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).send("Error retrieving blogs.");
    }
    res.json(rows);
  });
});

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
    res.redirect('/blog'); // Redirect to blog dashboard
  });
});

// POST /blog/edit/:id - Edit an existing blog post (only by the author)
router.post('/edit/:id', isAuthenticated, (req, res) => {
  const blogId = req.params.id;
  const { title, content } = req.body;
  db.db.get("SELECT * FROM blogs WHERE id = ?", [blogId], (err, blog) => {
    if (err || !blog) {
      return res.status(404).send('Blog not found.');
    }
    if (blog.author_id !== req.session.user.id) {
      return res.status(403).send('Not authorized to edit this blog.');
    }
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
  // Check if the blog exists
  db.db.get("SELECT * FROM blogs WHERE id = ?", [blog_id], (err, blog) => {
    if (err || !blog) {
      return res.status(404).send('Blog not found.');
    }
    const user_id = req.session.user.id;
    db.addComment(blog_id, user_id, content, (err, comment) => {
      if (err) {
        return res.status(500).send('Error adding comment.');
      }
      // Respond with JSON so the client can refresh the comment list
      res.json({ success: true, comment });
    });
  });
});


// POST /blog/comment/delete/:id - Delete a comment (only if it belongs to the logged-in user)
router.post('/comment/delete/:id', isAuthenticated, (req, res) => {
  const commentId = req.params.id;
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
