// routes/auth.js
const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../database');

// Serve login page
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'loginpage.html'));
});

// Process login credentials by comparing plain-text passwords
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = "SELECT * FROM users WHERE name = ?";
  db.db.get(query, [username], (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server error during login.');
    }
    if (!user) {
      return res.status(401).send('Invalid credentials.');
    }
    if (password === user.password) {
      req.session.user = user;
      // Redirect to blog page after successful login
      req.session.user = user; // Save session
      res.json({ success: true, role: user.role }); // Return JSON response
    } else {
      res.status(401).send('Invalid credentials.');
    }
  });
});

// Serve registration page
router.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'signup.html'));
});

// Process user registration with plain-text password storage
router.post('/register', (req, res) => {
  const { username, email, password, role } = req.body;
  db.addUser(username, email, password, role, (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Registration failed.');
    }
    req.session.user = user;
    // Redirect to blog page after registration
    res.redirect('/blog');
  });
});

// Logout route
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
