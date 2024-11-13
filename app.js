const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.route.js');
const messageRoutes = require('./routes/message.route.js');
const cors = require('cors');

const app = express();

// Enable CORS

app.use(cors());
app.use(express.urlencoded({extended: true}))
// Connect to DB
connectDB();

// Middleware to parse JSON
app.use(express.json());

// Auth routes
app.use('/api/auth', authRoutes);

// Message routes
app.use('/api/messages', messageRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
