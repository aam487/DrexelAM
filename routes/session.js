// routes/session.js
const express = require('express');
const router = express.Router();

// Return current user session info (user ID) as JSON
router.get('/info', (req, res) => {
  if (req.session && req.session.user) {
    res.json({ userId: req.session.user.id });
  } else {
    res.json({ userId: null });
  }
});

module.exports = router;
