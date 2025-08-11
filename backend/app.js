const express = require('express');
const cors = require('cors');
const path = require('path');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api', productRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;
