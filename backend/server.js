const app = require('./app');
const connectDB = require('./config/database');
require('dotenv').config();

const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Start server
app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
