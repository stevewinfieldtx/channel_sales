const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysisController');
const fs = require('fs');
const path = require('path');

// Default industries fallback
const defaultIndustries = [
  {
    industry: 'Technology',
    subindustries: ['Software Development', 'Cloud Computing', 'Cybersecurity', 'IT Services', 'Hardware']
  },
  {
    industry: 'Healthcare',
    subindustries: ['Electronic Health Records', 'Telemedicine', 'Medical Imaging', 'Health Analytics', 'Patient Management']
  },
  {
    industry: 'Finance',
    subindustries: ['Banking Software', 'Financial Planning', 'Risk Management', 'Payment Processing', 'Investment Platforms']
  },
  {
    industry: 'Manufacturing',
    subindustries: ['ERP Systems', 'Supply Chain Management', 'Quality Control', 'Production Planning', 'Inventory Management']
  },
  {
    industry: 'Retail',
    subindustries: ['E-commerce Platforms', 'Point of Sale Systems', 'Customer Relationship Management', 'Inventory Management', 'Marketing Automation']
  },
  {
    industry: 'Education',
    subindustries: ['Learning Management Systems', 'Student Information Systems', 'Educational Content', 'Assessment Tools', 'Virtual Classroom']
  }
];

async function tryReadJson(filePath) {
  try {
    await fs.promises.access(filePath, fs.constants.R_OK);
    const content = await fs.promises.readFile(filePath, 'utf8');
    return JSON.parse(content);
  } catch (_) {
    return null;
  }
}

async function loadIndustriesFromDisk() {
  // Env override takes precedence
  const envPath = process.env.INDUSTRIES_JSON_PATH;
  if (envPath) {
    const fromEnv = await tryReadJson(envPath);
    if (fromEnv) return fromEnv;
  }
  // Common default locations
  const candidates = [
    path.join(__dirname, '..', 'data', 'industries.json'),
    path.join(__dirname, '..', '..', 'public', 'industries.json')
  ];
  for (const p of candidates) {
    const data = await tryReadJson(p);
    if (data) return data;
  }
  return null;
}

// Get industries data
router.get('/industries', async (_req, res) => {
  try {
    const fromDisk = await loadIndustriesFromDisk();
    const industries = Array.isArray(fromDisk) && fromDisk.length ? fromDisk : defaultIndustries;
    res.json(industries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load industries' });
  }
});

// Start analysis
router.post('/analyze', async (req, res) => {
  try {
    const { url, companyType, subindustries } = req.body;
    
    // Call OpenRouter API (implementation would go here)
    const result = await analysisController.startAnalysis(url, companyType, subindustries);
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Analysis failed' });
  }
});

module.exports = router;