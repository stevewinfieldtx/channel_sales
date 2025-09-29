const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysisController');

// Get industries data
router.get('/industries', async (req, res) => {
  try {
    // In production, you'd read from a database or file
    const industries = [
      {
        "industry": "Technology",
        "subindustries": ["Software Development", "Cloud Computing", "Cybersecurity", "IT Services", "Hardware"]
      },
      {
        "industry": "Healthcare",
        "subindustries": ["Electronic Health Records", "Telemedicine", "Medical Imaging", "Health Analytics", "Patient Management"]
      },
      {
        "industry": "Finance",
        "subindustries": ["Banking Software", "Financial Planning", "Risk Management", "Payment Processing", "Investment Platforms"]
      },
      {
        "industry": "Manufacturing",
        "subindustries": ["ERP Systems", "Supply Chain Management", "Quality Control", "Production Planning", "Inventory Management"]
      },
      {
        "industry": "Retail",
        "subindustries": ["E-commerce Platforms", "Point of Sale Systems", "Customer Relationship Management", "Inventory Management", "Marketing Automation"]
      },
      {
        "industry": "Education",
        "subindustries": ["Learning Management Systems", "Student Information Systems", "Educational Content", "Assessment Tools", "Virtual Classroom"]
      }
    ];
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