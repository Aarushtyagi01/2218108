const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const urlRoutes = require('./routes/url');
app.use('/api', urlRoutes);

app.listen(PORT, () => {
  // No console.log, use logging middleware when needed
}); 