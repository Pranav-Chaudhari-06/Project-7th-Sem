const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const modelRequestRoutes = require('./routes/modelrequest');
const userRoutes = require('./routes/user');

const app = express();

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/immersive-homes', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB:', err);
});

// Session Middleware
app.use(session({
  secret: 'f441b454c20ba74761e8cd4725c6e01b33b7d24f01e10aaf12db5e51172806bba1c8fac1805b51fceb290059772cee766b50f3752cac0e17c766e44ddc4444c2',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/immersive-homes' }),
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    httpOnly: true,
    secure: false, // Set to true in production with HTTPS
  },
}));

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true, // Allow cookies for session-based auth
}));

// Routes
app.use('/api/models', modelRequestRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
