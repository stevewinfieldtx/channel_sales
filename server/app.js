require('dotenv').config();
const express = require('express');
const cors = require('cors');
const analysisRoutes = require('./routes/analysisRoutes');
const path = require('path');

const app = express();
const effectiveModel = process.env.OPENROUTER_MODEL || process.env.MODEL || process.env.LLM_MODEL || process.env.OPENROUTER_DEFAULT_MODEL || '';

// Middleware
app.use(cors());
app.use(express.json());

// Serve static assets
app.use(express.static(path.join(__dirname, '..', 'public')));

// Routes
app.use('/api', analysisRoutes);

// Fallback to index.html for root
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  if (effectiveModel) {
    console.log(`LLM model: ${effectiveModel}`);
  } else {
    console.log('LLM model not configured (set OPENROUTER_MODEL).');
  }
});