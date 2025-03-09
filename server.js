// server.js
const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure session management
app.use(session({
  secret: 'your-secret-key', // Replace with a strong secret in production
  resave: false,
  saveUninitialized: false
}));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Mount route modules
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blog');
const profileRoutes = require('./routes/profile');

app.use('/auth', authRoutes);
app.use('/blog', blogRoutes);
app.use('/profile', profileRoutes);

// Home route serves the welcome page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'welcomepage.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
