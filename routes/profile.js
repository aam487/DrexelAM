// routes/profile.js
const express = require('express');
const router = express.Router();
const path = require('path');
// Updated require path to database module in project root
const db = require('../database');

// Middleware to check if the user is logged in
function isAuthenticated(req, res, next) {
  if (req.session.user) return next();
  res.redirect('/auth/login');
}

// GET /profile - Serve the profile page (static HTML)
router.get('/', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'profile.html'));
});

// POST /profile - Update user profile information
router.post('/', isAuthenticated, (req, res) => {
  const { username, email, password, role } = req.body;
  const userId = req.session.user.id;

  // If password field is provided, update it; otherwise update other fields only
  if (password) {
    const query = "UPDATE users SET name = ?, email = ?, password = ?, role = ? WHERE id = ?";
    db.db.run(query, [username, email, password, role, userId], function(err) {
      if (err) return res.status(500).send('Error updating profile.');
      req.session.user = { id: userId, name: username, email, role, password };
      res.redirect('/');
    });
  } else {
    const query = "UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?";
    db.db.run(query, [username, email, role, userId], function(err) {
      if (err) return res.status(500).send('Error updating profile.');
      req.session.user = { id: userId, name: username, email, role, password: req.session.user.password };
      res.redirect('/');
    });
  }
});

module.exports = router;
