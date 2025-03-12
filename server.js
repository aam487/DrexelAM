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
  secret: 'your-secret-key', // Use a strong secret for production
  resave: false,
  saveUninitialized: false
}));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Mount route modules
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blog');
const profileRoutes = require('./routes/profile');
const sessionRoutes = require('./routes/session');


app.use('/auth', authRoutes);
app.use('/blog', blogRoutes);
app.use('/profile', profileRoutes);
app.use('/session', sessionRoutes);

// New route: If user is logged in, serve blog.html as the dashboard/blog page.
app.get('/blog', (req, res) => {
  if (req.session.user) {
    res.sendFile(path.join(__dirname, 'public', 'blog.html'));
  } else {
    res.redirect('/auth/login');
  }
});

// Home route: If not logged in, show the welcome page.
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'welcomepage.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
