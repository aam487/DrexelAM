// routes/profile.js
const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../db/database');

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session.user) return next();
  res.redirect('/auth/login');
}

// GET /profile - Serve the profile page
router.get('/', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'profile.html'));
});

// POST /profile - Update the user's profile
router.post('/', isAuthenticated, (req, res) => {
  const { username, email, password, role } = req.body;
  const userId = req.session.user.id;

  if (password) {
    // Update profile including the new plain text password
    const query = "UPDATE users SET name = ?, email = ?, password = ?, role = ? WHERE id = ?";
    db.db.run(query, [username, email, password, role, userId], function(err) {
      if (err) return res.status(500).send('Error updating profile.');
      // Update session info
      req.session.user = { id: userId, name: username, email, role, password };
      res.redirect('/');
    });
  } else {
    // Update without changing the password
    const query = "UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?";
    db.db.run(query, [username, email, role, userId], function(err) {
      if (err) return res.status(500).send('Error updating profile.');
      req.session.user = { id: userId, name: username, email, role, password: req.session.user.password };
      res.redirect('/');
    });
  }
});

module.exports = router;
